import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

export default function HomeScreen() {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.display, { color: colors.text }]}>Dem</Text>
      <Text style={[typography.body, { color: colors.primary, marginTop: spacing.sm }]}>
        Daily Stretching
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
