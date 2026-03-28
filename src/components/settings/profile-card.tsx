import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { ChevronRightIcon } from './chevron-right-icon';

export const ProfileCard = memo(function ProfileCard() {
  const { colors, typography } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile();

  const email = user?.email ?? '';
  const localPart = email.split('@')[0];
  const derivedName = localPart ? localPart.charAt(0).toUpperCase() + localPart.slice(1) : '';
  const name = profile?.displayName ?? derivedName;

  return (
    <Pressable
      onPress={() => router.push('/profile/edit')}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.7 : 1 }]}
    >
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
      <ChevronRightIcon color={colors.textSecondary} />
    </Pressable>
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
    flex: 1,
    gap: 2,
  },
});
