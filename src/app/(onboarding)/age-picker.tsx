import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';
import { AgeScrollPicker } from '@/components/onboarding/age-scroll-picker';
import { useOnboardingStore } from '@/stores/use-onboarding-store';

export default function AgePickerScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedAge, setSelectedAge] = useState(23);

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    useOnboardingStore.getState().setAge(selectedAge);
    router.push('/(onboarding)/gender-picker');
  }, [selectedAge, router]);

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

      <View style={{ paddingTop: spacing['3xl'], paddingHorizontal: spacing['2xl'] }}>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
          This helps us optimize your exercises and routines.
        </Text>
      </View>

      <View style={styles.spacer} />

      <Animated.View
        entering={FadeInDown.duration(300)}
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
      </Animated.View>
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
