/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/index';
import { useProgressData } from '@/hooks/use-progress-data';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    navigate: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');

  return {
    Svg: ({ children }: { children?: unknown }) => <View>{children}</View>,
    Path: () => null,
    Circle: () => null,
  };
});

jest.mock('@/theme', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff',
      surface: '#f5f5f5',
      text: '#111',
      textSecondary: '#666',
      accent: '#c4603b',
      border: '#ddd',
      white: '#fff',
    },
    typography: {
      overline: {},
      displaySmall: {},
      subheading: {},
      bodyMedium: {},
      tabLabel: {},
    },
    components: {
      chip: { borderRadius: 12 },
      button: {
        primary: { borderRadius: 12 },
        outline: { borderRadius: 12 },
      },
    },
    radius: { xl: 24 },
  }),
}));

jest.mock('@/hooks/use-progress-data', () => ({
  useProgressData: jest.fn(),
}));

jest.mock('@/components/home/streak-badge', () => {
  const { Text } = require('react-native');
  return {
    StreakBadge: ({ count }: { count: number }) => (
      <Text testID="streak-badge">{String(count)}</Text>
    ),
  };
});

jest.mock('@/components/home/daily-routine-card', () => {
  const { Text } = require('react-native');
  return {
    DailyRoutineCard: () => <Text>daily-routine-card</Text>,
  };
});

jest.mock('@/components/home/category-card', () => {
  const { Text } = require('react-native');
  return {
    CategoryCard: () => <Text>category-card</Text>,
  };
});

jest.mock('@/components/home/body-area-card', () => {
  const { Text } = require('react-native');
  return {
    BodyAreaCard: () => <Text>body-area-card</Text>,
  };
});

jest.mock('@/components/ui/exercise-image', () => {
  const { Text } = require('react-native');
  return {
    ExerciseImage: () => <Text>exercise-image</Text>,
  };
});

const mockedUseProgressData = jest.mocked(useProgressData);

describe('HomeScreen', () => {
  it('passes the live current streak to the streak badge', () => {
    mockedUseProgressData.mockReturnValue({
      activityCounts: new Map(),
      currentStreak: 12,
      bestStreak: 20,
      totalSessions: 30,
      totalMinutes: 120,
      isLoading: false,
    });

    render(<HomeScreen />);

    expect(screen.getByTestId('streak-badge').props.children).toBe('12');
  });
});
