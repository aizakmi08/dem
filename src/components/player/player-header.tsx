import { memo, useCallback } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';

interface PlayerHeaderProps {
  current: number;
  total: number;
  onClose: () => void;
  onMenu: () => void;
}

export const PlayerHeader = memo(function PlayerHeader({
  current,
  total,
  onClose,
  onMenu,
}: PlayerHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();

  const handleClose = useCallback(() => {
    Alert.alert('End Routine?', 'Are you sure you want to end this session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Session', style: 'destructive', onPress: onClose },
    ]);
  }, [onClose]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Pressable
        onPress={handleClose}
        hitSlop={16}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <Path
            d="M5 5L15 15M15 5L5 15"
            stroke={colors.text}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </Pressable>

      <Text style={[styles.title, typography.subheading, { color: colors.text }]}>
        {current} of {total}
      </Text>

      <Pressable
        onPress={onMenu}
        hitSlop={16}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <Circle cx="10" cy="4" r="1.5" fill={colors.textSecondary} />
          <Circle cx="10" cy="10" r="1.5" fill={colors.textSecondary} />
          <Circle cx="10" cy="16" r="1.5" fill={colors.textSecondary} />
        </Svg>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
});
