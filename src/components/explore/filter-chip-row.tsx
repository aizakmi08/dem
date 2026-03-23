import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '@/theme';

export type FilterKey = 'bodyArea' | 'difficulty' | 'duration' | 'time';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'bodyArea', label: 'Body Area' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'duration', label: 'Duration' },
  { key: 'time', label: 'Time' },
];

interface FilterChipRowProps {
  activeFilter: FilterKey | null;
  onFilterChange: (key: FilterKey | null) => void;
}

export function FilterChipRow({ activeFilter, onFilterChange }: FilterChipRowProps) {
  const { colors, typography, components } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {FILTERS.map(({ key, label }) => {
        const isActive = activeFilter === key;
        return (
          <Pressable
            key={key}
            onPress={() => onFilterChange(isActive ? null : key)}
            style={[
              styles.chip,
              {
                borderRadius: components.chip.borderRadius,
                paddingVertical: components.chip.paddingVertical,
                paddingHorizontal: 14,
                backgroundColor: isActive
                  ? components.chip.activeBackgroundColor
                  : components.chip.backgroundColor,
              },
            ]}
          >
            <Text
              style={[
                typography.label,
                {
                  color: isActive
                    ? components.chip.activeColor
                    : components.chip.color,
                },
              ]}
            >
              {label}
            </Text>
            <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
              <Path
                d="M3 4.5L6 7.5L9 4.5"
                stroke={isActive ? colors.white : colors.text}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
