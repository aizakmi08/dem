import { Text } from 'react-native';
import { useTheme } from '@/theme';

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  const { typography, colors } = useTheme();

  return (
    <Text style={[typography.overline, { color: colors.textSecondary, paddingBottom: 12 }]}>
      {title}
    </Text>
  );
}
