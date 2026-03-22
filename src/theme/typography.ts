export const typography = {
  display: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 40,
  },
  displaySmall: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 36,
  },
  heading: {
    fontSize: 22,
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 28,
  },
  headingSmall: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 16,
  },
} as const;

export type Typography = typeof typography;
export type TypographyVariant = keyof Typography;
