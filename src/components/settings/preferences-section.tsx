import { memo } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';
import { useSettingsStore } from '@/stores/use-settings-store';
import { useOnboardingStore } from '@/stores/use-onboarding-store';
import { SectionHeader } from './section-header';
import { SettingsRow } from './settings-row';

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
  const { colors } = useTheme();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const transitionTime = useSettingsStore((s) => s.transitionTime);
  const reminderHour = useOnboardingStore((s) => s.reminderHour);
  const reminderMinute = useOnboardingStore((s) => s.reminderMinute);
  const reminderPeriod = useOnboardingStore((s) => s.reminderPeriod);

  const reminderTime = `${reminderHour}:${String(reminderMinute).padStart(2, '0')} ${reminderPeriod}`;

  return (
    <View style={styles.section}>
      <SectionHeader title="Preferences" />
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingsRow
          icon={<BellIcon color={colors.text} />}
          label="Daily reminder"
          value={reminderTime}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingsRow
          icon={<SpeakerIcon color={colors.text} />}
          label="Sound effects"
          rightElement={
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          }
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingsRow
          icon={<ClockIcon color={colors.text} />}
          label="Transition time"
          value={`${transitionTime}s`}
        />
      </View>
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
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
