import { memo, useCallback } from 'react';
import { View, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { db } from '@/lib/db';
import { useOnboardingStore } from '@/stores/use-onboarding-store';
import { useProfile } from '@/hooks/use-profile';
import { useSignOut } from '@/hooks/use-sign-out';
import { SectionHeader } from './section-header';
import { SettingsRow } from './settings-row';
import { ChevronRightIcon } from './chevron-right-icon';

function RefreshIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SignOutIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const AccountSection = memo(function AccountSection() {
  const { colors } = useTheme();
  const router = useRouter();
  const { profile } = useProfile();
  const { signOut, isSigningOut } = useSignOut();

  const handleRedoOnboarding = useCallback(async () => {
    try {
      if (profile?.id) {
        await db.transact(
          db.tx.profiles[profile.id].update({ onboardingComplete: false }),
        );
      }
      useOnboardingStore.getState().resetOnboarding();
      router.replace('/(onboarding)/welcome');
    } catch {
      Alert.alert('Error', 'Could not reset onboarding. Please try again.');
    }
  }, [router, profile]);

  return (
    <View style={styles.section}>
      <SectionHeader title="Account" />
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingsRow
          icon={<RefreshIcon color={colors.text} />}
          label="Redo onboarding quiz"
          rightElement={<ChevronRightIcon color={colors.textSecondary} />}
          onPress={handleRedoOnboarding}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingsRow
          icon={<SignOutIcon color={isSigningOut ? colors.textSecondary : colors.accent} />}
          label="Sign out"
          textColor={isSigningOut ? colors.textSecondary : colors.accent}
          rightElement={isSigningOut ? <ActivityIndicator size="small" color={colors.textSecondary} /> : undefined}
          onPress={isSigningOut ? undefined : signOut}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
