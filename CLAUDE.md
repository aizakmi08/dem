# Dem — Daily Stretching App

## Conventions

- **File naming**: Always use kebab-case for all file names (e.g., `countdown-ring.tsx`, `use-auth.ts`, `onboarding-store.ts`)
- **Path aliases**: Use `@/` to import from the project root (e.g., `import { db } from '@/src/lib/db'`)
- **Route files**: `app/` contains only Expo Router route files — no components or business logic
- **Source code**: All application code lives under `src/` (components, hooks, stores, lib, theme)
- **Content library**: `src/content/` contains static exercise and routine data — treat as read-only reference data

## Tech Stack

- Expo SDK 55, React 19.2.0, React Native 0.83.1
- Expo Router (file-based routing)
- InstantDB (`@instantdb/react-native`) for backend/auth/sync
- Zustand 5 for local state
- React Native Reanimated 4 + react-native-svg for animations
- Nunito font via `@expo-google-fonts/nunito`
