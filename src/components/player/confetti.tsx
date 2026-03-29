import { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = ['#E8BFB1', '#B5C4A8', '#C4B8AA', '#DBBFAF', '#C4603B', '#5C7A5C'];
const PIECE_COUNT = 20;

interface Piece {
  x: number;
  size: number;
  color: string;
  duration: number;
  rotation: number;
  isCircle: boolean;
}

const pieces: Piece[] = Array.from({ length: PIECE_COUNT }, () => ({
  x: Math.random() * SCREEN_WIDTH,
  size: 8 + Math.random() * 8,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  duration: 1500 + Math.random() * 1500,
  rotation: Math.random() * 360,
  isCircle: Math.random() > 0.5,
}));

function ConfettiPiece({ piece, index }: { piece: Piece; index: number }) {
  const translateY = useSharedValue(-20);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(SCREEN_HEIGHT + 20, {
      duration: piece.duration,
      easing: Easing.linear,
    });
    rotate.value = withTiming(piece.rotation, {
      duration: piece.duration,
      easing: Easing.linear,
    });
    opacity.value = withDelay(
      3000,
      withTiming(0, { duration: 500 }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: piece.x,
          top: -20,
          width: piece.size,
          height: piece.size,
          backgroundColor: piece.color,
          borderRadius: piece.isCircle ? piece.size / 2 : 2,
        },
        animatedStyle,
      ]}
    />
  );
}

export function Confetti() {
  return (
    <Animated.View style={styles.container} pointerEvents="none">
      {pieces.map((piece, index) => (
        <ConfettiPiece key={index} piece={piece} index={index} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
