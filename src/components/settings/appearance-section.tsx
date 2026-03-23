import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';
import { SectionHeader } from './section-header';
import { SettingsRow } from './settings-row';
import { ThemeSwitcher } from './theme-switcher';

function SunIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.8} />
      <Path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export const AppearanceSection = memo(function AppearanceSection() {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <SectionHeader title="Appearance" />
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingsRow
          icon={<SunIcon color={colors.text} />}
          label="Theme"
          rightElement={<ThemeSwitcher />}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
