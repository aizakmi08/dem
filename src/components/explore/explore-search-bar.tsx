import { View, TextInput, StyleSheet } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import { useTheme } from '@/theme';

interface ExploreSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function ExploreSearchBar({ value, onChangeText }: ExploreSearchBarProps) {
  const { colors, typography, components } = useTheme();

  return (
    <View
      style={[
        styles.container,
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
          cx="8"
          cy="8"
          r="5.5"
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
      <TextInput
        defaultValue={value}
        onChangeText={onChangeText}
        placeholder="Search routines & exercises"
        placeholderTextColor={components.searchBar.placeholderColor}
        selectionColor={colors.primary}
        style={[typography.bodyMedium, styles.input, { color: colors.text }]}
        returnKeyType="search"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
  },
});
