import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import type { Period } from '@/stores/use-onboarding-store';

const DAILY_REMINDER_ID = 'daily-stretch-reminder';
const CHANNEL_ID = 'reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function to24Hour(hour: number, period: Period): number {
  if (period === 'AM') return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}

export function parseReminderTime(reminderTime: string): {
  hour: number;
  minute: number;
  period: Period;
} {
  const [timePart, period] = reminderTime.split(' ');
  const [hour, minute] = timePart.split(':').map(Number);
  return { hour, minute, period: period as Period };
}

export function formatReminderTime(hour: number, minute: number, period: Period): string {
  return `${hour}:${String(minute).padStart(2, '0')} ${period}`;
}

async function setupAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function scheduleReminder(hour: number, minute: number) {
  if (!Device.isDevice) return;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return;

  await setupAndroidChannel();

  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Time to stretch!',
      body: 'Your daily stretching session is ready.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CHANNEL_ID,
    },
  });
}

export async function cancelReminder() {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => {});
}

export function useNotifications(params: {
  reminderEnabled: boolean | undefined;
  reminderTime: string | null | undefined;
}) {
  useEffect(() => {
    if (!params.reminderEnabled || !params.reminderTime) {
      cancelReminder();
      return;
    }
    const { hour, minute, period } = parseReminderTime(params.reminderTime);
    scheduleReminder(to24Hour(hour, period), minute);
  }, [params.reminderEnabled, params.reminderTime]);
}
