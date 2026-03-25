import type { Exercise } from '../types';
import { ALL_EXERCISES } from '../exercise-data';

export { ALL_EXERCISES } from '../exercise-data';

export function getExerciseById(id: string): Exercise | undefined {
  return ALL_EXERCISES.find((e) => e.id === id);
}
