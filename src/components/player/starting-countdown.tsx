import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

interface StartingCountdownProps {
  onComplete: () => void;
}

const STEPS = ['3', '2', '1', 'Start!'];

export function StartingCountdown({ onComplete }: StartingCountdownProps) {
  const { colors, typography } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const didCompleteRef = useRef(false);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, STEPS.length));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stepIndex >= STEPS.length && !didCompleteRef.current) {
      didCompleteRef.current = true;
      onCompleteRef.current();
    }
  }, [stepIndex]);

  const label = STEPS[Math.min(stepIndex, STEPS.length - 1)];
  const isStart = label === 'Start!';

  return (
    <View style={styles.container}>
      <Text
        style={[
          isStart ? typography.title : styles.number,
          { color: isStart ? colors.primary : colors.accent },
        ]}
      >
        {label}
      </Text>
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
