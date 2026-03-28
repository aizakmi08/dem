import { useState, useEffect, useRef, memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { ExerciseIllustration } from './exercise-illustration';
import type { Exercise } from '@/content/types';

interface TransitionRestProps {
  transitionTime: number;
  nextExercise: Exercise | null;
  nextColorIndex: number;
  onComplete: () => void;
  onSkip: () => void;
}

export const TransitionRest = memo(function TransitionRest({
  transitionTime,
  nextExercise,
  nextColorIndex,
  onComplete,
  onSkip,
}: TransitionRestProps) {
  const { colors, typography } = useTheme();
  const [seconds, setSeconds] = useState(transitionTime);
  const onCompleteRef = useRef(onComplete);
  const didCompleteRef = useRef(false);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    didCompleteRef.current = false;
    setSeconds(transitionTime);
  }, [transitionTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds <= 0 && !didCompleteRef.current) {
      didCompleteRef.current = true;
      onCompleteRef.current();
    }
  }, [seconds]);

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={[typography.overline, styles.restLabel, { color: colors.textSecondary }]}>
          Rest
        </Text>

        <Text style={[styles.countdown, { color: colors.accent }]}>
          {seconds}
        </Text>

        {nextExercise && (
          <View style={styles.nextUp}>
            <View style={styles.illustrationWrapper}>
              <ExerciseIllustration
                exerciseName={nextExercise.name}
                colorIndex={nextColorIndex}
                iconFilename={nextExercise.iconFilename}
              />
            </View>
            <Text style={[typography.overline, { color: colors.textSecondary }]}>
              Next up
            </Text>
            <Text style={[typography.heading, { color: colors.white }]}>
              {nextExercise.name}
            </Text>
          </View>
        )}

        <Pressable
          onPress={onSkip}
          style={({ pressed }) => [
            styles.skipButton,
            { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[typography.bodyMedium, { color: colors.white }]}>
            Skip Rest
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 8,
  },
  restLabel: {
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  countdown: {
    fontSize: 72,
    lineHeight: 86,
    fontWeight: '800',
  },
  nextUp: {
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  illustrationWrapper: {
    marginBottom: 8,
  },
  skipButton: {
    marginTop: 40,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 28,
  },
});
