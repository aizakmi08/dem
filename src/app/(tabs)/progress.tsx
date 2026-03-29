import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import { useProgressData } from '@/hooks/use-progress-data';
import { StreakHero } from '@/components/progress/streak-hero';
import { ProgressCalendar } from '@/components/progress/progress-calendar';
import { StatCard } from '@/components/progress/stat-card';

const MILESTONE_TARGET = 30;

export default function ProgressScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const { activityCounts, currentStreak, bestStreak, totalSessions, totalMinutes } =
    useProgressData();

  const daysRemaining = MILESTONE_TARGET - currentStreak;
  const showMilestone = currentStreak > 0 && currentStreak < MILESTONE_TARGET;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={{ paddingTop: insets.top + spacing.sm, paddingHorizontal: 24, gap: 4 }}>
        <Text style={[typography.displaySmall, { color: colors.text }]}>Progress</Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
          Keep showing up. Your body thanks you.
        </Text>
      </View>
      <StreakHero count={currentStreak} bestStreak={bestStreak} />
      <ProgressCalendar activityCounts={activityCounts} />

      <View style={styles.statsRow}>
        <StatCard value={totalSessions} label="Sessions" />
        <StatCard value={totalMinutes} label="Minutes" />
        <StatCard value={bestStreak} label="Best Streak" />
      </View>

      {showMilestone && (
        <View
          style={[
            styles.milestoneCard,
            {
              backgroundColor: `${colors.accent}0F`,
              borderWidth: 1.5,
              borderColor: `${colors.accent}26`,
              borderRadius: radius.xl,
            },
          ]}
        >
          <View style={[styles.milestoneIcon, { backgroundColor: `${colors.accent}1A` }]}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke={colors.accent}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <View style={styles.milestoneText}>
            <Text style={[typography.subheading, { color: colors.text }]}>
              Next milestone: {MILESTONE_TARGET}-day streak!
            </Text>
            <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
            </Text>
          </View>
        </View>
      )}
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
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 14,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneText: {
    flex: 1,
    gap: 2,
  },
});
