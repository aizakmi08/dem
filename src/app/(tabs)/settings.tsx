import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { ProfileCard } from '@/components/settings/profile-card';
import { PreferencesSection } from '@/components/settings/preferences-section';
import { AppearanceSection } from '@/components/settings/appearance-section';
import { AccountSection } from '@/components/settings/account-section';
import { AboutSection } from '@/components/settings/about-section';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, typography.title, { color: colors.text }]}>Settings</Text>

      <ProfileCard name="Zhapar" email="zhapar@email.com" />
      <PreferencesSection />
      <AppearanceSection />
      <AccountSection />
      <AboutSection />

      <View style={styles.version}>
        <Text style={[typography.label, { color: colors.border, fontWeight: '400' }]}>
          Dem v1.0.0
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
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  version: {
    alignItems: 'center',
    paddingTop: 24,
  },
});
