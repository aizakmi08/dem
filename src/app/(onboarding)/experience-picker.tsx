import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';
import { SelectOption } from '@/components/onboarding/select-option';
import { useOnboardingStore, type ExperienceLevel } from '@/stores/use-onboarding-store';

const EXPERIENCE_OPTIONS: {
  value: ExperienceLevel;
  label: string;
  subtitle: string;
  dotCount: number;
}[] = [
  { value: 'beginner', label: 'Beginner', subtitle: 'New to stretching', dotCount: 1 },
  { value: 'intermediate', label: 'Intermediate', subtitle: 'Some stretching experience', dotCount: 2 },
  { value: 'expert', label: 'Expert', subtitle: 'I stretch regularly', dotCount: 3 },
];

function DotIcon({ count, color }: { count: number; color: string }) {
  const size = 8;
  const gap = 4;
  const totalWidth = count * size + (count - 1) * gap;

  return (
    <Svg width={totalWidth} height={size}>
      {Array.from({ length: count }, (_, i) => (
        <Circle
          key={i}
          cx={i * (size + gap) + size / 2}
          cy={size / 2}
          r={size / 2}
          fill={color}
        />
      ))}
    </Svg>
  );
}

export default function ExperiencePickerScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<ExperienceLevel | null>(null);

  const handleNext = useCallback(() => {
    if (!selected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    useOnboardingStore.getState().setExperience(selected);
    router.push('/(onboarding)/goals-picker');
  }, [selected, router]);

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
          How much experience do you have stretching?
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
          Choose an option to continue
        </Text>
      </View>

      <View
        style={[
          styles.options,
          { paddingTop: spacing['4xl'], paddingHorizontal: spacing['2xl'], gap: spacing.md },
        ]}
      >
        {EXPERIENCE_OPTIONS.map((option) => (
          <SelectOption
            key={option.value}
            isSelected={selected === option.value}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelected(option.value);
            }}
            height={72}
            borderRadius={radius.xl}
            colors={colors}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.background, borderRadius: radius.full }]}>
              <DotIcon count={option.dotCount} color={colors.primary} />
            </View>
            <View style={[styles.textContainer, { gap: 2 }]}>
              <Text style={[styles.optionLabel, { color: colors.text, fontFamily: 'Nunito_600SemiBold' }]}>
                {option.label}
              </Text>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                {option.subtitle}
              </Text>
            </View>
          </SelectOption>
        ))}
      </View>

      <View style={styles.spacer} />

      {selected ? (
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
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    lineHeight: 20,
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
