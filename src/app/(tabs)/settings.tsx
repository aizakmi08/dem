import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useTheme } from '@/theme';
import { ProfileCard } from '@/components/settings/profile-card';
import { PreferencesSection } from '@/components/settings/preferences-section';
import { AppearanceSection } from '@/components/settings/appearance-section';
import { AccountSection } from '@/components/settings/account-section';
import { AboutSection } from '@/components/settings/about-section';

const appVersion = `${Constants.expoConfig?.name ?? 'Dem'} v${Constants.expoConfig?.version ?? '1.0.0'}`;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <Text style={[styles.title, typography.title, { color: colors.text }]}>Settings</Text>

      <ProfileCard />
      <PreferencesSection />
      <AppearanceSection />
      <AccountSection />
      <AboutSection />

      <View style={styles.version}>
        <Text style={[typography.label, { color: colors.border, fontWeight: '400' }]}>
          {appVersion}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    paddingHorizontal: 24,
  },
  version: {
    alignItems: 'center',
    paddingTop: 24,
  },
});
