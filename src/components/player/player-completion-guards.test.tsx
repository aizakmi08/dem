import { act, render } from '@testing-library/react-native';
import { StartingCountdown } from './starting-countdown';
import { TransitionRest } from './transition-rest';

jest.mock('@/theme', () => ({
  useTheme: () => ({
    colors: {
      accent: '#c4603b',
      border: '#d9d2c6',
      primary: '#6f8b68',
      textSecondary: '#5b5249',
      white: '#ffffff',
    },
    typography: {
      heading: {},
      overline: {},
      title: {},
    },
  }),
}));

jest.mock('./exercise-illustration', () => ({
  ExerciseIllustration: () => null,
}));

describe('player completion guards', () => {
  it('only fires the starting countdown completion once', () => {
    jest.useFakeTimers();
    const onComplete = jest.fn();

    render(<StartingCountdown onComplete={onComplete} />);

    act(() => {
      jest.advanceTimersByTime(7000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('only fires the transition completion once', () => {
    jest.useFakeTimers();
    const onComplete = jest.fn();

    render(
      <TransitionRest
        transitionTime={1}
        nextExercise={null}
        nextColorIndex={0}
        onComplete={onComplete}
        onSkip={jest.fn()}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
