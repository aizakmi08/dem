import { useCallback, useRef } from 'react';
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
import type { Period } from '@/stores/use-onboarding-store';

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
const SCROLL_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2);

type TimeScrollPickerProps = {
  defaultHour?: number;
  defaultMinute?: number;
  defaultPeriod?: Period;
  onTimeChange: (hour: number, minute: number, period: Period) => void;
};

function ScrollItem({
  label,
  index,
  scrollY,
  textColor,
}: {
  label: string;
  index: number;
  scrollY: SharedValue<number>;
  textColor: string;
}) {

  const animatedStyle = useAnimatedStyle(() => {
    const center = scrollY.value / ITEM_HEIGHT;
    const distance = index - center;
    const absDistance = Math.abs(distance);

    const scale = interpolate(
      absDistance,
      [0, 1, 2],
      [1.2, 1.0, 0.85],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      absDistance,
      [0, 1, 2],
      [1, 0.5, 0.25],
      Extrapolation.CLAMP,
    );

    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={styles.itemContainer}>
      <Animated.Text
        style={[
          styles.itemText,
          { color: textColor, fontFamily: 'Nunito_700Bold' },
          animatedStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </View>
  );
}

function ScrollColumn({
  items,
  defaultIndex,
  onSelect,
  textColor,
}: {
  items: string[];
  defaultIndex: number;
  onSelect: (index: number) => void;
  textColor: string;
}) {
  const scrollY = useSharedValue(defaultIndex * ITEM_HEIGHT);

  const handleSelect = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      onSelect(clamped);
    },
    [items.length, onSelect],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      runOnJS(handleSelect)(index);
    },
  });

  return (
    <Animated.ScrollView
      style={styles.column}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentOffset={{ x: 0, y: defaultIndex * ITEM_HEIGHT }}
    >
      <View style={{ height: SCROLL_PADDING }} />
      {items.map((label, i) => (
        <ScrollItem key={label} label={label} index={i} scrollY={scrollY} textColor={textColor} />
      ))}
      <View style={{ height: SCROLL_PADDING }} />
    </Animated.ScrollView>
  );
}

const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0'),
);
const PERIODS = ['AM', 'PM'];

export function TimeScrollPicker({
  defaultHour = 9,
  defaultMinute = 0,
  defaultPeriod = 'AM',
  onTimeChange,
}: TimeScrollPickerProps) {
  const { colors, radius } = useTheme();

  const hourRef = useRef(defaultHour);
  const minuteRef = useRef(defaultMinute);
  const periodRef = useRef(defaultPeriod);

  const emitChange = useCallback(() => {
    onTimeChange(hourRef.current, minuteRef.current, periodRef.current);
  }, [onTimeChange]);

  const onHourSelect = useCallback(
    (index: number) => {
      hourRef.current = index + 1;
      emitChange();
    },
    [emitChange],
  );

  const onMinuteSelect = useCallback(
    (index: number) => {
      minuteRef.current = index;
      emitChange();
    },
    [emitChange],
  );

  const onPeriodSelect = useCallback(
    (index: number) => {
      periodRef.current = index === 0 ? 'AM' : 'PM';
      emitChange();
    },
    [emitChange],
  );

  return (
    <View style={[styles.container, { height: PICKER_HEIGHT }]}>
      <View
        style={[
          styles.highlight,
          {
            top: SCROLL_PADDING,
            backgroundColor: colors.surface,
            borderRadius: radius.md,
          },
        ]}
        pointerEvents="none"
      />
      <View style={styles.columns}>
        <ScrollColumn
          items={HOURS}
          defaultIndex={defaultHour - 1}
          onSelect={onHourSelect}
          textColor={colors.text}
        />
        <ScrollColumn
          items={MINUTES}
          defaultIndex={defaultMinute}
          onSelect={onMinuteSelect}
          textColor={colors.text}
        />
        <ScrollColumn
          items={PERIODS}
          defaultIndex={defaultPeriod === 'AM' ? 0 : 1}
          onSelect={onPeriodSelect}
          textColor={colors.text}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  columns: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 60,
  },
  column: {
    flex: 1,
  },
  highlight: {
    position: 'absolute',
    left: 48,
    right: 48,
    height: ITEM_HEIGHT,
    zIndex: 0,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 20,
    lineHeight: 26,
  },
});
