import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';

const SECTIONS = [
  {
    header: 'ACCEPTANCE OF TERMS',
    body: 'By using Dem, you agree to these terms. If you do not agree, please discontinue use of the app. We may update these terms periodically and will notify you of significant changes.',
  },
  {
    header: 'USE OF THE APP',
    body: 'Dem provides guided stretching routines for general wellness. The content is not a substitute for professional medical advice. Consult a healthcare provider before beginning any exercise program.',
  },
  {
    header: 'USER ACCOUNTS',
    body: 'You are responsible for maintaining the security of your account. You agree to provide accurate information and to not share your account credentials with others.',
  },
  {
    header: 'LIMITATION OF LIABILITY',
    body: 'Dem is provided "as is" without warranties. We are not liable for any injuries or damages resulting from the use of our app or its content.',
  },
];

export default function TermsOfServiceScreen() {
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
            Terms of Service
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
