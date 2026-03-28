import {
  memo,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  type SharedValue,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@/theme';
import { useProfile } from '@/hooks/use-profile';
import { useSettingsStore } from '@/stores/use-settings-store';
import { updateTransitionTime } from '@/hooks/use-profile-sync';

const TIME_OPTIONS = [5, 10, 15, 20, 25, 30] as const;

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;

export interface TransitionTimeSheetRef {
  present: () => void;
  dismiss: () => void;
}

const TimeItem = memo(function TimeItem({
  seconds,
  index,
  scrollY,
}: {
  seconds: number;
  index: number;
  scrollY: SharedValue<number>;
}) {
  const { colors, typography } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const center = scrollY.value / ITEM_HEIGHT;
    const distance = index - center;
    const absDistance = Math.abs(distance);

    const scale = interpolate(
      absDistance,
      [0, 1, 2, 3],
      [1.3, 1.0, 0.85, 0.75],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      absDistance,
      [0, 1, 2, 3],
      [1, 0.6, 0.35, 0.2],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.itemContainer}>
      <Animated.Text
        style={[
          styles.itemText,
          typography.heading,
          { color: colors.text },
          animatedStyle,
        ]}
      >
        {seconds} seconds
      </Animated.Text>
    </View>
  );
});

const TransitionTimeDrawerBase = forwardRef<TransitionTimeSheetRef>(
  function TransitionTimeDrawer(_props, ref) {
    const { colors, typography, radius, spacing } = useTheme();
    const insets = useSafeAreaInsets();
    const { profile } = useProfile();
    const sheetRef = useRef<BottomSheetModal>(null);

    const [selected, setSelected] = useState(10);
    const [saving, setSaving] = useState(false);
    const [pickerKey, setPickerKey] = useState(0);
    const scrollY = useSharedValue(0);

    const getDefaultIndex = useCallback((time: number) => {
      const idx = TIME_OPTIONS.indexOf(time as (typeof TIME_OPTIONS)[number]);
      return idx >= 0 ? idx : 1; // fallback to 10s (index 1)
    }, []);

    useImperativeHandle(ref, () => ({
      present: () => {
        const current = useSettingsStore.getState().transitionTime;
        setSelected(current);
        const idx = getDefaultIndex(current);
        scrollY.value = idx * ITEM_HEIGHT;
        setPickerKey((k) => k + 1);
        sheetRef.current?.present();
      },
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const handleValueChange = useCallback((index: number) => {
      const clampedIndex = Math.max(
        0,
        Math.min(index, TIME_OPTIONS.length - 1),
      );
      setSelected(TIME_OPTIONS[clampedIndex]);
    }, []);

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
      },
      onMomentumEnd: (event) => {
        const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
        runOnJS(handleValueChange)(index);
      },
    });

    const handleSave = useCallback(async () => {
      if (!profile?.id || saving) return;
      setSaving(true);
      try {
        await updateTransitionTime(profile.id, selected);
        sheetRef.current?.dismiss();
      } finally {
        setSaving(false);
      }
    }, [profile?.id, selected, saving]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.4}
        />
      ),
      [],
    );

    const paddingVertical = ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2);

    return (
      <BottomSheetModal
        ref={sheetRef}
        name="TransitionTimeDrawer"
        stackBehavior="replace"
        enableDynamicSizing
        maxDynamicContentSize={500}
        enableContentPanningGesture={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
          width: 36,
          height: 4,
        }}
      >
        <BottomSheetView>
          <View style={styles.headerRow}>
            <Text style={[typography.heading, { color: colors.text }]}>
              Transition Time
            </Text>
            <Pressable
              onPress={() => sheetRef.current?.dismiss()}
              hitSlop={12}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.full,
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <Path
                  d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
                  stroke={colors.textSecondary}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </Svg>
            </Pressable>
          </View>

          <Text
            style={[
              typography.bodySmall,
              styles.subtitle,
              { color: colors.textSecondary },
            ]}
          >
            Rest between exercises
          </Text>

          <View style={[styles.pickerContainer, { height: PICKER_HEIGHT }]}>
            <View
              style={[
                styles.highlight,
                {
                  top: paddingVertical,
                  backgroundColor: colors.surface,
                  borderRadius: radius.md,
                },
              ]}
              pointerEvents="none"
            />
            <Animated.ScrollView
              key={pickerKey}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              contentOffset={{ x: 0, y: getDefaultIndex(selected) * ITEM_HEIGHT }}
            >
              <View style={{ height: paddingVertical }} />
              {TIME_OPTIONS.map((seconds, i) => (
                <TimeItem
                  key={seconds}
                  seconds={seconds}
                  index={i}
                  scrollY={scrollY}
                />
              ))}
              <View style={{ height: paddingVertical }} />
            </Animated.ScrollView>
          </View>

          <View
            style={[
              styles.buttonArea,
              { paddingBottom: Math.max(insets.bottom, spacing['2xl']) },
            ]}
          >
            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor: colors.primary,
                  borderRadius: radius.xl,
                  opacity: pressed || saving ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[typography.button, { color: colors.white }]}>
                {saving ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export const TransitionTimeDrawer = memo(TransitionTimeDrawerBase);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  pickerContainer: {
    width: '100%',
    overflow: 'hidden',
    marginTop: 16,
  },
  highlight: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: ITEM_HEIGHT,
    zIndex: 0,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 22,
    lineHeight: 28,
  },
  buttonArea: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  saveButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
