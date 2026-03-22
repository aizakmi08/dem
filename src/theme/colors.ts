export const lightColors = {
  background: '#FAF7F2',
  surface: '#F0EBE3',
  primary: '#5C7A5C',
  accent: '#C4603B',
  text: '#4A3728',
  textSecondary: '#8C7B6E',
  border: '#E5DDD4',
  white: '#FFFFFF',
} as const;

export const darkColors = {
  background: '#1C1814',
  surface: '#2A2420',
  primary: '#5C7A5C',
  accent: '#C4603B',
  text: '#F5EFE7',
  textSecondary: '#A89B8E',
  border: '#3A3430',
  white: '#FFFFFF',
} as const;

export type ColorTokens = {
  readonly background: string;
  readonly surface: string;
  readonly primary: string;
  readonly accent: string;
  readonly text: string;
  readonly textSecondary: string;
  readonly border: string;
  readonly white: string;
};
