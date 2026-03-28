import { id } from '@instantdb/react-native';
import { create } from 'zustand';
import type { RoutineExercise } from '@/content/types';

export type PlayerStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'complete';

interface PlayerExercise {
  exerciseId: string;
  holdSeconds: number;
}

interface PlayerState {
  sessionId: string;
  routineId: string;
  exercises: PlayerExercise[];
  currentIndex: number;
  status: PlayerStatus;
  elapsedSeconds: number;
  exercisesCompleted: number;

  initSession: (
    routineId: string,
    holdTimes: Record<string, number>,
    exercises: RoutineExercise[],
  ) => void;
  setStatus: (status: PlayerStatus) => void;
  advance: () => void;
  retreat: () => void;
  tick: () => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  sessionId: '',
  routineId: '',
  exercises: [],
  currentIndex: 0,
  status: 'idle',
  elapsedSeconds: 0,
  exercisesCompleted: 0,

  initSession: (routineId, holdTimes, exercises) => {
    const sorted = [...exercises].sort((a, b) => a.order - b.order);
    set({
      sessionId: id(),
      routineId,
      exercises: sorted.map((e) => ({
        exerciseId: e.exerciseId,
        holdSeconds: holdTimes[e.exerciseId] ?? e.holdSeconds,
      })),
      currentIndex: 0,
      status: 'countdown',
      elapsedSeconds: 0,
      exercisesCompleted: 0,
    });
  },

  setStatus: (status) => set({ status }),

  advance: () => {
    const { currentIndex, exercises, exercisesCompleted, status } = get();
    if (status === 'complete') return;
    if (currentIndex + 1 >= exercises.length) {
      set({
        status: 'complete',
        exercisesCompleted: exercisesCompleted + 1,
      });
    } else {
      set({
        currentIndex: currentIndex + 1,
        status: 'playing',
        exercisesCompleted: exercisesCompleted + 1,
      });
    }
  },

  retreat: () => {
    const { currentIndex, exercisesCompleted } = get();
    if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        status: 'playing',
        exercisesCompleted: Math.max(0, exercisesCompleted - 1),
      });
    }
  },

  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),

  reset: () =>
    set({
      sessionId: '',
      routineId: '',
      exercises: [],
      currentIndex: 0,
      status: 'idle',
      elapsedSeconds: 0,
      exercisesCompleted: 0,
    }),
}));
