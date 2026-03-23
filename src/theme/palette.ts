/**
 * Decorative accent colors used for body area and exercise circle indicators.
 * These are warm, muted tones that complement the main theme surface colors.
 */
export const decorativePalette = ['#E8BFB1', '#B5C4A8', '#C4B8AA', '#DBBFAF'] as const;

export type DecorativePaletteColor = (typeof decorativePalette)[number];
