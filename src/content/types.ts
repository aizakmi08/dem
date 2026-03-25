export type ExerciseType =
  | 'activation'
  | 'advanced'
  | 'balance'
  | 'chair'
  | 'dynamic'
  | 'restorative'
  | 'static'
  | 'strength';

export type RoutineType =
  | 'stretching'
  | 'dynamic'
  | 'strength'
  | 'deep-stretch'
  | 'restorative';

export type Category =
  | 'energize'
  | 'posture'
  | 'relax-unwind'
  | 'at-the-office'
  | 'running'
  | 'splits'
  | 'pre-post-workout'
  | 'strength'
  | 'planks'
  | 'targeted'
  | 'body-part'
  | 'pelvic-floor'
  | 'beginner-series';

export type BodyArea =
  | 'chest'
  | 'core'
  | 'feet-and-ankles'
  | 'hamstrings'
  | 'hips'
  | 'lower-back'
  | 'lower-body'
  | 'neck'
  | 'posture'
  | 'quadriceps'
  | 'shoulders'
  | 'splits'
  | 'upper-body';

export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface Exercise {
  id: string;
  name: string;
  exerciseType: ExerciseType;
  iconFilename: string;
  instructions: string[];
  tips: string[];
  modifications: {
    easier: string;
    harder: string;
  };
  benefits: string[];
}

export interface RoutineExercise {
  exerciseId: string;
  holdSeconds: number;
  sides: 'none' | 'both';
  order: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  category: Category;
  routineType: RoutineType;
  difficulty: Difficulty;
  durationMinutes: number;
  bodyAreas: BodyArea[];
  exercises: RoutineExercise[];
  tags: string[];
}
