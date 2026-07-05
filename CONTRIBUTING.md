# Contributing to Dem

Dem is an Expo/React Native stretching app with a large content library, routine player, progress state, and optional sync/monetization integrations.

## Local Setup

```bash
npm install
npm start
```

Create local environment values from the README before testing auth/sync flows.

## Quality Bar

- Run `npm run lint` before committing UI, navigation, or state changes.
- Run `npm test -- --runInBand` for player, progress, content, or store changes.
- Keep exercise/routine content structured and avoid duplicating metadata.
- Prefer focused tests for timer, completion, save-progress, and routine-state behavior.
- Keep onboarding and settings copy consistent with the product scope in `README.md`.

## Pull Request Notes

Include the user flow affected, the validation performed, and any known device/platform caveats.
