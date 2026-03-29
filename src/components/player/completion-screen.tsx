import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Svg, Path, Circle } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { formatSeconds } from '@/lib/utils';
import { useProgressData } from '@/hooks/use-progress-data';
import { Confetti } from './confetti';

interface CompletionScreenProps {
  routineName?: string;
  durationSeconds: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  onDone: () => void;
}

export function CompletionScreen({
  routineName,
  durationSeconds,
  exercisesCompleted,
  exercisesTotal,
  onDone,
}: CompletionScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, typography, radius, spacing } = useTheme();
  const { currentStreak, totalSessions, totalMinutes } = useProgressData();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Confetti />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Check circle */}
        <Animated.View entering={ZoomIn.springify().delay(200)} style={styles.center}>
          <View style={[styles.checkOuter, { borderColor: `${colors.primary}20` }]}>
            <View style={[styles.checkInner, { backgroundColor: colors.primary }]}>
              <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                <Path
                  d="M8 16l6 6L24 10"
                  stroke="white"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.center}>
          <Text style={[styles.title, { color: colors.text }]}>Great stretch!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {routineName
              ? `You completed ${routineName}.`
              : 'You completed your routine.'}{'\n'}
            Keep up the momentum!
          </Text>
        </Animated.View>

        {/* Streak badge */}
        {currentStreak > 0 && (
          <Animated.View entering={FadeIn.delay(500).duration(300)} style={styles.center}>
            <View
              style={[
                styles.streakBadge,
                { backgroundColor: `${colors.accent}14`, borderColor: `${colors.accent}26` },
              ]}
            >
              <Svg width={16} height={16} viewBox="0 0 16 16" fill={colors.accent}>
                <Path d="M8 1C8 1 6 4 6 7C6 9 7 11 8 12C9 11 10 9 10 7C10 4 8 1 8 1Z" />
              </Svg>
              <Text style={[styles.streakText, { color: colors.accent }]}>
                Day {currentStreak} streak!
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Session stats */}
        <Animated.View entering={FadeInUp.delay(600)}>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <Circle cx={9} cy={9} r={7} stroke={colors.primary} strokeWidth={1.3} />
                <Path d="M9 5v4l2.5 2.5" stroke={colors.primary} strokeWidth={1.3} strokeLinecap="round" />
              </Svg>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatSeconds(durationSeconds)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <Path
                  d="M4 9l4 4 7-7"
                  stroke={colors.accent}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {exercisesCompleted}/{exercisesTotal}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exercises</Text>
            </View>
          </View>
        </Animated.View>

        {/* Overall progress summary */}
        <Animated.View entering={FadeInUp.delay(700)}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Your Journey So Far</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.primary }]}>{totalSessions}</Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total{'\n'}Sessions</Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.primary }]}>{totalMinutes}</Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total{'\n'}Minutes</Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.accent }]}>{currentStreak}</Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Day{'\n'}Streak</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* CTAs */}
        <Animated.View entering={FadeInUp.delay(800)}>
          <Pressable
            onPress={onDone}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: colors.primary, borderRadius: radius.xl, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[typography.button, { color: colors.white }]}>Done</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(900).duration(300)}>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            style={({ pressed }) => [
              styles.secondaryBtn,
              { borderColor: colors.border, borderRadius: radius.lg, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.secondaryText, { color: colors.text }]}>
              Start Another Routine
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { ...StyleSheet.absoluteFillObject },
  scrollContent: { alignItems: 'stretch', paddingHorizontal: 24 },
  center: { alignItems: 'center' },
  checkOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 34,
    textAlign: 'center',
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    textAlign: 'center',
    paddingTop: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 1.5,
    marginTop: 16,
  },
  streakText: {
    fontSize: 13,
    fontFamily: 'Nunito_800ExtraBold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 14,
  },
  summaryCard: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 18,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  summaryValue: {
    fontSize: 22,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 26,
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 13,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 36,
  },
  primaryBtn: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  secondaryBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginTop: 12,
  },
  secondaryText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
