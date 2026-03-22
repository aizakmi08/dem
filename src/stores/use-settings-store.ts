import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface SettingsState {
  theme: Theme;
  soundEnabled: boolean;
  transitionTime: number;

  setTheme: (theme: Theme) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTransitionTime: (seconds: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      soundEnabled: true,
      transitionTime: 10,

      setTheme: (theme) => set({ theme }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setTransitionTime: (transitionTime) => set({ transitionTime }),
    }),
    {
      name: 'dem-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
