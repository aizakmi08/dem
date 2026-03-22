export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export type BodyArea =
  | 'neck'
  | 'shoulders'
  | 'upper-back'
  | 'lower-back'
  | 'chest'
  | 'hips'
  | 'hamstrings'
  | 'quadriceps'
  | 'calves'
  | 'full-body';

export type RoutineCategory = 'morning' | 'midday' | 'evening' | 'post-workout';

export interface Exercise {
  id: string;
  name: string;
  difficulty: Difficulty;
  targetMuscles: string[];
  bodyAreas: BodyArea[];
  illustrationFile: string;
  illustrationPrompt: string;
  instructions: string[];
  tips: string[];
  modifications: {
    easier: string;
    harder: string;
  };
  benefits: string[];
  defaultHoldSeconds: number;
}

export interface RoutineExercise {
  exerciseId: string;
  holdSeconds: number;
  order: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  durationMinutes: number;
  bodyAreas: BodyArea[];
  categories: RoutineCategory[];
  exercises: RoutineExercise[];
  tags: string[];
}
