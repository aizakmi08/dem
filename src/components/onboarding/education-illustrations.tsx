import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useTheme } from '@/theme';

/** Slide 1 — Person doing a plank/push-up stretch */
export function StretchIllustration() {
  const { colors } = useTheme();
  return (
    <Svg width={80} height={64} viewBox="0 0 80 64" fill="none">
      <Circle cx={58} cy={20} r={7} fill={colors.surface} />
      <Path
        d="M55 27C55 27 48 34 40 38C32 42 24 42 24 42"
        stroke={colors.surface}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path d="M55 30L55 42" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Path d="M46 36L46 42" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Rect x={10} y={46} width={60} height={4} rx={2} fill={colors.surface} opacity={0.4} />
    </Svg>
  );
}

/** Slide 2 — Person in a seated forward fold */
export function ConsistencyIllustration() {
  const { colors } = useTheme();
  return (
    <Svg width={80} height={64} viewBox="0 0 80 64" fill="none">
      <Circle cx={44} cy={18} r={7} fill={colors.surface} />
      <Path d="M44 25L44 38" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Path d="M44 38L36 46" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Path d="M44 38L52 46" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Path d="M44 30L56 24" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Path d="M44 30L32 24" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={28} cy={38} r={3} fill={colors.surface} opacity={0.3} />
      <Circle cx={20} cy={32} r={2} fill={colors.surface} opacity={0.2} />
      <Circle cx={60} cy={38} r={3} fill={colors.surface} opacity={0.3} />
      <Circle cx={68} cy={32} r={2} fill={colors.surface} opacity={0.2} />
      <Rect x={10} y={50} width={60} height={4} rx={2} fill={colors.surface} opacity={0.4} />
    </Svg>
  );
}

/** Slide 3 — Person in a tree pose / balance */
export function ProgressIllustration() {
  const { colors } = useTheme();
  return (
    <Svg width={80} height={64} viewBox="0 0 80 64" fill="none">
      <Circle cx={40} cy={12} r={7} fill={colors.surface} />
      <Path d="M40 19L40 38" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Path d="M40 38L34 50" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Path d="M40 38L46 50" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Path d="M40 26L32 18" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Path d="M40 26L48 18" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" />
      <Path d="M24 50L26 42L30 46" stroke={colors.surface} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
      <Path d="M56 50L54 42L50 46" stroke={colors.surface} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
      <Rect x={10} y={54} width={60} height={4} rx={2} fill={colors.surface} opacity={0.4} />
    </Svg>
  );
}
