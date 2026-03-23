import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';
import { SelectOption } from '@/components/onboarding/select-option';
import { useOnboardingStore, type StretchTime } from '@/stores/use-onboarding-store';

function SunriseIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M4.93 19.07l2.83-2.83M12 18v4M16.24 16.24l2.83 2.83M18 12h4M16.24 7.76l2.83-2.83" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 14a2 2 0 100-4 2 2 0 000 4z" fill={color} />
    </Svg>
  );
}

function CoffeeIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 2v3M10 2v3M14 2v3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ActivityIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BriefcaseIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MoonIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function DotsIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={5} cy={12} r={1.5} fill={color} />
      <Circle cx={12} cy={12} r={1.5} fill={color} />
      <Circle cx={19} cy={12} r={1.5} fill={color} />
    </Svg>
  );
}

const ICON_MAP: Record<StretchTime, React.FC<{ color: string }>> = {
  after_waking: SunriseIcon,
  after_coffee: CoffeeIcon,
  after_exercise: ActivityIcon,
  work_break: BriefcaseIcon,
  before_bed: MoonIcon,
  other: DotsIcon,
};

const TIME_OPTIONS: { value: StretchTime; label: string }[] = [
  { value: 'after_waking', label: 'After waking up' },
  { value: 'after_coffee', label: 'After morning coffee or tea' },
  { value: 'after_exercise', label: 'After exercising' },
  { value: 'work_break', label: 'During work break' },
  { value: 'before_bed', label: 'Before going to bed' },
  { value: 'other', label: 'Other' },
];

export default function StretchTimeScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<StretchTime | null>(null);

  const handleNext = useCallback(() => {
    if (!selected) return;
    useOnboardingStore.getState().setStretchTime(selected);
    router.push('/(onboarding)/reminder');
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
          When is a good time for your daily stretch?
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
          Choose an option to continue
        </Text>
      </View>

      <View
        style={[
          styles.options,
          { paddingTop: spacing['3xl'], paddingHorizontal: spacing['2xl'], gap: spacing.md },
        ]}
      >
        {TIME_OPTIONS.map((option) => {
          const IconComponent = ICON_MAP[option.value];
          return (
            <SelectOption
              key={option.value}
              isSelected={selected === option.value}
              onPress={() => setSelected(option.value)}
              height={56}
              borderRadius={radius.xl}
              colors={colors}
            >
              <View style={styles.iconSlot}>
                <IconComponent color={selected === option.value ? colors.accent : colors.textSecondary} />
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color: selected === option.value ? colors.accent : colors.text,
                    fontFamily: 'Nunito_600SemiBold',
                  },
                ]}
              >
                {option.label}
              </Text>
            </SelectOption>
          );
        })}
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
  iconSlot: {
    width: 28,
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 15,
    lineHeight: 18,
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
