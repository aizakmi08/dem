import { i } from '@instantdb/core';

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),

    profiles: i.entity({
      userId: i.string().indexed(),
      age: i.number().optional(),
      gender: i.string().optional(),
      experienceLevel: i.string().indexed(),
      goals: i.json<string[]>(),
      bodyFocusAreas: i.json<string[]>(),
      healthConcerns: i.json<string[]>(),
      specificConcerns: i.json<string[]>(),
      preferredStretchTime: i.string().optional(),
      reminderTime: i.string().optional(),
      reminderEnabled: i.boolean(),
      onboardingComplete: i.boolean(),
      soundEnabled: i.boolean(),
      transitionTime: i.number(),
      theme: i.string(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),

    progressEntries: i.entity({
      userId: i.string().indexed(),
      routineId: i.string().indexed(),
      completedAt: i.number().indexed(),
      durationSeconds: i.number(),
      exercisesCompleted: i.number(),
      exercisesTotal: i.number(),
    }),

    favorites: i.entity({
      userId: i.string().indexed(),
      routineId: i.string().indexed(),
      createdAt: i.number(),
    }),

    customRoutines: i.entity({
      userId: i.string().indexed(),
      name: i.string(),
      description: i.string().optional(),
      exercises: i.json<
        Array<{
          exerciseId: string;
          holdSeconds: number;
          order: number;
        }>
      >(),
      createdAt: i.number(),
      updatedAt: i.number(),
      isShared: i.boolean(),
      shareCode: i.string().optional().indexed(),
    }),
  },

  links: {
    profileUser: {
      forward: { on: 'profiles', has: 'one', label: '$user' },
      reverse: { on: '$users', has: 'one', label: 'profile' },
    },
    progressEntryUser: {
      forward: { on: 'progressEntries', has: 'one', label: '$user' },
      reverse: { on: '$users', has: 'many', label: 'progressEntries' },
    },
    favoriteUser: {
      forward: { on: 'favorites', has: 'one', label: '$user' },
      reverse: { on: '$users', has: 'many', label: 'favorites' },
    },
    customRoutineUser: {
      forward: { on: 'customRoutines', has: 'one', label: '$user' },
      reverse: { on: '$users', has: 'many', label: 'customRoutines' },
    },
  },
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
