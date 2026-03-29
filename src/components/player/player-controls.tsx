import { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Svg, Path, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import type { PlayerStatus } from '@/stores/use-player-store';

interface PlayerControlsProps {
  status: PlayerStatus;
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
}

export const PlayerControls = memo(function PlayerControls({
  status,
  onPrev,
  onPlayPause,
  onNext,
}: PlayerControlsProps) {
  const { colors } = useTheme();
  const isPlaying = status === 'playing';

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPrev();
        }}
        style={({ pressed }) => [
          styles.secondaryButton,
          { backgroundColor: colors.background, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M19 17L11 12L19 7V17Z" fill={colors.text} />
          <Path d="M5 7V17" stroke={colors.text} strokeWidth={2.5} strokeLinecap="round" />
        </Svg>
      </Pressable>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPlayPause();
        }}
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        {isPlaying ? (
          <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
            <Rect x="7" y="5" width="5" height="18" rx={1} fill={colors.white} />
            <Rect x="16" y="5" width="5" height="18" rx={1} fill={colors.white} />
          </Svg>
        ) : (
          <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
            <Path d="M9 5L23 14L9 23V5Z" fill={colors.white} />
          </Svg>
        )}
      </Pressable>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onNext();
        }}
        style={({ pressed }) => [
          styles.secondaryButton,
          { backgroundColor: colors.background, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M5 7L13 12L5 17V7Z" fill={colors.text} />
          <Path d="M19 7V17" stroke={colors.text} strokeWidth={2.5} strokeLinecap="round" />
        </Svg>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    paddingBottom: 64,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
