import { memo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, lightColors } from '@/theme';
import { useSettingsStore, type Theme } from '@/stores/use-settings-store';
import { useProfile } from '@/hooks/use-profile';
import { updateTheme } from '@/hooks/use-profile-sync';

const SEGMENT_WIDTH = 62;
const SEGMENT_HEIGHT = 32;
const PADDING = 3;

const ACTIVE_TEXT_COLOR = lightColors.text;

const POSITION_MAP: Record<Theme, number> = { light: 0, dark: 1, system: 2 };

export const ThemeSwitcher = memo(function ThemeSwitcher() {
  const { colors } = useTheme();
  const { profile } = useProfile();
  const theme = useSettingsStore((s) => s.theme);

  const position = useSharedValue(POSITION_MAP[theme]);

  useEffect(() => {
    position.value = POSITION_MAP[theme];
  }, [theme]); // position is a stable shared value ref

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(position.value * SEGMENT_WIDTH, { duration: 250 }) }],
  }));

  const handleSelect = useCallback(
    (value: Theme) => {
      position.value = POSITION_MAP[value];
      if (profile?.id) {
        updateTheme(profile.id, value);
      }
    },
    [profile?.id, position],
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
      <Pressable onPress={() => handleSelect('system')} style={styles.segment}>
        <Text style={[styles.label, { color: theme === 'system' ? ACTIVE_TEXT_COLOR : colors.text }]}>
          Auto
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
