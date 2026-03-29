import { useState, useCallback, useRef } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';
import { TimeScrollPicker } from '@/components/onboarding/time-scroll-picker';
import { useOnboardingStore, type Period } from '@/stores/use-onboarding-store';
import { useAuth } from '@/hooks/use-auth';
import { useProfile, createProfile, updateProfile } from '@/hooks/use-profile';
import { scheduleReminder, to24Hour } from '@/hooks/use-notifications';

export default function ReminderScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile();

  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<Period>('AM');
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  const handleTimeChange = useCallback(
    (h: number, m: number, p: Period) => {
      setHour(h);
      setMinute(m);
      setPeriod(p);
    },
    [],
  );

  const saveProfile = useCallback(
    async (reminderEnabled: boolean, h: number, m: number, p: Period) => {
      if (!user || savingRef.current) return;
      savingRef.current = true;
      setSaving(true);
      const store = useOnboardingStore.getState();
      const profileData = {
        age: store.age,
        gender: store.gender,
        experience: store.experience,
        goals: store.goals,
        stretchTime: store.stretchTime,
        reminderEnabled,
        reminderHour: h,
        reminderMinute: m,
        reminderPeriod: p,
      };
      try {
        if (profile?.id) {
          await updateProfile(profile.id, profileData);
        } else {
          await createProfile(user.id, profileData);
        }
        router.replace('/(tabs)');
      } catch {
        savingRef.current = false;
        setSaving(false);
        Alert.alert('Error', 'Could not save your profile. Please try again.');
      }
    },
    [user, profile?.id, router],
  );

  const handleNext = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    useOnboardingStore.getState().setReminder(hour, minute, period);
    await scheduleReminder(to24Hour(hour, period), minute);
    saveProfile(true, hour, minute, period);
  }, [hour, minute, period, saveProfile]);

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    useOnboardingStore.getState().skipReminder();
    saveProfile(false, 9, 0, 'AM');
  }, [saveProfile]);

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
        <Pressable onPress={handleSkip} disabled={saving} style={styles.skipButton}>
          <Text style={[typography.overline, { color: colors.textSecondary, opacity: saving ? 0.5 : 1 }]}>
            Skip reminder
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          disabled={saving}
          style={({ pressed }) => [
            styles.nextButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.xl,
              opacity: pressed || saving ? 0.7 : 1,
            },
          ]}
        >
          <Text style={[typography.button, { color: colors.white }]}>
            {saving ? 'Saving...' : 'Next'}
          </Text>
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
