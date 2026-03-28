import { memo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import { SectionHeader } from './section-header';
import { SettingsRow } from './settings-row';
import { ChevronRightIcon } from './chevron-right-icon';
import {
  RedoOnboardingDrawer,
  type RedoOnboardingDrawerRef,
} from './redo-onboarding-drawer';
import {
  SignOutDrawer,
  type SignOutDrawerRef,
} from './sign-out-drawer';

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

function SignOutRowIcon({ color }: { color: string }) {
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
  const redoRef = useRef<RedoOnboardingDrawerRef>(null);
  const signOutRef = useRef<SignOutDrawerRef>(null);

  return (
    <View style={styles.section}>
      <SectionHeader title="Account" />
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingsRow
          icon={<RefreshIcon color={colors.text} />}
          label="Redo onboarding quiz"
          rightElement={<ChevronRightIcon color={colors.textSecondary} />}
          onPress={() => redoRef.current?.present()}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingsRow
          icon={<SignOutRowIcon color={colors.accent} />}
          label="Sign out"
          textColor={colors.accent}
          onPress={() => signOutRef.current?.present()}
        />
      </View>
      <RedoOnboardingDrawer ref={redoRef} />
      <SignOutDrawer ref={signOutRef} />
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
