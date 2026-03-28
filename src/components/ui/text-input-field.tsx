import { useState, type ReactNode } from 'react';
import { View, TextInput, Text, StyleSheet, type KeyboardTypeOptions } from 'react-native';
import { useTheme } from '@/theme';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  helperText?: string;
  rightIcon?: ReactNode;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
}

export function TextInputField({
  label,
  value,
  onChangeText,
  editable = true,
  helperText,
  rightIcon,
  autoCapitalize,
  keyboardType,
}: TextInputFieldProps) {
  const { colors, typography, spacing, radius } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={[typography.overline, { color: colors.textSecondary }]}>{label}</Text>
        {!editable && rightIcon}
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            borderColor: isFocused ? colors.primary : colors.border,
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            typography.body,
            {
              color: editable ? colors.text : colors.textSecondary,
              flex: 1,
            },
          ]}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {helperText && (
        <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputContainer: {
    height: 52,
    borderWidth: 1,
    justifyContent: 'center',
  },
});
