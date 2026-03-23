import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import { formatSeconds } from '@/lib/utils';
import { StatCard } from '@/components/progress/stat-card';

interface CompletionScreenProps {
  durationSeconds: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  onDone: () => void;
}

export function CompletionScreen({
  durationSeconds,
  exercisesCompleted,
  exercisesTotal,
  onDone,
}: CompletionScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, typography, radius } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.body}>
        <View style={[styles.checkCircle, { backgroundColor: colors.surface }]}>
          <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
            <Path
              d="M16 28L24 36L40 20"
              stroke={colors.primary}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <Text style={[typography.title, styles.title, { color: colors.text }]}>
          Great stretch!
        </Text>
        <Text style={[typography.body, styles.subtitle, { color: colors.textSecondary }]}>
          You completed your routine. Keep up the great work!
        </Text>

        <View style={styles.stats}>
          <StatCard value={formatSeconds(durationSeconds)} label="Duration" />
          <StatCard value={`${exercisesCompleted}/${exercisesTotal}`} label="Exercises" />
        </View>
      </View>

      <View
        style={[styles.bottomAction, { paddingBottom: Math.max(insets.bottom, 48) }]}
      >
        <Pressable
          onPress={onDone}
          style={({ pressed }) => [
            styles.doneButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.xl,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[typography.button, { color: colors.white }]}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    paddingTop: 20,
  },
  subtitle: {
    textAlign: 'center',
    paddingTop: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 36,
    paddingHorizontal: 24,
  },
  bottomAction: {
    paddingHorizontal: 24,
  },
  doneButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
