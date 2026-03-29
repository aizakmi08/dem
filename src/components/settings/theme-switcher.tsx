import { memo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme, lightColors } from '@/theme';
import { useSettingsStore, type Theme } from '@/stores/use-settings-store';
import { useProfile } from '@/hooks/use-profile';
import { updateTheme } from '@/hooks/use-profile-sync';

const SEGMENT_WIDTH = 80;
const SEGMENT_HEIGHT = 34;
const PADDING = 3;

const ACTIVE_TEXT_COLOR = lightColors.text;

const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const POSITION_MAP: Record<string, number> = { light: 0, dark: 1 };

export const ThemeSwitcher = memo(function ThemeSwitcher() {
  const { colors } = useTheme();
  const { profile } = useProfile();
  const theme = useSettingsStore((s) => s.theme);

  // Treat "system" as light for the toggle position
  const activeTheme = theme === 'system' ? 'light' : theme;
  const position = useSharedValue(POSITION_MAP[activeTheme] ?? 0);

  useEffect(() => {
    position.value = POSITION_MAP[activeTheme] ?? 0;
  }, [activeTheme]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(position.value * SEGMENT_WIDTH, { duration: 200 }) }],
  }));

  const handleSelect = useCallback(
    (value: Theme) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Update store immediately for instant UI response
      useSettingsStore.getState().setTheme(value);
      position.value = POSITION_MAP[value] ?? 0;
      // Write to DB in background (don't await)
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
      {THEMES.map((t) => (
        <Pressable key={t.value} onPress={() => handleSelect(t.value)} style={styles.segment}>
          <Text
            style={[
              styles.label,
              { color: activeTheme === t.value ? ACTIVE_TEXT_COLOR : colors.textSecondary },
            ]}
          >
            {t.label}
          </Text>
        </Pressable>
      ))}
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
    fontFamily: 'Nunito_600SemiBold',
  },
});
