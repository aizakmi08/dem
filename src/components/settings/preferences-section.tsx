import { memo, useCallback, useRef } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';
import { useSettingsStore } from '@/stores/use-settings-store';
import { useProfile } from '@/hooks/use-profile';
import { updateSoundEnabled } from '@/hooks/use-profile-sync';
import { SectionHeader } from './section-header';
import { SettingsRow } from './settings-row';
import { ChevronRightIcon } from './chevron-right-icon';
import { ReminderDrawer } from './reminder-drawer';
import type { ReminderSheetRef } from './reminder-drawer';
import { TransitionTimeDrawer } from './transition-time-drawer';
import type { TransitionTimeSheetRef } from './transition-time-drawer';

function BellIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9ZM13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SpeakerIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5 6 9H2v6h4l5 4V5ZM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ClockIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.8} />
      <Path
        d="M12 6v6l4 2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const PreferencesSection = memo(function PreferencesSection() {
  const { colors, typography } = useTheme();
  const { profile } = useProfile();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const transitionTime = useSettingsStore((s) => s.transitionTime);
  const reminderSheetRef = useRef<ReminderSheetRef>(null);
  const transitionSheetRef = useRef<TransitionTimeSheetRef>(null);

  const openReminderDrawer = useCallback(() => reminderSheetRef.current?.present(), []);
  const openTransitionDrawer = useCallback(() => transitionSheetRef.current?.present(), []);

  const reminderTime = profile?.reminderEnabled
    ? (profile.reminderTime ?? '9:00 AM')
    : 'Off';

  return (
    <View style={styles.section}>
      <SectionHeader title="Preferences" />
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingsRow
          icon={<BellIcon color={colors.text} />}
          label="Daily reminder"
          rightElement={
            <View style={styles.reminderRight}>
              <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>
                {reminderTime}
              </Text>
              <ChevronRightIcon color={colors.textSecondary} />
            </View>
          }
          onPress={openReminderDrawer}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingsRow
          icon={<SpeakerIcon color={colors.text} />}
          label="Sound effects"
          rightElement={
            <Switch
              value={soundEnabled}
              onValueChange={(val) => { if (profile?.id) updateSoundEnabled(profile.id, val); }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          }
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingsRow
          icon={<ClockIcon color={colors.text} />}
          label="Transition time"
          rightElement={
            <View style={styles.reminderRight}>
              <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>
                {transitionTime}s
              </Text>
              <ChevronRightIcon color={colors.textSecondary} />
            </View>
          }
          onPress={openTransitionDrawer}
        />
      </View>
      <ReminderDrawer ref={reminderSheetRef} />
      <TransitionTimeDrawer ref={transitionSheetRef} />
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    paddingTop: 28,
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  reminderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
