import { useEffect, useState } from "react";

type WeatherSnapshot = {
  condition: string;
  description: string;
  temperature: number | null;
  isRaining: boolean;
};

const DEFAULT_WEATHER: WeatherSnapshot = {
  condition: "Unknown",
  description: "",
  temperature: null,
  isRaining: false,
};

const getHour = () => new Date().getHours();

const evaluateNightMode = (hour = getHour()) => hour >= 19 || hour < 6;

const setBodyClass = (className: string, enabled: boolean) => {
  if (enabled) {
    document.body.classList.add(className);
  } else {
    document.body.classList.remove(className);
  }
};

export function useEnvironmentContext() {
  const [weather, setWeather] = useState<WeatherSnapshot>(DEFAULT_WEATHER);
  const [isNight, setIsNight] = useState<boolean>(() => evaluateNightMode());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isPowerSaving, setIsPowerSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const interval = setInterval(() => setIsNight(evaluateNightMode()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }

    const handlePosition: PositionCallback = ({ coords }) => {
      const { latitude, longitude } = coords;
      fetch(`/api/environment/weather?lat=${latitude}&lon=${longitude}`)
        .then(async (res) => {
          if (!res.ok) throw new Error("Weather fetch failed");
          return (await res.json()) as WeatherSnapshot & { timestamp: number };
        })
        .then((payload) => {
          setWeather({
            condition: payload.condition,
            description: payload.description,
            temperature: payload.temperature,
            isRaining: payload.isRaining,
          });
          setLastUpdated(payload.timestamp);
        })
        .catch(() => {
          setWeather(DEFAULT_WEATHER);
        });
    };

    const handleError: PositionErrorCallback = () => {
      setWeather(DEFAULT_WEATHER);
    };

    navigator.geolocation.getCurrentPosition(handlePosition, handleError, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 5 * 60 * 1000,
    });
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || typeof navigator.getBattery !== "function") {
      return;
    }
    let mounted = true;
    navigator.getBattery().then((battery) => {
      if (!mounted) return;
      const updateBattery = () => {
        setBatteryLevel(battery.level);
        setIsPowerSaving(battery.level <= 0.2 || battery.charging === false);
      };
      updateBattery();
      battery.addEventListener("levelchange", updateBattery);
      battery.addEventListener("chargingchange", updateBattery);
      return () => {
        battery.removeEventListener("levelchange", updateBattery);
        battery.removeEventListener("chargingchange", updateBattery);
      };
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setBodyClass("theme-night", isNight);
    setBodyClass("theme-day", !isNight);
  }, [isNight]);

  useEffect(() => {
    setBodyClass("weather-rain", weather.isRaining);
    setBodyClass("weather-clear", !weather.isRaining);
  }, [weather]);

  useEffect(() => {
    setBodyClass("power-saving", isPowerSaving);
  }, [isPowerSaving]);

  return {
    weather,
    isNight,
    batteryLevel,
    isPowerSaving,
    lastUpdated,
  };
}
