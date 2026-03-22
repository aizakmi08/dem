export const typography = {
  display: {
    fontSize: 36,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 44,
    letterSpacing: -0.72,
  },
  displaySmall: {
    fontSize: 32,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 32,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 30,
  },
  headingSmall: {
    fontSize: 22,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 28,
  },
  subheading: {
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 18,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 16,
  },
  overline: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 14,
  },
  button: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 20,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
} as const;

export type Typography = typeof typography;
export type TypographyVariant = keyof Typography;
