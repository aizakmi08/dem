import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { SectionHeader } from './section-header';
import { SettingsRow } from './settings-row';
import { ChevronRightIcon } from './chevron-right-icon';

export const AboutSection = memo(function AboutSection() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.section}>
      <SectionHeader title="About" />
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingsRow
          label="Privacy policy"
          rightElement={<ChevronRightIcon color={colors.textSecondary} />}
          onPress={() => router.push('/settings/privacy-policy')}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingsRow
          label="Terms of service"
          rightElement={<ChevronRightIcon color={colors.textSecondary} />}
          onPress={() => router.push('/settings/terms-of-service')}
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
