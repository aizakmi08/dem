import { memo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, lightColors } from '@/theme';
import { useSettingsStore } from '@/stores/use-settings-store';

const SEGMENT_WIDTH = 62;
const SEGMENT_HEIGHT = 32;
const PADDING = 3;

const ACTIVE_TEXT_COLOR = lightColors.text;

export const ThemeSwitcher = memo(function ThemeSwitcher() {
  const { colors } = useTheme();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const position = useSharedValue(theme === 'light' ? 0 : 1);

  useEffect(() => {
    position.value = theme === 'light' ? 0 : 1;
  }, [theme, position]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(position.value * SEGMENT_WIDTH, { duration: 250 }) }],
  }));

  const handleSelect = useCallback(
    (value: 'light' | 'dark') => {
      position.value = value === 'light' ? 0 : 1;
      setTheme(value);
    },
    [setTheme, position],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.border }]}>
      <Animated.View
        style={[styles.indicator, { backgroundColor: colors.white }, indicatorStyle]}
      />
      <Pressable onPress={() => handleSelect('light')} style={styles.segment}>
        <Text style={[styles.label, { color: theme === 'light' ? ACTIVE_TEXT_COLOR : colors.text }]}>
          Light
        </Text>
      </Pressable>
      <Pressable onPress={() => handleSelect('dark')} style={styles.segment}>
        <Text style={[styles.label, { color: theme === 'dark' ? ACTIVE_TEXT_COLOR : colors.text }]}>
          Dark
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: PADDING,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: PADDING,
    left: PADDING,
    width: SEGMENT_WIDTH,
    height: SEGMENT_HEIGHT,
    borderRadius: 8,
  },
  segment: {
    width: SEGMENT_WIDTH,
    height: SEGMENT_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
