import { useEffect } from 'react';
import { db } from '@/lib/db';
import { useProfile } from './use-profile';
import { useNotifications, parseReminderTime, formatReminderTime } from './use-notifications';
import { useSettingsStore, type Theme } from '@/stores/use-settings-store';
import { useOnboardingStore, type Period } from '@/stores/use-onboarding-store';

export function useProfileSync() {
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile) return;

    const settings = useSettingsStore.getState();
    const profileTheme = (profile.theme as Theme) ?? 'system';
    if (settings.theme !== profileTheme) settings.setTheme(profileTheme);
    if (settings.soundEnabled !== profile.soundEnabled) settings.setSoundEnabled(profile.soundEnabled);
    if (settings.transitionTime !== profile.transitionTime) settings.setTransitionTime(profile.transitionTime);

    const onboarding = useOnboardingStore.getState();
    if (profile.reminderEnabled && profile.reminderTime) {
      const { hour, minute, period } = parseReminderTime(profile.reminderTime);
      if (
        onboarding.reminderHour !== hour ||
        onboarding.reminderMinute !== minute ||
        onboarding.reminderPeriod !== period
      ) {
        onboarding.setReminder(hour, minute, period);
      }
    } else if (!profile.reminderEnabled && onboarding.reminderEnabled) {
      onboarding.skipReminder();
    }
  }, [
    profile?.id,
    profile?.theme,
    profile?.soundEnabled,
    profile?.transitionTime,
    profile?.reminderTime,
    profile?.reminderEnabled,
  ]);

  useNotifications({
    reminderEnabled: profile?.reminderEnabled,
    reminderTime: profile?.reminderTime,
  });

  return { profile };
}

export function updateTheme(profileId: string, theme: Theme) {
  db.transact(
    db.tx.profiles[profileId].update({ theme, updatedAt: Date.now() }),
  );
}

export async function updateSoundEnabled(
  profileId: string,
  enabled: boolean,
) {
  useSettingsStore.getState().setSoundEnabled(enabled);
  await db.transact(
    db.tx.profiles[profileId].update({
      soundEnabled: enabled,
      updatedAt: Date.now(),
    }),
  );
}

export async function updateTransitionTime(
  profileId: string,
  seconds: number,
) {
  useSettingsStore.getState().setTransitionTime(seconds);
  await db.transact(
    db.tx.profiles[profileId].update({
      transitionTime: seconds,
      updatedAt: Date.now(),
    }),
  );
}

export async function updateReminder(
  profileId: string,
  enabled: boolean,
  hour: number,
  minute: number,
  period: Period,
) {
  const onboarding = useOnboardingStore.getState();
  if (enabled) {
    onboarding.setReminder(hour, minute, period);
  } else {
    onboarding.skipReminder();
  }
  await db.transact(
    db.tx.profiles[profileId].update({
      reminderEnabled: enabled,
      reminderTime: enabled ? formatReminderTime(hour, minute, period) : null,
      updatedAt: Date.now(),
    }),
  );
}
