import { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { preBuiltRoutines } from '@/content/routines';
import type { Routine } from '@/content/types';
import { ExploreSearchBar } from '@/components/explore/explore-search-bar';
import { FilterChipRow } from '@/components/explore/filter-chip-row';
import type { FilterKey } from '@/components/explore/filter-chip-row';
import { ExploreSectionHeader } from '@/components/explore/explore-section-header';
import { FavoriteRoutineCard } from '@/components/explore/favorite-routine-card';
import { RoutineListRow } from '@/components/explore/routine-list-row';

const PLACEHOLDER_FAVORITE_IDS = ['morning-flow', 'hip-opener'];
const favoriteRoutines = preBuiltRoutines.filter((r) =>
  PLACEHOLDER_FAVORITE_IDS.includes(r.id)
);

const ITEM_HEIGHT = 76 + 10; // row height + gap

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);

  const filteredRoutines = useMemo(() => {
    if (!searchQuery.trim()) return preBuiltRoutines;
    const q = searchQuery.toLowerCase();
    return preBuiltRoutines.filter((r) => r.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const renderRoutineRow = useCallback(
    ({ item, index }: { item: Routine; index: number }) => (
      <View style={styles.routineRowWrapper}>
        <RoutineListRow routine={item} index={index} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Routine) => item.id, []);

  const listHeader = (
    <>
      {/* Title */}
      <View style={[styles.titleRow, { paddingTop: insets.top + 16 }]}>
        <Text style={[typography.title, { color: colors.text }]}>Explore</Text>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <ExploreSearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterSection}>
        <FilterChipRow
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </View>

      {/* Favorites */}
      <ExploreSectionHeader
        title="Favorites"
        variant="overline"
        actionLabel="See all"
        onAction={() => {}}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.favoritesScroll}
      >
        {favoriteRoutines.map((r) => (
          <FavoriteRoutineCard key={r.id} routine={r} />
        ))}
      </ScrollView>

      {/* All Routines header */}
      <ExploreSectionHeader title="All Routines" variant="heading" />
    </>
  );

  return (
    <FlatList
      data={filteredRoutines}
      renderItem={renderRoutineRow}
      keyExtractor={keyExtractor}
      ListHeaderComponent={listHeader}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: insets.bottom + 80 },
      ]}
      style={[styles.screen, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleRow: {
    paddingHorizontal: 24,
  },
  searchSection: {
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  filterSection: {
    paddingTop: 12,
  },
  favoritesScroll: {
    paddingHorizontal: 24,
    gap: 12,
    paddingTop: 12,
  },
  listContent: {
    gap: 10,
  },
  routineRowWrapper: {
    paddingHorizontal: 24,
  },
});
