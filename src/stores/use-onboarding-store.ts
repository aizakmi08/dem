import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Gender = 'male' | 'female' | 'prefer_not_to_say';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';
export type GoalKey = 'flexibility' | 'health' | 'pain' | 'stress' | 'athletic' | 'circulation' | 'recovery' | 'posture';
export type Period = 'AM' | 'PM';
export type StretchTime =
  | 'after_waking'
  | 'after_coffee'
  | 'after_exercise'
  | 'work_break'
  | 'before_bed'
  | 'other';

interface OnboardingState {
  age: number | null;
  gender: Gender | null;
  experience: ExperienceLevel | null;
  goals: GoalKey[];
  stretchTime: StretchTime | null;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  reminderPeriod: Period;

  setAge: (age: number) => void;
  setGender: (gender: Gender) => void;
  setExperience: (experience: ExperienceLevel) => void;
  setGoals: (goals: GoalKey[]) => void;
  setStretchTime: (time: StretchTime) => void;
  setReminder: (hour: number, minute: number, period: Period) => void;
  skipReminder: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      age: null,
      gender: null,
      experience: null,
      goals: [],
      stretchTime: null,
      reminderEnabled: true,
      reminderHour: 9,
      reminderMinute: 0,
      reminderPeriod: 'AM' as Period,

      setAge: (age) => set({ age }),
      setGender: (gender) => set({ gender }),
      setExperience: (experience) => set({ experience }),
      setGoals: (goals) => set({ goals }),
      setStretchTime: (stretchTime) => set({ stretchTime }),
      setReminder: (reminderHour, reminderMinute, reminderPeriod) =>
        set({ reminderHour, reminderMinute, reminderPeriod, reminderEnabled: true }),
      skipReminder: () => set({ reminderEnabled: false }),
    }),
    {
      name: 'dem-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
