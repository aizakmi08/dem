import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';
import { getRoutinesByCategory, preBuiltRoutines } from '@/content/routines';
import { StreakBadge } from '@/components/home/streak-badge';
import { DailyRoutineCard } from '@/components/home/daily-routine-card';
import { BodyAreaCard } from '@/components/home/body-area-card';
import type { BodyArea } from '@/content/types';

const BROWSE_AREAS: BodyArea[] = [
  'hips',
  'lower-back',
  'neck',
  'shoulders',
  'full-body',
  'chest',
];

function getTimeCategory(): 'morning' | 'midday' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'midday';
  return 'evening';
}

function formatDate(): { dateLabel: string; weekday: string } {
  const now = new Date();
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const day = now.getDate();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  return { dateLabel: `${month} ${day}`, weekday };
}

// Computed once at module load — neither value changes during a session.
const dailyRoutine = getRoutinesByCategory(getTimeCategory())[0] ?? preBuiltRoutines[0];
const { dateLabel, weekday } = formatDate();

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors, typography, components } = useTheme();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={[typography.overline, { color: colors.textSecondary }]}>
            {dateLabel}
          </Text>
          <Text style={[typography.displaySmall, { color: colors.text }]}>
            {weekday}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <StreakBadge count={7} />
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.border },
            ]}
          >
            <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <Circle cx="9" cy="7" r="3" stroke={colors.textSecondary} strokeWidth={1.5} />
              <Path
                d="M3 16.5C3 13.5 5.5 12 9 12C12.5 12 15 13.5 15 16.5"
                stroke={colors.textSecondary}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </Svg>
          </View>
        </View>
      </View>

      <DailyRoutineCard routine={dailyRoutine} />

      <View style={styles.searchSection}>
        <Pressable
          style={[
            styles.searchBar,
            {
              backgroundColor: components.searchBar.backgroundColor,
              borderRadius: components.searchBar.borderRadius,
              height: components.searchBar.height,
              paddingHorizontal: components.searchBar.paddingHorizontal,
              gap: components.searchBar.gap,
            },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <Circle
              cx="8" cy="8" r="5.5"
              stroke={colors.textSecondary}
              strokeWidth={1.5}
            />
            <Path
              d="M12.5 12.5L16 16"
              stroke={colors.textSecondary}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </Svg>
          <Text
            style={[typography.bodyMedium, { color: components.searchBar.placeholderColor }]}
          >
            Search for a routine
          </Text>
        </Pressable>
      </View>

      <Text
        style={[
          typography.subheading,
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Browse by area
      </Text>
      <View style={styles.areaGrid}>
        {BROWSE_AREAS.map((area) => (
          <BodyAreaCard key={area} area={area} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    paddingTop: 28,
    paddingHorizontal: 24,
  },
  areaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 14,
    paddingHorizontal: 24,
    gap: 12,
  },
});
