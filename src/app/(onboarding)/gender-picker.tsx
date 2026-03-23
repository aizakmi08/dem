import { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  FadeInDown,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';

type Gender = 'male' | 'female' | 'prefer_not_to_say';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function GenderOption({
  label,
  isSelected,
  onPress,
  colors,
  radius,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  radius: ReturnType<typeof useTheme>['radius'];
}) {
  const progress = useSharedValue(0);
  const accentWithAlpha = colors.accent + '14';

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.surface, accentWithAlpha]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', colors.accent]
    ),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [colors.text, colors.accent]
    ),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.option,
        { borderRadius: radius.xl },
        animatedStyle,
      ]}
    >
      <Animated.Text
        style={[
          styles.optionText,
          { fontFamily: 'Nunito_600SemiBold' },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </AnimatedPressable>
  );
}

export default function GenderPickerScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const handleSelect = setSelectedGender;

  const handleNext = useCallback(() => {
    // TODO: Save gender and navigate to next onboarding step
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
          <GenderOption
            key={option.value}
            label={option.label}
            isSelected={selectedGender === option.value}
            onPress={() => handleSelect(option.value)}
            colors={colors}
            radius={radius}
          />
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
  option: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
