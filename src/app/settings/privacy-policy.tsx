import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';

const SECTIONS = [
  {
    header: 'INFORMATION WE COLLECT',
    body: 'We collect information you provide directly, including your name, email address, age range, experience level, and fitness goals. We also collect usage data such as completed routines and exercise preferences.',
  },
  {
    header: 'HOW WE USE YOUR DATA',
    body: "Your data is used to personalize your stretching experience, track your progress, and send reminders you've opted into. We do not sell your personal information to third parties.",
  },
  {
    header: 'DATA STORAGE',
    body: "Your data is securely stored using InstantDB's cloud infrastructure. We implement industry-standard security measures to protect your information.",
  },
  {
    header: 'YOUR RIGHTS',
    body: 'You can request to view, export, or delete your personal data at any time by contacting us at support@dem.app.',
  },
];

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.lg },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.backButtonWrap}>
            <BackButton onPress={() => router.back()} />
          </View>
          <Text style={[typography.heading, { color: colors.text }]}>
            Privacy Policy
          </Text>
        </View>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.textSecondary, marginTop: 4 },
          ]}
        >
          Last updated: March 15, 2026
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section, index) => (
          <View
            key={section.header}
            style={index < SECTIONS.length - 1 ? styles.section : undefined}
          >
            <Text
              style={[
                typography.label,
                styles.sectionHeader,
                { color: colors.textSecondary, letterSpacing: 1 },
              ]}
            >
              {section.header}
            </Text>
            <Text
              style={[
                styles.sectionBody,
                { color: colors.text, fontFamily: 'Nunito_600SemiBold' },
              ]}
            >
              {section.body}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 24,
  },
  backButtonWrap: {
    justifyContent: 'center',
  },
});
