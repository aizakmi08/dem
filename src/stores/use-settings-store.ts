import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: Theme;
  soundEnabled: boolean;
  transitionTime: number;

  setTheme: (theme: Theme) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTransitionTime: (seconds: number) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      soundEnabled: true,
      transitionTime: 10,

      setTheme: (theme) => set({ theme }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setTransitionTime: (transitionTime) => set({ transitionTime }),
      resetSettings: () => set({ theme: 'system', soundEnabled: true, transitionTime: 10 }),
    }),
    {
      name: 'dem-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
