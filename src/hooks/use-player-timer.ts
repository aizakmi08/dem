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

  onCompleteRef.current = onComplete;
  onBackgroundRef.current = onBackground;

  const fireComplete = useCallback(() => {
    onCompleteRef.current();
  }, []);

  const startTimer = useCallback(
    (fromProgress: number, dur: number) => {
      const remainingMs = fromProgress * dur * 1000;
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
    cancelAnimation(progress);
  }, [progress]);

  const resetTimer = useCallback(
    (newDuration?: number) => {
      cancelAnimation(progress);
      progress.value = 1;
      if (newDuration !== undefined && status === 'playing') {
        startTimer(1, newDuration);
      }
    },
    [progress, startTimer, status],
  );

  // Intentionally omits duration — timer resumes from current progress at current duration
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (status === 'playing') {
      startTimer(progress.value, duration);
    } else if (status === 'paused' || status === 'countdown') {
      pauseTimer();
    }
  }, [status]);

  // Intentionally omits status/duration — keyed on exercise transitions only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    cancelAnimation(progress);
    progress.value = 1;
    if (status === 'playing') {
      startTimer(1, duration);
    }
  }, [exerciseIndex]);

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
