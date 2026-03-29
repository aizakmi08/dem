import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import type { BodyArea } from '@/content/types';
import { BODY_AREAS, type BodyAreaInfo } from '@/content/body-areas';
import { ALL_EXERCISES } from '@/content/exercise-data';
import { ExerciseImage } from '@/components/ui/exercise-image';

// Pre-compute: for each body area pick up to 3 distinct exercise icons
const AREA_ICONS: Record<string, string[]> = {};
for (const ba of BODY_AREAS) {
  const icons: string[] = [];
  for (const name of ba.exerciseNames) {
    if (icons.length >= 3) break;
    const ex = ALL_EXERCISES.find(
      (e) => e.name === name || e.name.toLowerCase() === name.toLowerCase(),
    );
    if (ex && !icons.includes(ex.iconFilename)) {
      icons.push(ex.iconFilename);
    }
  }
  AREA_ICONS[ba.area] = icons;
}

function getAreaInfo(area: BodyArea): BodyAreaInfo | undefined {
  return BODY_AREAS.find((b) => b.area === area);
}

interface BodyAreaCardProps {
  area: BodyArea;
  onPress?: () => void;
}

export function BodyAreaCard({ area, onPress }: BodyAreaCardProps) {
  const { colors, typography, radius } = useTheme();
  const info = getAreaInfo(area);
  const routineCount = info?.routineIds.length ?? 0;
  const exerciseCount = info?.exerciseNames.length ?? 0;
  const icons = AREA_ICONS[area] ?? [];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconRow}>
          {icons.map((icon) => (
            <ExerciseImage key={icon} iconFilename={icon} size={28} round />
          ))}
        </View>
        <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
          <Path
            d="M6 4L10 8L6 12"
            stroke={colors.textSecondary}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <Text style={[typography.bodyMedium, { color: colors.text }]} numberOfLines={1}>
        {info?.label ?? area}
      </Text>
      <Text style={[typography.tabLabel, { color: colors.textSecondary }]}>
        {routineCount} {routineCount === 1 ? 'routine' : 'routines'} · {exerciseCount} exercises
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%' as unknown as number,
    padding: 14,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 4,
  },
});
