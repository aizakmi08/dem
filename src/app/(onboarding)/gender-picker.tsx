import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';
import { SelectOption } from '@/components/onboarding/select-option';
import { useOnboardingStore, type Gender } from '@/stores/use-onboarding-store';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export default function GenderPickerScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const handleNext = useCallback(() => {
    if (!selectedGender) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    useOnboardingStore.getState().setGender(selectedGender);
    router.push('/(onboarding)/experience-picker');
  }, [selectedGender, router]);

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

      <View style={[styles.titleSection, { paddingTop: spacing['2xl'], gap: spacing.sm }]}>
        <Text style={[typography.title, { color: colors.text, textAlign: 'center' }]}>
          What is your gender?
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
          Choose an option to continue
        </Text>
      </View>

      <View
        style={[
          styles.options,
          {
            paddingTop: spacing['4xl'],
            paddingHorizontal: spacing['2xl'],
            gap: spacing.md,
          },
        ]}
      >
        {GENDER_OPTIONS.map((option) => (
          <SelectOption
            key={option.value}
            isSelected={selectedGender === option.value}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedGender(option.value);
            }}
            height={60}
            borderRadius={radius.xl}
            colors={colors}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color: selectedGender === option.value ? colors.accent : colors.text,
                  fontFamily: 'Nunito_600SemiBold',
                },
              ]}
            >
              {option.label}
            </Text>
          </SelectOption>
        ))}
      </View>

      <View style={styles.spacer} />

      {selectedGender ? (
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
      ) : null}
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
    paddingHorizontal: 48,
  },
  options: {
    width: '100%',
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
  optionText: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
    textAlign: 'center',
  },
});
