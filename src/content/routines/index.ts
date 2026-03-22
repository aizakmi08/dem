import { Routine, RoutineCategory, BodyArea, Difficulty } from '../types';
import { preBuiltRoutines } from './routines';

export { preBuiltRoutines } from './routines';

export function getRoutineById(id: string): Routine | undefined {
  return preBuiltRoutines.find((r) => r.id === id);
}

export function getRoutinesByCategory(category: RoutineCategory): Routine[] {
  return preBuiltRoutines.filter((r) => r.categories.includes(category));
}

export function getRoutinesByBodyArea(area: BodyArea): Routine[] {
  return preBuiltRoutines.filter((r) => r.bodyAreas.includes(area));
}

export function getRoutinesByDifficulty(difficulty: Difficulty): Routine[] {
  return preBuiltRoutines.filter((r) => r.difficulty === difficulty);
}
