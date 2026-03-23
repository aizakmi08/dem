import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';
import { TimeScrollPicker } from '@/components/onboarding/time-scroll-picker';
import { useOnboardingStore, type Period } from '@/stores/use-onboarding-store';

export default function ReminderScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<Period>('AM');

  const handleTimeChange = useCallback(
    (h: number, m: number, p: Period) => {
      setHour(h);
      setMinute(m);
      setPeriod(p);
    },
    [],
  );

  const handleNext = useCallback(() => {
    useOnboardingStore.getState().setReminder(hour, minute, period);
    router.replace('/');
  }, [hour, minute, period, router]);

  const handleSkip = useCallback(() => {
    useOnboardingStore.getState().skipReminder();
    router.replace('/');
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing['2xl'] },
        ]}
      >
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={[styles.titleSection, { paddingTop: spacing['2xl'], gap: spacing.sm }]}>
        <Text style={[typography.title, { color: colors.text, textAlign: 'center' }]}>
          Set your daily reminder to stretch every day.
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
          Choose a time below
        </Text>
      </View>

      <View style={styles.spacer} />

      <TimeScrollPicker
        defaultHour={9}
        defaultMinute={0}
        defaultPeriod="AM"
        onTimeChange={handleTimeChange}
      />

      <View style={styles.spacer} />

      <View
        style={[
          styles.buttonSection,
          {
            paddingHorizontal: spacing['2xl'],
            paddingBottom: insets.bottom + spacing['2xl'],
            gap: spacing.lg,
          },
        ]}
      >
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={[typography.overline, { color: colors.textSecondary }]}>
            Skip reminder
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.nextButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.xl,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[typography.button, { color: colors.white }]}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  spacer: {
    flex: 1,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
