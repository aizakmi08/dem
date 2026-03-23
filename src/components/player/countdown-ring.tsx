import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';
import type { SharedValue } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 280;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

interface CountdownRingProps {
  progress: SharedValue<number>;
  children?: React.ReactNode;
}

export const CountdownRing = memo(function CountdownRing({
  progress,
  children,
}: CountdownRingProps) {
  const { colors } = useTheme();

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: (1 - progress.value) * CIRCUMFERENCE,
  }));

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill={colors.surface}
          stroke={colors.border}
          strokeWidth={STROKE_WIDTH}
        />
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={colors.accent}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          transform={`rotate(-90, ${CENTER}, ${CENTER})`}
        />
      </Svg>
      <View style={styles.content}>{children}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
