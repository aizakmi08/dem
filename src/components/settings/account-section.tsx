import { memo, useCallback } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
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

  const handleRedoOnboarding = useCallback(() => {
    router.push('/(onboarding)/welcome');
  }, [router]);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          // TODO: Implement sign out with InstantDB
        },
      },
    ]);
  }, []);

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
          icon={<SignOutIcon color={colors.accent} />}
          label="Sign out"
          textColor={colors.accent}
          onPress={handleSignOut}
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
