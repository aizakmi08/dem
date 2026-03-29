import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { getExerciseById } from '@/content/exercises';
import type { Routine } from '@/content/types';
import { usePlayerStore } from '@/stores/use-player-store';
import { usePlayerTimer } from '@/hooks/use-player-timer';
import { useSaveProgress } from '@/hooks/use-save-progress';
import { PlayerHeader } from './player-header';
import { ProgressBar } from './progress-bar';
import { CountdownRing } from './countdown-ring';
import { ExerciseIllustration } from './exercise-illustration';
import { TimerDisplay } from './timer-display';
import { PlayerControls } from './player-controls';
import { StartingCountdown } from './starting-countdown';
import { TransitionRest } from './transition-rest';
import { CompletionScreen } from './completion-screen';
import { PauseOverlay } from './pause-overlay';
import { ExerciseInfoModal } from '@/components/routine-detail/exercise-info-modal';
import { PlayerOptionsDrawer } from './player-options-drawer';
import type { PlayerOptionsDrawerRef } from './player-options-drawer';
import { useSettingsStore } from '@/stores/use-settings-store';
import { useSounds } from '@/hooks/use-sounds';

interface PlayerScreenProps {
  routine: Routine;
}

export function PlayerScreen({ routine }: PlayerScreenProps) {
  const router = useRouter();
  const { colors, typography } = useTheme();

  const exercises = usePlayerStore((s) => s.exercises);
  const sessionId = usePlayerStore((s) => s.sessionId);
  const routineId = usePlayerStore((s) => s.routineId);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const status = usePlayerStore((s) => s.status);
  const exercisesCompleted = usePlayerStore((s) => s.exercisesCompleted);
  const elapsedSeconds = usePlayerStore((s) => s.elapsedSeconds);
  const transitionIndex = usePlayerStore((s) => s.transitionIndex);
  const { setStatus, advance, finishTransition, retreat, tick, reset } =
    usePlayerStore.getState();

  const transitionTime = useSettingsStore((s) => s.transitionTime);
  const { playCountdown, playTransition, playComplete, playRestEnd } = useSounds();

  const currentExercise = exercises[currentIndex];
  const holdSeconds = currentExercise?.holdSeconds ?? 30;

  const exercise = useMemo(
    () => (currentExercise ? getExerciseById(currentExercise.exerciseId) : null),
    [currentExercise],
  );

  const nextExercise = useMemo(() => {
    const next = exercises[transitionIndex];
    return next ? getExerciseById(next.exerciseId) ?? null : null;
  }, [exercises, transitionIndex]);

  const [displaySeconds, setDisplaySeconds] = useState(holdSeconds);
  const [showInfo, setShowInfo] = useState(false);
  const displaySecondsRef = useRef(displaySeconds);
  displaySecondsRef.current = displaySeconds;
  const wasPlayingRef = useRef(false);
  const optionsDrawerRef = useRef<PlayerOptionsDrawerRef>(null);
  const ringScreenYRef = useRef(0);
  const ringHeightRef = useRef(0);
  const bodyOffsetRef = useRef(0);
  const [countdownLayout, setCountdownLayout] = useState({ y: 0, h: 0 });

  useEffect(() => {
    setDisplaySeconds(holdSeconds);
  }, [holdSeconds, currentIndex]);

  useEffect(() => {
    if (status !== 'playing') return;

    const interval = setInterval(() => {
      if (displaySecondsRef.current <= 0) return;
      const next = displaySecondsRef.current - 1;
      if (next > 0 && next <= 3) playCountdown();
      setDisplaySeconds((prev) => prev - 1);
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tick]);

  const handleBackground = useCallback(() => {
    const currentStatus = usePlayerStore.getState().status;
    if (
      currentStatus === 'playing' ||
      currentStatus === 'countdown' ||
      currentStatus === 'transitioning'
    ) {
      setStatus('paused');
    }
  }, [setStatus]);

  const { progress, resetTimer } = usePlayerTimer({
    duration: holdSeconds,
    exerciseIndex: currentIndex,
    status,
    onComplete: advance,
    onBackground: handleBackground,
  });

  const handlePlayPause = useCallback(() => {
    if (status === 'playing') {
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('playing');
    }
  }, [status, setStatus]);

  const handlePrev = useCallback(() => {
    const elapsed = holdSeconds - displaySecondsRef.current;
    if (elapsed < 3 && currentIndex > 0) {
      retreat();
    } else {
      setDisplaySeconds(holdSeconds);
      resetTimer(holdSeconds);
    }
  }, [holdSeconds, currentIndex, retreat, resetTimer]);

  const handleCountdownComplete = useCallback(() => {
    setStatus('playing');
  }, [setStatus]);

  const handleClose = useCallback(() => {
    reset();
    router.back();
  }, [reset, router]);

  const handleMenu = useCallback(() => {
    optionsDrawerRef.current?.present();
  }, []);

  const handleInfoOpen = useCallback(() => {
    wasPlayingRef.current = usePlayerStore.getState().status === 'playing';
    setStatus('paused');
    setShowInfo(true);
  }, [setStatus]);

  const handleInfoClose = useCallback(() => {
    setShowInfo(false);
    if (wasPlayingRef.current) {
      setStatus('playing');
    }
  }, [setStatus]);

  useSaveProgress({
    sessionId,
    routineId,
    status,
    durationSeconds: elapsedSeconds,
    exercisesCompleted,
    exercisesTotal: exercises.length,
  });

  useEffect(() => {
    if (status === 'transitioning') playTransition();
    if (status === 'playing' && currentIndex > 0) playRestEnd();
    if (status === 'complete') playComplete();
  }, [status, playTransition, playComplete, playRestEnd, currentIndex]);

  if (status === 'complete') {
    return (
      <CompletionScreen
        durationSeconds={elapsedSeconds}
        exercisesCompleted={exercisesCompleted}
        exercisesTotal={exercises.length}
        onDone={handleClose}
      />
    );
  }

  if (!currentExercise || !exercise) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.surface }]}>
      <PlayerHeader
        current={currentIndex + 1}
        total={exercises.length}
        onClose={handleClose}
        onMenu={handleMenu}
      />

      <ProgressBar current={currentIndex} total={exercises.length} />

      <View
        style={styles.body}
        onLayout={(e) => { bodyOffsetRef.current = e.nativeEvent.layout.y; }}
      >
        <View
          style={styles.ringArea}
          onLayout={(e) => {
            const y = bodyOffsetRef.current + e.nativeEvent.layout.y;
            const h = e.nativeEvent.layout.height;
            if (y !== ringScreenYRef.current || h !== ringHeightRef.current) {
              ringScreenYRef.current = y;
              ringHeightRef.current = h;
              setCountdownLayout({ y, h });
            }
          }}
        >
          <CountdownRing progress={progress}>
            <ExerciseIllustration
              exerciseName={exercise.name}
              colorIndex={currentIndex}
              iconFilename={exercise.iconFilename}
            />
          </CountdownRing>
        </View>

        <View style={styles.exerciseInfo}>
          <View style={styles.nameRow}>
            <Text style={[typography.heading, { color: colors.text }]}>
              {exercise.name}
            </Text>
            <Pressable
              onPress={handleInfoOpen}
              hitSlop={12}
              style={({ pressed }) => [
                styles.infoButton,
                { backgroundColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>i</Text>
            </Pressable>
          </View>
        </View>

        <TimerDisplay seconds={displaySeconds} />
      </View>

      <PlayerControls
        status={status}
        onPrev={handlePrev}
        onPlayPause={handlePlayPause}
        onNext={advance}
      />

      {status === 'paused' && (
        <PauseOverlay
          onResume={() => usePlayerStore.getState().setStatus('playing')}
          onEnd={() => { usePlayerStore.getState().reset(); router.back(); }}
        />
      )}

      {status === 'countdown' && (
        <View style={styles.countdownOverlay} pointerEvents="none">
          <View
            style={[
              styles.countdownText,
              { top: countdownLayout.y, height: countdownLayout.h },
            ]}
          >
            <StartingCountdown onComplete={handleCountdownComplete} />
          </View>
        </View>
      )}

      {status === 'transitioning' && (
        <TransitionRest
          transitionTime={transitionTime}
          nextExercise={nextExercise}
          nextColorIndex={transitionIndex}
          onComplete={finishTransition}
          onSkip={finishTransition}
        />
      )}

      <ExerciseInfoModal
        exercise={showInfo ? exercise : null}
        visible={showInfo}
        onClose={handleInfoClose}
      />

      <PlayerOptionsDrawer ref={optionsDrawerRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    alignItems: 'center',
    paddingTop: 28,
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 10,
  },
  countdownText: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
