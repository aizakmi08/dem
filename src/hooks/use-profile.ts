import { useMemo } from 'react';
import { id } from '@instantdb/react-native';
import { db } from '@/lib/db';
import { useAuth } from './use-auth';
import { formatReminderTime } from './use-notifications';

export interface OnboardingProfileData {
  age: number | null;
  gender: string | null;
  experience: string | null;
  goals: string[];
  stretchTime: string | null;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  reminderPeriod: 'AM' | 'PM';
}

function buildProfileFields(data: OnboardingProfileData) {
  return {
    age: data.age ?? undefined,
    gender: data.gender ?? undefined,
    experienceLevel: data.experience ?? 'beginner',
    goals: data.goals,
    preferredStretchTime: data.stretchTime ?? undefined,
    reminderTime: data.reminderEnabled
      ? formatReminderTime(data.reminderHour, data.reminderMinute, data.reminderPeriod)
      : undefined,
    reminderEnabled: data.reminderEnabled,
    onboardingComplete: true,
  };
}

export function useProfile() {
  const { user } = useAuth();

  const query = useMemo(
    () =>
      user
        ? { profiles: { $: { where: { '$user.id': user.id } } } }
        : null,
    [user?.id],
  );

  const { isLoading, data } = db.useQuery(query);

  const profile = data?.profiles?.[0] ?? null;
  return { profile, isLoading };
}

export async function createProfile(userId: string, data: OnboardingProfileData) {
  const profileId = id();
  const now = Date.now();

  await db.transact(
    db.tx.profiles[profileId]
      .update({
        ...buildProfileFields(data),
        userId,
        bodyFocusAreas: [],
        healthConcerns: [],
        specificConcerns: [],
        soundEnabled: true,
        transitionTime: 10,
        theme: 'system',
        createdAt: now,
        updatedAt: now,
      })
      .link({ $user: userId }),
  );
}

export async function updateProfile(profileId: string, data: OnboardingProfileData) {
  await db.transact(
    db.tx.profiles[profileId].update({
      ...buildProfileFields(data),
      updatedAt: Date.now(),
    }),
  );
}
