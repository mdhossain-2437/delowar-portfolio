import { create } from "zustand";

interface RoomStore {
  isDarkRoom: boolean;
  isTransitioning: boolean;
  isBeforeZooming: boolean;
  isExperienceReady: boolean;
  isMobile: boolean;
  screenWidth: number;
  screenHeight: number;
  setDarkRoom: (value: boolean) => void;
  setIsTransitioning: (value: boolean) => void;
  setIsBeforeZooming: (value: boolean) => void;
  setIsExperienceReady: () => void;
  updateDimensions: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  isDarkRoom: true,
  isTransitioning: false,
  isBeforeZooming: false,
  isExperienceReady: false,
  isMobile: typeof window !== "undefined" ? window.innerWidth < 768 : false,
  screenWidth: typeof window !== "undefined" ? window.innerWidth : 1024,
  screenHeight: typeof window !== "undefined" ? window.innerHeight : 768,

  setDarkRoom: (value) => set({ isDarkRoom: value }),
  setIsTransitioning: (value) => set({ isTransitioning: value }),
  setIsBeforeZooming: (value) => set({ isBeforeZooming: value }),
  setIsExperienceReady: () => set({ isExperienceReady: true }),
  updateDimensions: () =>
    set({
      isMobile: window.innerWidth < 768,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    }),
}));
