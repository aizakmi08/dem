import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  type ViewToken,
  type ListRenderItemInfo,
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

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  Illustration: React.ComponentType;
};

const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Stretching is important.',
    subtitle: 'Every time you stretch, you invest in your long-term health and longevity.',
    Illustration: StretchIllustration,
  },
  {
    id: '2',
    title: 'Consistency is key.',
    subtitle: 'Just a few minutes each day can improve your flexibility and reduce tension.',
    Illustration: ConsistencyIllustration,
  },
  {
    id: '3',
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
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<Slide>[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleTap = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      // TODO: Navigate to next onboarding step
    }
  }, [currentIndex]);

  const renderSlide = useCallback(
    ({ item }: ListRenderItemInfo<Slide>) => (
      <View style={[styles.slide, { width, height: slideHeight }]}>
        <View style={[styles.illustrationCircle, { backgroundColor: colors.primary }]}>
          <item.Illustration />
        </View>
        <View style={[styles.textSection, { paddingTop: spacing['3xl'], paddingHorizontal: spacing['4xl'], gap: spacing.md }]}>
          <Text style={[typography.title, { color: colors.text, textAlign: 'center', lineHeight: 34 }]}>
            {item.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
        </View>
      </View>
    ),
    [width, slideHeight, colors, typography, spacing],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing['2xl'] }]}>
        <BackButton
          onPress={() => {
            if (currentIndex > 0) {
              flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
            } else {
              router.back();
            }
          }}
        />
      </View>

      <View
        style={styles.flatListWrapper}
        onLayout={(e) => setSlideHeight(e.nativeEvent.layout.height)}
      >
        {slideHeight > 0 && (
          <FlatList
            ref={flatListRef}
            data={SLIDES}
            renderItem={renderSlide}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        )}
      </View>

      <View style={{ paddingTop: spacing['3xl'] }}>
        <PageDots total={SLIDES.length} current={currentIndex} />
      </View>

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
  flatListWrapper: {
    flex: 1,
    width: '100%',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
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
