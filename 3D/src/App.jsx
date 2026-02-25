import "./App.scss";
import React, { useEffect } from "react";
import Experience from "./Experience/Experience";
import { useResponsiveStore } from "./stores/useResponsiveStore";
import { useExperienceStore } from "./stores/experienceStore";
import { useToggleRoomStore } from "./stores/toggleRoomStore";

function App() {
  const { updateDimensions } = useResponsiveStore();
  const { setIsExperienceReady } = useExperienceStore();
  const { isDarkRoom, setDarkRoom, isTransitioning } = useToggleRoomStore();

  useEffect(() => {
    setIsExperienceReady();

    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const handleToggle = () => {
    if (!isTransitioning) {
      setDarkRoom(!isDarkRoom);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isTransitioning}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 100,
          padding: "12px 24px",
          fontSize: "14px",
          fontWeight: "600",
          border: "none",
          borderRadius: "8px",
          cursor: isTransitioning ? "not-allowed" : "pointer",
          backgroundColor: isDarkRoom ? "#ffffff" : "#1a1a1a",
          color: isDarkRoom ? "#1a1a1a" : "#ffffff",
          transition: "all 0.3s ease",
          opacity: isTransitioning ? 0.5 : 1,
        }}
      >
        {isDarkRoom ? "☀️ Light Room" : "🌙 Dark Room"}
      </button>
      <Experience />
    </>
  );
}

export default App;
