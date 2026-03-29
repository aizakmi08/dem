import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';

interface StreakHeroProps {
  count: number;
  bestStreak: number;
}

export function StreakHero({ count, bestStreak }: StreakHeroProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Ambient blob decoration */}
        <View style={styles.ambientBlob} />

        {/* Left — fire icon in circle */}
        <View style={styles.iconCircle}>
          <Svg width={28} height={28} viewBox="0 0 18 18" fill="none">
            <Path
              d="M9 1.5C9 1.5 10.5 4.5 10.5 6.75C10.5 7.99264 9.82843 9 9 9C8.17157 9 7.5 7.99264 7.5 6.75L7.5 6.375C5.625 8.25 4.5 10.875 4.5 12.75C4.5 15.0972 6.52208 17 9 17C11.4779 17 13.5 15.0972 13.5 12.75C13.5 9.375 11.25 5.625 9 1.5Z"
              fill="#C4603B"
              stroke="#C4603B"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        {/* Center — current streak */}
        <View style={styles.center}>
          <Text style={styles.overline}>CURRENT STREAK</Text>
          <View style={styles.countRow}>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.daysLabel}>days</Text>
          </View>
        </View>

        {/* Right — best streak */}
        <View style={styles.right}>
          <Text style={styles.bestLabel}>BEST</Text>
          <Text style={styles.bestValue}>{bestStreak}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#5C7A5C',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ambientBlob: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    marginLeft: 14,
  },
  overline: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 2,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  countText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  daysLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  right: {
    alignItems: 'center',
    marginLeft: 12,
  },
  bestLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 2,
  },
  bestValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
  },
});
