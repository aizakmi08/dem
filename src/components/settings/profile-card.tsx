import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';

interface ProfileCardProps {
  name: string;
  email: string;
}

export const ProfileCard = memo(function ProfileCard({ name, email }: ProfileCardProps) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={8} r={4} stroke={colors.textSecondary} strokeWidth={1.8} />
          <Path
            d="M5 20c0-3.31 3.13-6 7-6s7 2.69 7 6"
            stroke={colors.textSecondary}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <View style={styles.info}>
        <Text style={[typography.subheading, { color: colors.text }]}>{name}</Text>
        <Text style={[typography.label, { color: colors.textSecondary, fontWeight: '400' }]}>
          {email}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    gap: 2,
  },
});
