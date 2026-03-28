import { useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import {
  useSharedValue,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { PlayerStatus } from '@/stores/use-player-store';

interface UsePlayerTimerOptions {
  duration: number;
  exerciseIndex: number;
  status: PlayerStatus;
  onComplete: () => void;
  onBackground: () => void;
}

export function usePlayerTimer({
  duration,
  exerciseIndex,
  status,
  onComplete,
  onBackground,
}: UsePlayerTimerOptions) {
  const progress = useSharedValue(1);
  const onCompleteRef = useRef(onComplete);
  const onBackgroundRef = useRef(onBackground);
  const completionArmedRef = useRef(false);
  const lastExerciseIndexRef = useRef(exerciseIndex);

  onCompleteRef.current = onComplete;
  onBackgroundRef.current = onBackground;

  const fireComplete = useCallback(() => {
    if (!completionArmedRef.current) return;
    completionArmedRef.current = false;
    onCompleteRef.current();
  }, []);

  const startTimer = useCallback(
    (fromProgress: number, dur: number) => {
      const remainingMs = Math.max(0, fromProgress * dur * 1000);
      completionArmedRef.current = true;
      cancelAnimation(progress);
      progress.value = withTiming(
        0,
        { duration: remainingMs, easing: Easing.linear },
        (finished) => {
          if (finished) {
            scheduleOnRN(fireComplete);
          }
        },
      );
    },
    [progress, fireComplete],
  );

  const pauseTimer = useCallback(() => {
    completionArmedRef.current = false;
    cancelAnimation(progress);
  }, [progress]);

  const resetProgress = useCallback(() => {
    completionArmedRef.current = false;
    cancelAnimation(progress);
    progress.value = 1;
  }, [progress]);

  const resetTimer = useCallback(
    (newDuration?: number) => {
      resetProgress();
      if (newDuration !== undefined && status === 'playing') {
        startTimer(1, newDuration);
      }
    },
    [resetProgress, startTimer, status],
  );

  useEffect(() => {
    const didExerciseChange = lastExerciseIndexRef.current !== exerciseIndex;
    if (didExerciseChange) {
      lastExerciseIndexRef.current = exerciseIndex;
      resetProgress();
    }

    if (status === 'playing') {
      startTimer(didExerciseChange ? 1 : progress.value, duration);
      return;
    }

    pauseTimer();
  }, [duration, exerciseIndex, pauseTimer, progress, resetProgress, startTimer, status]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        onBackgroundRef.current();
      }
    });
    return () => sub.remove();
  }, []);

  return { progress, resetTimer };
}
