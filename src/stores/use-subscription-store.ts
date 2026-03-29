import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PlanType = 'yearly' | 'monthly';

const FREE_SESSION_LIMIT = 1;

interface SubscriptionState {
  isPremium: boolean;
  plan: PlanType | null;
  completedSessions: number;

  incrementSessions: () => void;
  canStartSession: () => boolean;
  setPremium: (plan: PlanType | null) => void;
  setNotPremium: () => void;
  resetSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      isPremium: false,
      plan: null,
      completedSessions: 0,

      incrementSessions: () =>
        set((s) => ({ completedSessions: s.completedSessions + 1 })),
      canStartSession: () => {
        const { isPremium, completedSessions } = get();
        return isPremium || completedSessions < FREE_SESSION_LIMIT;
      },
      setPremium: (plan) => set({ isPremium: true, plan }),
      setNotPremium: () => set({ isPremium: false, plan: null }),
      resetSubscription: () =>
        set({ isPremium: false, plan: null, completedSessions: 0 }),
    }),
    {
      name: 'dem-subscription',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export { FREE_SESSION_LIMIT };
