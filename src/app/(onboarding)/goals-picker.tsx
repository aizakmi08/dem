import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';
import { SelectOption } from '@/components/onboarding/select-option';
import { useOnboardingStore, type GoalKey } from '@/stores/use-onboarding-store';

const GOALS: { key: GoalKey; label: string }[] = [
  { key: 'flexibility', label: 'Increase flexibility & mobility' },
  { key: 'health', label: 'Improve health & longevity' },
  { key: 'pain', label: 'Reduce pain & prevent injury' },
  { key: 'stress', label: 'Reduce stress & anxiety' },
  { key: 'athletic', label: 'Improve athletic performance' },
  { key: 'circulation', label: 'Improve circulation & blood flow' },
  { key: 'recovery', label: 'Accelerate muscle recovery' },
  { key: 'posture', label: 'Improve posture' },
];

export default function GoalsPickerScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<GoalKey[]>([]);

  const toggleGoal = useCallback((key: GoalKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedGoals((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const handleNext = useCallback(() => {
    if (selectedGoals.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    useOnboardingStore.getState().setGoals(selectedGoals);
    router.push('/(onboarding)/stretch-time');
  }, [selectedGoals, router]);

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
          What are your main goals from stretching?
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
          Select at least 1 to continue
        </Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.chips,
          { paddingTop: spacing['3xl'], paddingHorizontal: spacing['2xl'], paddingBottom: spacing.lg, gap: spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {GOALS.map((goal) => {
          const isSelected = selectedGoals.includes(goal.key);
          return (
            <SelectOption
              key={goal.key}
              isSelected={isSelected}
              onPress={() => toggleGoal(goal.key)}
              height={52}
              borderRadius={radius.full}
              colors={colors}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? colors.accent : colors.text,
                    fontFamily: 'Nunito_600SemiBold',
                  },
                ]}
              >
                {goal.label}
              </Text>
            </SelectOption>
          );
        })}
      </ScrollView>

      {selectedGoals.length > 0 ? (
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
  scrollArea: {
    flex: 1,
  },
  chips: {
    width: '100%',
  },
  chipText: {
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'center',
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
