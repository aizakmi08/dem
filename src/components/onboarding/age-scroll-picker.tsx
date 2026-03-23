import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  type SharedValue,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 7;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;

type AgeScrollPickerProps = {
  minAge?: number;
  maxAge?: number;
  defaultAge?: number;
  onAgeChange: (age: number) => void;
};

function AgeItem({
  age,
  index,
  scrollY,
}: {
  age: number;
  index: number;
  scrollY: SharedValue<number>;
}) {
  const { colors } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const center = scrollY.value / ITEM_HEIGHT;
    const distance = index - center;
    const absDistance = Math.abs(distance);

    const scale = interpolate(
      absDistance,
      [0, 1, 2, 3],
      [1.3, 1.0, 0.85, 0.75],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      absDistance,
      [0, 1, 2, 3],
      [1, 0.6, 0.35, 0.2],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.itemContainer}>
      <Animated.Text
        style={[
          styles.itemText,
          {
            color: colors.text,
            fontFamily: 'Nunito_700Bold',
          },
          animatedStyle,
        ]}
      >
        {age} years
      </Animated.Text>
    </View>
  );
}

export function AgeScrollPicker({
  minAge = 13,
  maxAge = 80,
  defaultAge = 23,
  onAgeChange,
}: AgeScrollPickerProps) {
  const { colors, radius } = useTheme();
  const ages = Array.from({ length: maxAge - minAge + 1 }, (_, i) => minAge + i);
  const defaultIndex = defaultAge - minAge;

  const scrollY = useSharedValue(defaultIndex * ITEM_HEIGHT);

  const handleAgeChange = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, ages.length - 1));
      onAgeChange(ages[clampedIndex]);
    },
    [ages, onAgeChange],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      runOnJS(handleAgeChange)(index);
    },
  });

  const paddingVertical = ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2);

  return (
    <View style={[styles.container, { height: PICKER_HEIGHT }]}>
      <View
        style={[
          styles.highlight,
          {
            top: paddingVertical,
            backgroundColor: colors.surface,
            borderRadius: radius.md,
          },
        ]}
        pointerEvents="none"
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentOffset={{ x: 0, y: defaultIndex * ITEM_HEIGHT }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          handleAgeChange(index);
        }}
      >
        <View style={{ height: paddingVertical }} />
        {ages.map((age, i) => (
          <AgeItem key={age} age={age} index={i} scrollY={scrollY} />
        ))}
        <View style={{ height: paddingVertical }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: ITEM_HEIGHT,
    zIndex: 0,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 22,
    lineHeight: 28,
  },
});
