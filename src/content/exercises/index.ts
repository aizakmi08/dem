import { Exercise } from '../types';

import { neckExercises } from './neck';
import { shoulderExercises } from './shoulders';
import { backExercises } from './back';
import { chestExercises } from './chest';
import { hipExercises } from './hips';
import { legExercises } from './legs';
import { fullBodyExercises } from './full-body';

export { neckExercises } from './neck';
export { shoulderExercises } from './shoulders';
export { backExercises } from './back';
export { chestExercises } from './chest';
export { hipExercises } from './hips';
export { legExercises } from './legs';
export { fullBodyExercises } from './full-body';

export const ALL_EXERCISES: Exercise[] = [
  ...neckExercises,
  ...shoulderExercises,
  ...backExercises,
  ...chestExercises,
  ...hipExercises,
  ...legExercises,
  ...fullBodyExercises,
];

export function getExerciseById(id: string): Exercise | undefined {
  return ALL_EXERCISES.find((e) => e.id === id);
}
