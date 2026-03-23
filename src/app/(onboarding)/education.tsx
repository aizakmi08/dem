import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { BackButton } from '@/components/ui/back-button';
import { PageDots } from '@/components/onboarding/page-dots';
import {
  StretchIllustration,
  ConsistencyIllustration,
  ProgressIllustration,
} from '@/components/onboarding/education-illustrations';

type SlideData = {
  title: string;
  subtitle: string;
  Illustration: React.ComponentType;
};

const SLIDES: SlideData[] = [
  {
    title: 'Stretching is important.',
    subtitle: 'Every time you stretch, you invest in your long-term health and longevity.',
    Illustration: StretchIllustration,
  },
  {
    title: 'Consistency is key.',
    subtitle: 'Just a few minutes each day can improve your flexibility and reduce tension.',
    Illustration: ConsistencyIllustration,
  },
  {
    title: 'Track your progress.',
    subtitle: 'Build a streak, see your improvement, and stay motivated on your journey.',
    Illustration: ProgressIllustration,
  },
];

export default function EducationScreen() {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / width);
      setCurrentIndex(index);
    },
    [width],
  );

  const handleTap = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      router.push('/(onboarding)/age-picker');
    }
  }, [currentIndex, width]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing['2xl'] }]}>
        <BackButton
          onPress={() => {
            if (currentIndex > 0) {
              scrollRef.current?.scrollTo({ x: (currentIndex - 1) * width, animated: true });
            } else {
              router.back();
            }
          }}
        />
      </View>

      <View style={styles.spacer} />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flexGrow: 0, width }}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <View style={[styles.illustrationCircle, { backgroundColor: colors.primary }]}>
              <slide.Illustration />
            </View>
            <View style={[styles.textSection, { paddingTop: spacing['3xl'], paddingHorizontal: spacing['4xl'], gap: spacing.md }]}>
              <Text style={[typography.title, { color: colors.text, textAlign: 'center', lineHeight: 34 }]}>
                {slide.title}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{slide.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{ paddingTop: spacing['3xl'] }}>
        <PageDots total={SLIDES.length} current={currentIndex} />
      </View>

      <View style={styles.spacer} />

      <Pressable
        onPress={handleTap}
        style={[styles.tapArea, { paddingBottom: insets.bottom + spacing['4xl'] }]}
      >
        <Text style={[typography.overline, { color: colors.textSecondary }]}>Tap to continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
  },
  spacer: {
    flex: 1,
  },
  slide: {
    alignItems: 'center',
  },
  illustrationCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSection: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 24,
    textAlign: 'center',
  },
  tapArea: {
    alignItems: 'center',
  },
});
