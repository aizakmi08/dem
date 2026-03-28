import {
  memo,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@/theme';
import { useProfile } from '@/hooks/use-profile';
import { parseReminderTime } from '@/hooks/use-notifications';
import { updateReminder } from '@/hooks/use-profile-sync';
import { TimeScrollPicker } from '@/components/onboarding/time-scroll-picker';
import type { Period } from '@/stores/use-onboarding-store';

export interface ReminderSheetRef {
  present: () => void;
  dismiss: () => void;
}

const ReminderDrawerBase = forwardRef<ReminderSheetRef>(
  function ReminderDrawer(_props, ref) {
    const { colors, typography, radius, spacing } = useTheme();
    const insets = useSafeAreaInsets();
    const { profile } = useProfile();
    const sheetRef = useRef<BottomSheetModal>(null);

    const [enabled, setEnabled] = useState(false);
    const [hour, setHour] = useState(9);
    const [minute, setMinute] = useState(0);
    const [period, setPeriod] = useState<Period>('AM');
    const [saving, setSaving] = useState(false);

    const syncFromProfile = useCallback(() => {
      if (profile) {
        setEnabled(profile.reminderEnabled ?? false);
        if (profile.reminderTime) {
          const parsed = parseReminderTime(profile.reminderTime);
          setHour(parsed.hour);
          setMinute(parsed.minute);
          setPeriod(parsed.period);
        }
      }
    }, [profile]);

    useImperativeHandle(ref, () => ({
      present: () => {
        syncFromProfile();
        sheetRef.current?.present();
      },
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const handleTimeChange = useCallback(
      (h: number, m: number, p: Period) => {
        setHour(h);
        setMinute(m);
        setPeriod(p);
      },
      [],
    );

    const handleSave = useCallback(async () => {
      if (!profile?.id || saving) return;
      setSaving(true);
      try {
        await updateReminder(profile.id, enabled, hour, minute, period);
        sheetRef.current?.dismiss();
      } finally {
        setSaving(false);
      }
    }, [profile?.id, enabled, hour, minute, period, saving]);

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
        name="ReminderDrawer"
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
              Daily Reminder
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

          <View
            style={[styles.toggleRow, { marginHorizontal: spacing['2xl'] }]}
          >
            <Text style={[typography.bodyMedium, { color: colors.text }]}>
              Enable reminder
            </Text>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          {enabled && (
            <View style={styles.pickerArea}>
              <Text
                style={[
                  typography.bodySmall,
                  styles.pickerLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Choose a time
              </Text>
              <TimeScrollPicker
                defaultHour={hour}
                defaultMinute={minute}
                defaultPeriod={period}
                onTimeChange={handleTimeChange}
              />
            </View>
          )}

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

export const ReminderDrawer = memo(ReminderDrawerBase);

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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
  },
  pickerArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  pickerLabel: {
    textAlign: 'center',
    marginBottom: 4,
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
