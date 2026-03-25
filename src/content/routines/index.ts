import type { Routine, Category, BodyArea, Difficulty } from '../types';
import { ALL_ROUTINES } from '../routine-data';

export { ALL_ROUTINES } from '../routine-data';

export function getRoutineById(id: string): Routine | undefined {
  return ALL_ROUTINES.find((r) => r.id === id);
}

export function getRoutinesByCategory(category: Category): Routine[] {
  return ALL_ROUTINES.filter((r) => r.category === category);
}

export function getRoutinesByBodyArea(area: BodyArea): Routine[] {
  return ALL_ROUTINES.filter((r) => r.bodyAreas.includes(area));
}

export function getRoutinesByDifficulty(difficulty: Difficulty): Routine[] {
  return ALL_ROUTINES.filter((r) => r.difficulty === difficulty);
}
