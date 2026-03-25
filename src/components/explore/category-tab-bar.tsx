import { memo, useCallback, useRef, useEffect } from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import type { Category } from '@/content/types';
import { CATEGORY_ORDER } from '@/content/categories';

interface CategoryTabBarProps {
  selected: Category | null; // null = "All"
  onSelect: (category: Category | null) => void;
}

const ALL_TABS: { key: Category | null; label: string }[] = [
  { key: null, label: 'All' },
  ...CATEGORY_ORDER.map((c) => ({ key: c.category as Category | null, label: c.label })),
];

export const CategoryTabBar = memo(function CategoryTabBar({
  selected,
  onSelect,
}: CategoryTabBarProps) {
  const { typography, components } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  // Scroll selected tab into view on mount when a category is pre-selected
  useEffect(() => {
    if (selected && scrollRef.current) {
      const idx = ALL_TABS.findIndex((t) => t.key === selected);
      if (idx > 0) {
        // Approximate scroll position: each tab ~110px wide + 8px gap
        scrollRef.current.scrollTo({ x: Math.max(0, idx * 100 - 24), animated: false });
      }
    }
  }, [selected]);

  const handlePress = useCallback(
    (key: Category | null) => {
      onSelect(key);
    },
    [onSelect],
  );

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {ALL_TABS.map(({ key, label }) => {
        const isActive = selected === key;
        return (
          <Pressable
            key={label}
            onPress={() => handlePress(key)}
            style={[
              styles.tab,
              {
                borderRadius: components.chip.borderRadius,
                paddingVertical: components.chip.paddingVertical,
                paddingHorizontal: 16,
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
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
