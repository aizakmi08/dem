import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme';

interface AppLogoProps {
  size?: number;
}

export function AppLogo({ size = 88 }: AppLogoProps) {
  const { colors, radius } = useTheme();
  const iconSize = size / 2;

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: radius.full,
          backgroundColor: colors.primary,
        },
      ]}
    >
      <Svg width={iconSize} height={iconSize} viewBox="0 0 44 44" fill="none">
        <Path
          d="M22 8C18 8 14 12 12 16C10 20 10 24 12 28C14 32 18 36 22 36C26 36 30 32 32 28C34 24 34 20 32 16C30 12 26 8 22 8Z"
          stroke="#FFFFFF"
          strokeWidth={2}
          fill="none"
        />
        <Path
          d="M16 22C16 22 18 18 22 16C26 14 28 16 28 16"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Path
          d="M18 28C18 28 20 24 22 22C24 20 26 20 26 20"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
