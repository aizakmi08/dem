import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSounds } from '@/hooks/use-sounds';
import { useTheme } from '@/theme';

interface StartingCountdownProps {
  onComplete: () => void;
}

const STEPS = ['3', '2', '1', 'Start!'];

export function StartingCountdown({ onComplete }: StartingCountdownProps) {
  const { colors, typography } = useTheme();
  const [stepIndex, setStepIndex] = useState(-1);
  const onCompleteRef = useRef(onComplete);
  const didCompleteRef = useRef(false);
  onCompleteRef.current = onComplete;
  const scale = useSharedValue(1);
  const { playCountdown, playStart } = useSounds();

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Start after a brief delay so audio players are ready
  useEffect(() => {
    const startDelay = setTimeout(() => setStepIndex(0), 100);
    return () => clearTimeout(startDelay);
  }, []);

  // Advance every second after initial step
  useEffect(() => {
    if (stepIndex < 0) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, STEPS.length));
    }, 1000);

    return () => clearInterval(interval);
  }, [stepIndex >= 0]);

  // Play sound + animate on each step
  useEffect(() => {
    if (stepIndex < 0) return;

    if (stepIndex >= STEPS.length) {
      if (!didCompleteRef.current) {
        didCompleteRef.current = true;
        onCompleteRef.current();
      }
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (STEPS[stepIndex] === 'Start!') {
      playStart();
    } else {
      playCountdown();
    }

    scale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(1.0, { duration: 200 }),
    );
  }, [stepIndex]);

  if (stepIndex < 0) return null;

  const label = STEPS[Math.min(stepIndex, STEPS.length - 1)];
  const isStart = label === 'Start!';

  return (
    <View style={styles.container}>
      <Animated.View style={scaleStyle}>
        <Text
          style={[
            isStart ? typography.title : styles.number,
            { color: isStart ? colors.primary : colors.accent },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 72,
    lineHeight: 86,
    fontWeight: '800',
  },
});
