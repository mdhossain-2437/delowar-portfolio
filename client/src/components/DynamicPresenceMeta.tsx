import { useEffect } from "react";

const DEFAULT_TITLE = "Delowar Hossain | Product Engineer & AI Explorer";
const AWAY_TITLE = "Come back, builder!";
const ACTIVE_ICON = "/icon-192.png";
const AWAY_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='32' fill='%23020817'/%3E%3Ctext x='64' y='80' text-anchor='middle' font-size='60' fill='%23f97316'%3E👋%3C/text%3E%3C/svg%3E";

export default function DynamicPresenceMeta() {
  useEffect(() => {
    const handleVisibility = () => {
      const link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (document.hidden) {
        document.title = AWAY_TITLE;
        if (link) link.href = AWAY_ICON;
      } else {
        document.title = DEFAULT_TITLE;
        if (link) link.href = ACTIVE_ICON;
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return null;
}
