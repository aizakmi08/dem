import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { useProgressData } from '@/hooks/use-progress-data';
import { StreakHero } from '@/components/progress/streak-hero';
import { ProgressCalendar } from '@/components/progress/progress-calendar';
import { StatCard } from '@/components/progress/stat-card';

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { activityCounts, currentStreak, bestStreak, totalSessions, totalMinutes } =
    useProgressData();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <StreakHero count={currentStreak} />
      <ProgressCalendar activityCounts={activityCounts} />

      <View style={styles.statsRow}>
        <StatCard value={totalSessions} label="Sessions" />
        <StatCard value={totalMinutes} label="Minutes" />
        <StatCard value={bestStreak} label="Best Streak" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
});
