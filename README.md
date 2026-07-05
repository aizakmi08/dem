# Dem

[![CI](https://github.com/aizakmi08/dem/actions/workflows/ci.yml/badge.svg)](https://github.com/aizakmi08/dem/actions/workflows/ci.yml)

Dem is a full-featured daily stretching app built with Expo and React Native. It is designed around short guided routines, habit formation, progress tracking, and a warm mobile interface.

## Product Scope

- Personalized onboarding for goals, experience, age, gender, stretch time, and reminders.
- Home, Explore, Progress, and Settings tab navigation.
- Guided routine player with countdowns, transitions, pause states, completion guards, haptics, and sounds.
- Progress calendar, streak views, favorites, and saved routine progress.
- Local preferences with Zustand and AsyncStorage.
- Optional auth/sync through InstantDB.
- Subscription scaffolding through RevenueCat.

## Tech Stack

- Expo SDK 55
- React Native and React 19
- TypeScript
- Expo Router
- InstantDB
- Zustand
- React Native Reanimated
- React Native SVG
- Expo Notifications, Haptics, Audio, and Fonts
- Jest and React Native Testing Library

## Content Library

The app includes a structured stretching library:

- 169 exercise definitions
- 57 routine definitions
- Body-area, category, and series metadata
- Local illustration assets for exercise guidance

## Project Structure

```text
src/
|-- app/                 # Expo Router routes and navigation groups
|-- components/          # Reusable UI, player, settings, progress, and routine components
|-- content/             # Exercise and routine data
|-- hooks/               # Auth, progress, profile, timer, notification, and save hooks
|-- lib/                 # InstantDB, RevenueCat, and utilities
|-- stores/              # Zustand stores
`-- theme/               # Color, spacing, radius, typography, and component tokens
```

## Run Locally

```bash
npm install
npm start
```

Create `.env` from `.env.example`:

```bash
INSTANT_APP_ID=
GOOGLE_IOS_CLIENT_ID=
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

## Tests

```bash
npm test
```

The repo includes focused tests around the player timer, progress data, save-progress behavior, completion guards, and player store state.

## Quality Signals

- CI runs linting and focused Jest coverage for timer, progress, save-progress, and player-store behavior.
- `CONTRIBUTING.md` documents the expected validation path for mobile, content, and state changes.
- `SECURITY.md` captures credential and privacy expectations around auth, sync, and subscriptions.

## Status

This is an active mobile product prototype with production-style navigation, state, content, and monetization foundations.
