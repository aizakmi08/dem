import { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '@/theme';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** Maps "YYYY-MM-DD" → session count for that day. */
type ActivityMap = Map<string, number>;

interface ProgressCalendarProps {
  activityCounts: ActivityMap;
}

const INTENSITY_COLORS = [
  '#5C7A5C26', // 1 session  — 15% opacity
  '#5C7A5C40', // 2 sessions — 25% opacity
  '#5C7A5C66', // 3+ sessions — 40% opacity
] as const;

function getIntensityColor(count: number): string | undefined {
  if (count <= 0) return undefined;
  if (count === 1) return INTENSITY_COLORS[0];
  if (count === 2) return INTENSITY_COLORS[1];
  return INTENSITY_COLORS[2];
}

/** Format a Date as "YYYY-MM-DD" for Set lookup. */
function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Build a 2D grid (rows × 7 columns) for the given month. null = empty slot. */
function buildGrid(year: number, month: number): (number | null)[][] {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid: (number | null)[][] = [];
  let row: (number | null)[] = Array(firstDayOfWeek).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    row.push(day);
    if (row.length === 7) {
      grid.push(row);
      row = [];
    }
  }

  // Pad final row
  if (row.length > 0) {
    while (row.length < 7) row.push(null);
    grid.push(row);
  }

  return grid;
}

export function ProgressCalendar({ activityCounts }: ProgressCalendarProps) {
  const { colors, typography, radius } = useTheme();

  const now = new Date();
  const todayKey = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const grid = useMemo(() => buildGrid(year, month), [year, month]);

  const goBack = useCallback(() => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goForward = useCallback(() => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  return (
    <View style={styles.wrapper}>
      {/* Month navigation */}
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={12}>
          <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <Path
              d="M12.5 5L7.5 10L12.5 15"
              stroke={colors.text}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
        <Text style={[typography.subheading, { color: colors.text }]}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <Pressable onPress={goForward} hitSlop={12}>
          <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <Path
              d="M7.5 5L12.5 10L7.5 15"
              stroke={colors.text}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>

      {/* Day-of-week headers */}
      <View style={styles.dayHeaders}>
        {DAY_LABELS.map((label, i) => (
          <View key={i} style={styles.dayCell}>
            <Text style={[typography.label, { color: colors.textSecondary }]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.grid}>
        {grid.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((day, ci) => {
              if (day === null) {
                return <View key={ci} style={styles.dayCell} />;
              }

              const dateKey = toDateKey(year, month, day);
              const isToday = dateKey === todayKey;
              const count = activityCounts.get(dateKey) ?? 0;
              const isFuture = dateKey > todayKey;
              const intensityBg = getIntensityColor(count);

              return (
                <View
                  key={ci}
                  style={[
                    styles.dayCell,
                    { borderRadius: radius.md },
                    intensityBg
                      ? { backgroundColor: intensityBg }
                      : !isFuture && { backgroundColor: colors.surface },
                    isToday && styles.todayBorder,
                    isToday && { borderColor: colors.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      typography.bodyMedium,
                      { color: isFuture ? colors.textSecondary : colors.text },
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 36,
  },
  dayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  grid: {
    paddingTop: 10,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    textAlign: 'center',
  },
  todayBorder: {
    borderWidth: 2,
  },
});
