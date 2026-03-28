import { memo, useCallback } from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useTheme } from '@/theme';
import { useNotificationPermission } from '@/hooks/use-notification-permission';

function BellOffIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9ZM13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1={1}
        y1={1}
        x2={23}
        y2={23}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export const NotificationPermissionBanner = memo(function NotificationPermissionBanner() {
  const { colors, typography } = useTheme();
  const { isBlocked } = useNotificationPermission();

  const handleOpenSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  if (!isBlocked) return null;

  return (
    <View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.container}>
        <View style={styles.left}>
          <BellOffIcon color={colors.accent} />
          <Text style={[typography.bodySmall, { color: colors.accent }]}>
            Notifications are blocked
          </Text>
        </View>
        <Pressable
          onPress={handleOpenSettings}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text
            style={[
              typography.bodySmall,
              { color: colors.accent, fontWeight: '600', textDecorationLine: 'underline' },
            ]}
          >
            Open Settings
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
