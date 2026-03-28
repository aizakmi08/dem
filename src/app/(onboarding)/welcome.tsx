import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useTheme } from '@/theme';
export default function WelcomeScreen() {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors.background }]}
      onPress={() => router.push('/(onboarding)/education')}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing['2xl'] }]} />

      <View style={styles.spacer} />

      <View style={styles.illustrationCircle}>
        <Svg width={100} height={80} viewBox="0 0 100 80" fill="none">
          <Rect x={10} y={58} width={80} height={6} rx={3} fill={colors.accent} opacity={0.6} />
          <Circle cx={30} cy={38} r={6} fill={colors.text} />
          <Path d="M30 44L30 52L25 58" stroke={colors.text} strokeWidth={3} strokeLinecap="round" />
          <Path d="M30 52L35 58" stroke={colors.text} strokeWidth={3} strokeLinecap="round" />
          <Path d="M30 46L22 42" stroke={colors.text} strokeWidth={3} strokeLinecap="round" />
          <Path d="M30 46L38 42" stroke={colors.text} strokeWidth={3} strokeLinecap="round" />
          <Circle cx={68} cy={30} r={6} fill={colors.primary} />
          <Path d="M68 36L68 50L63 58" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" />
          <Path d="M68 50L73 58" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" />
          <Path d="M68 38L60 26" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" />
          <Path d="M68 38L76 26" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" />
        </Svg>
      </View>

      <View style={[styles.textSection, { paddingTop: spacing['3xl'], paddingHorizontal: spacing['4xl'], gap: spacing.md }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Welcome to Dem</Text>
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
          Our mission is to help you stretch every day.
        </Text>
      </View>

      <View style={styles.spacer} />

      <View style={[styles.tapArea, { paddingBottom: insets.bottom + spacing['4xl'] }]}>
        <Text style={[typography.overline, { color: colors.textSecondary }]}>Tap to continue</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
  },
  spacer: {
    flex: 1,
  },
  illustrationCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E8DDD0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSection: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 34,
    textAlign: 'center',
  },
  tapArea: {
    alignItems: 'center',
  },
});
