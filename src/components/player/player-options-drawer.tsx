import {
  memo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@/theme';
import { useSettingsStore } from '@/stores/use-settings-store';

export interface PlayerOptionsDrawerRef {
  present: () => void;
  dismiss: () => void;
}

const PlayerOptionsDrawerBase = forwardRef<PlayerOptionsDrawerRef>(
  function PlayerOptionsDrawer(_props, ref) {
    const { colors, typography, radius } = useTheme();
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheetModal>(null);

    const soundEnabled = useSettingsStore((s) => s.soundEnabled);
    const transitionTime = useSettingsStore((s) => s.transitionTime);

    useImperativeHandle(ref, () => ({
      present: () => sheetRef.current?.present(),
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const handleSoundToggle = useCallback((value: boolean) => {
      useSettingsStore.getState().setSoundEnabled(value);
    }, []);

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

    return (
      <BottomSheetModal
        ref={sheetRef}
        name="PlayerOptionsDrawer"
        stackBehavior="replace"
        enableDynamicSizing
        maxDynamicContentSize={400}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
          width: 36,
          height: 4,
        }}
      >
        <BottomSheetView
          style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}
        >
          <View style={styles.header}>
            <Text style={[typography.heading, { color: colors.text }]}>
              Player Options
            </Text>
            <Pressable
              onPress={() => sheetRef.current?.dismiss()}
              hitSlop={12}
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                <Path
                  d="M1 1L11 11M11 1L1 11"
                  stroke={colors.textSecondary}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </Svg>
            </Pressable>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderRadius: radius.lg },
            ]}
          >
            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <Path
                    d="M2 8V12M5 5V15L10 12V8L5 5ZM14 7C15.1 8.1 15.1 11.9 14 13M17 5C19 7.7 19 12.3 17 15"
                    stroke={colors.textSecondary}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={[typography.body, styles.rowLabel, { color: colors.text }]}>
                Sound effects
              </Text>
              <Switch
                value={soundEnabled}
                onValueChange={handleSoundToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <Circle
                    cx={10}
                    cy={10}
                    r={8}
                    stroke={colors.textSecondary}
                    strokeWidth={1.5}
                  />
                  <Path
                    d="M10 5V10L13 13"
                    stroke={colors.textSecondary}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={[typography.body, styles.rowLabel, { color: colors.text }]}>
                Transition time
              </Text>
              <Text style={[typography.body, { color: colors.textSecondary }]}>
                {transitionTime}s
              </Text>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export const PlayerOptionsDrawer = memo(PlayerOptionsDrawerBase);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
