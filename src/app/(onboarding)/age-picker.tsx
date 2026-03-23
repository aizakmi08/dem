import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';
import { AgeScrollPicker } from '@/components/onboarding/age-scroll-picker';

export default function AgePickerScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedAge, setSelectedAge] = useState(23);

  const handleNext = useCallback(() => {
    // TODO: Save selectedAge and navigate to next onboarding step
  }, [selectedAge]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing['2xl'] },
        ]}
      >
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={[styles.titleSection, { gap: spacing.sm, paddingTop: spacing.lg }]}>
        <Text style={[typography.title, { color: colors.text, textAlign: 'center' }]}>
          How old are you?
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
          Choose an option to continue
        </Text>
      </View>

      <View style={styles.spacer} />

      <AgeScrollPicker defaultAge={23} onAgeChange={setSelectedAge} />

      <View style={{ paddingTop: spacing['3xl'], paddingHorizontal: spacing['3xl'] }}>
        <Text style={[typography.body, { color: colors.text }]}>
          Tip: This will be used to optimize your exercises and routines.
        </Text>
      </View>

      <View style={styles.spacer} />

      <View
        style={[
          styles.buttonSection,
          { paddingHorizontal: spacing['2xl'], paddingBottom: insets.bottom + spacing['2xl'] },
        ]}
      >
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.nextButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.xl,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[typography.button, { color: colors.white }]}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
  },
  titleSection: {
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  buttonSection: {
    width: '100%',
  },
  nextButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
