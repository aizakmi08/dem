import { memo, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type PressableStateCallbackType } from 'react-native';
import { useTheme } from '@/theme';

const pressedStyle = ({ pressed }: PressableStateCallbackType) => ({
  opacity: pressed ? 0.7 : 1,
});

interface SettingsRowProps {
  icon?: ReactNode;
  label: string;
  value?: string;
  rightElement?: ReactNode;
  onPress?: () => void;
  textColor?: string;
}

export const SettingsRow = memo(function SettingsRow({
  icon,
  label,
  value,
  rightElement,
  onPress,
  textColor,
}: SettingsRowProps) {
  const { typography, colors } = useTheme();

  const content = (
    <View style={styles.row}>
      <View style={styles.left}>
        {icon}
        <Text style={[typography.bodyMedium, { color: textColor ?? colors.text }]}>
          {label}
        </Text>
      </View>
      {value != null && (
        <Text style={[typography.bodySmall, { color: colors.textSecondary, fontWeight: '600' }]}>
          {value}
        </Text>
      )}
      {rightElement}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={pressedStyle}>
        {content}
      </Pressable>
    );
  }

  return content;
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
