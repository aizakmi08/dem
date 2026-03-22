# Dem — Daily Stretching App Implementation Plan

## Context

Build "Dem", a full-featured daily stretching mobile app inspired by the "Bend" reference screenshots in the Paper design file. The app helps users build a daily stretching habit through personalized onboarding, curated routines, a guided exercise timer, and progress tracking. Starting from a completely blank repo.

---

## Tech Stack (verified against latest docs — March 2026)

| Layer | Choice | Version |
|---|---|---|
| Framework | React Native + Expo (managed workflow) | **Expo SDK 55**, React 19.2.0, RN 0.83.1 |
| Navigation | Expo Router (file-based routing + `Stack.Protected`) | included in SDK 55 |
| Backend/DB | InstantDB (`@instantdb/react-native`) | latest |
| Auth | InstantDB auth (`signInWithIdToken` for Google + Apple) | latest |
| Local state | Zustand + AsyncStorage (`persist` + `createJSONStorage`) | **Zustand 5.0.12** |
| Animations | React Native Reanimated + react-native-svg | **Reanimated 4.1.5** |
| Notifications | expo-notifications (local only, `SchedulableTriggerInputTypes`) | included in SDK 55 |
| Audio | expo-av (transition chime sounds) | included in SDK 55 |
| Font | Nunito via `@expo-google-fonts/nunito` | latest |
| Drag/reorder | react-native-draggable-flatlist | latest |

### Bootstrap Command
```bash
npx create-expo-app@latest --template default@sdk-55
```

### Key Dependencies
```bash
npm i @instantdb/react-native @react-native-async-storage/async-storage @react-native-community/netinfo react-native-get-random-values
npm i zustand
npm i react-native-reanimated react-native-svg react-native-gesture-handler
npm i expo-notifications expo-av expo-haptics expo-device expo-apple-authentication
npm i @react-native-google-signin/google-signin
npm i react-native-draggable-flatlist
npx expo install @expo-google-fonts/nunito expo-font
```

### Critical API Patterns

**InstantDB init (React Native):**
```typescript
import { init, i, InstaQLEntity } from '@instantdb/react-native';
const db = init({ appId: APP_ID, schema });
// Use db.useQuery(), db.transact(), db.tx, db.SignedIn, db.SignedOut, db.useUser()
```

**InstantDB schema (use `@instantdb/core` for schema file):**
```typescript
import { i } from '@instantdb/core';
const _schema = i.schema({ entities: { ... }, links: { ... } });
```

**InstantDB Apple auth (requires nonce):**
```typescript
const [nonce] = useState('' + Math.random());
const credential = await AppleAuthentication.signInAsync({ ..., nonce });
db.auth.signInWithIdToken({ clientName: 'apple', idToken: credential.identityToken, nonce });
```

**InstantDB Google auth:**
```typescript
const userInfo = await GoogleSignin.signIn();
db.auth.signInWithIdToken({ clientName: 'google', idToken: userInfo.data?.idToken });
```

**Expo Router protected routes:**
```typescript
<Stack>
  <Stack.Protected guard={!!session}>
    <Stack.Screen name="(app)" />
  </Stack.Protected>
  <Stack.Protected guard={!session}>
    <Stack.Screen name="sign-in" />
  </Stack.Protected>
</Stack>
```

**Zustand persist with AsyncStorage:**
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
const useStore = create<State>()(persist((set, get) => ({ ... }), {
  name: 'store-key',
  storage: createJSONStorage(() => AsyncStorage),
}));
```

**Reanimated 4 SVG animation:**
```typescript
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import { Circle } from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// Use useAnimatedProps to drive strokeDashoffset
```

**expo-notifications repeating:**
```typescript
Notifications.scheduleNotificationAsync({
  content: { title: 'Time to stretch!' },
  trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 86400, repeats: true },
});
```

---

## Design Theme — Warm & Organic

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| cream | #FAF7F2 | Background |
| cream-dark | #F0EBE3 | Card surfaces, input fields |
| earth-green | #5C7A5C | Primary buttons, active states |
| terracotta | #C4603B | Accent — streak fire, timer ring, highlights |
| warm-brown | #4A3728 | Headings, primary text |
| muted-text | #8C7B6E | Secondary/caption text |
| border | #E5DDD4 | Dividers, card borders |

### Dark Mode

| Token | Hex |
|---|---|
| bg | #1C1814 |
| surface | #2A2420 |
| text | #F5EFE7 |

### Typography

Font: **Nunito** (Google Fonts)

| Style | Size | Weight |
|---|---|---|
| Display | 32px / 28px | Bold (700) |
| Heading | 22px / 18px | SemiBold (600) |
| Body | 16px / 14px | Regular (400) |
| Caption | 12px | Regular (400) |

### Spacing Scale

4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 px

---

## App Structure & Navigation

### Navigation Architecture

4-tab bottom navigation:

| Tab | Icon | Screen |
|---|---|---|
| Home | House | Daily view with streak, featured routine, browse by area |
| Explore | Compass/Sparkle | Browse & search all routines with filters |
| Progress | Chart | Streak counter + calendar heatmap |
| Settings | Gear | Preferences, account, theme |

### Route Structure

```
app/
├── _layout.tsx                # Root — auth/onboarding/tabs gate
├── (auth)/
│   └── sign-in.tsx            # Google + Apple sign-in
├── (onboarding)/
│   ├── welcome.tsx            # Step 1: Welcome + branding
│   ├── education.tsx          # Step 2: Swipeable education cards
│   ├── age.tsx                # Step 3: Age picker
│   ├── gender.tsx             # Step 4: Gender selection
│   ├── experience.tsx         # Step 5: Experience level
│   ├── goals.tsx              # Step 6: Multi-select goals
│   ├── body-focus.tsx         # Step 7: Body focus areas
│   ├── concerns.tsx           # Step 8: Specific concerns (skippable)
│   ├── health-conditions.tsx  # Step 9: Health conditions (skippable)
│   ├── stretch-time.tsx       # Step 10: Preferred time
│   └── reminder.tsx           # Step 11: Reminder time picker
├── (tabs)/
│   ├── index.tsx              # Home
│   ├── explore.tsx            # Explore
│   ├── progress.tsx           # Progress
│   └── settings.tsx           # Settings
├── routine/
│   ├── [id].tsx               # Routine detail
│   └── custom.tsx             # Custom routine builder
├── player/
│   └── [routineId].tsx        # Exercise player
└── exercise/
    └── [id].tsx               # Exercise info modal
```

### Routing Logic (Root Layout)

```
Not logged in        → (auth)/sign-in
Logged in, no profile → (onboarding)/welcome
Logged in, complete   → (tabs)/index
```

---

## Data Architecture

### What Lives Where

| Data | Store | Reason |
|---|---|---|
| User profile (age, goals, etc.) | InstantDB | Syncs across devices, persists across logins |
| Progress entries | InstantDB | Offline-first sync, needed for heatmap/streak |
| Favorites | InstantDB | Syncs across devices |
| Custom routines | InstantDB | User-generated, needs sync |
| Onboarding completion flag | Zustand + AsyncStorage | Fast cold-start routing decision |
| Onboarding in-progress answers | Zustand + AsyncStorage | Survives app backgrounding mid-flow |
| Player session (current index, paused) | Zustand (in-memory only) | Session-only, reset on exit |
| Sound / transition time settings | Zustand + AsyncStorage | Local pref, fast read |
| Theme preference | Zustand + AsyncStorage | Drives styling before auth loads |
| All exercises + pre-built routines | TypeScript constants in-bundle | Zero latency, fully offline |

### InstantDB Schema

```typescript
entities: {
  profiles: {
    userId: string (indexed)
    age: number (optional)
    gender: string (optional)           // 'male' | 'female' | 'prefer_not_to_say'
    experienceLevel: string (indexed)   // 'beginner' | 'intermediate' | 'expert'
    goals: json<string[]>
    bodyFocusAreas: json<string[]>
    healthConcerns: json<string[]>
    specificConcerns: json<string[]>
    preferredStretchTime: string (optional)
    reminderTime: string (optional)     // "HH:MM" or null
    reminderEnabled: boolean
    onboardingComplete: boolean
    soundEnabled: boolean
    transitionTime: number              // seconds: 0, 5, 10, 15, 20, 25
    theme: string                       // 'light' | 'dark'
    createdAt: number
    updatedAt: number
  }

  progressEntries: {
    userId: string (indexed)
    routineId: string (indexed)
    completedAt: number (indexed)       // Unix ms timestamp
    durationSeconds: number
    exercisesCompleted: number
    exercisesTotal: number
  }

  favorites: {
    userId: string (indexed)
    routineId: string (indexed)
    createdAt: number
  }

  customRoutines: {
    userId: string (indexed)
    name: string
    description: string (optional)
    exercises: json<Array<{
      exerciseId: string
      holdSeconds: number
      order: number
    }>>
    createdAt: number
    updatedAt: number
    isShared: boolean
    shareCode: string (optional, indexed)
  }
}
```

### Static Content Types

```typescript
type Difficulty = 'beginner' | 'intermediate' | 'expert'

type BodyArea = 'neck' | 'shoulders' | 'posture' | 'lower-back' |
                'hips' | 'chest' | 'hamstrings' | 'quadriceps' |
                'feet-ankles' | 'full-body'

type RoutineCategory = 'morning' | 'midday' | 'evening' | 'post-workout'

interface Exercise {
  id: string
  name: string
  difficulty: Difficulty
  targetMuscles: string[]
  bodyAreas: BodyArea[]
  illustrationFile: string
  illustrationPrompt: string           // AI prompt for generating the illustration
  instructions: string[]               // Step-by-step ordered list
  tips: string[]
  modifications: { easier: string; harder: string }
  benefits: string[]
  defaultHoldSeconds: number
}

interface Routine {
  id: string
  name: string
  description: string
  difficulty: Difficulty
  durationMinutes: number              // 5 | 10 | 15 | 20
  bodyAreas: BodyArea[]
  category: RoutineCategory[]
  exercises: Array<{
    exerciseId: string
    holdSeconds: number
    order: number
  }>
  tags: string[]
}
```

---

## Feature Details

### 1. Sign-In Screen

- App logo + "Dem" branding
- "Start your stretching journey" tagline
- "Continue with Apple" button (native Apple auth)
- "Continue with Google" button
- Warm cream background with subtle illustration
- Auth flow: get ID token → `db.auth.signInWithIdToken()` → route to onboarding or tabs

### 2. Onboarding Flow (11 Steps)

Each step shares:
- Step progress dots at top (visible steps 3-11)
- Back button (steps 2+)
- Large illustration per step
- Consistent bottom area with Continue/Next button (teal earth-green)

**Step 1 — Welcome**
- Dem logo/icon centered
- "Welcome to Dem"
- "Our mission is to help you stretch every day."
- Illustration: person on yoga mat
- "TAP TO CONTINUE"

**Step 2 — Education (swipeable)**
- 3 cards:
  1. "Stretching is important." — "Every time you stretch, you invest in your long-term health and longevity."
  2. "Also, you'll feel great." — "Stretching improves your flexibility and range of motion, so you can move more freely and easily."
  3. "Consistency is key." — "It's important to stretch every day. Dem is a simple way to make stretching a part of your daily routine."
- Each card has a circular illustration
- Progress dots, "TAP TO CONTINUE"

**Step 3 — Age**
- "How old are you?"
- "Choose an option to continue"
- Vertical scroll wheel picker (16-90 years)
- Tip: "This will be used to optimize your exercises and routines."
- NEXT button

**Step 4 — Gender**
- "What is your gender?"
- 3 option cards: Male / Female / Prefer not to say
- Auto-advances on selection

**Step 5 — Experience Level**
- "How much experience do you have stretching?"
- 3 option cards: Beginner / Intermediate / Expert

**Step 6 — Goals (multi-select)**
- "What are your main goals from stretching?"
- "Select at least 1 to continue"
- Options (chip grid):
  - Increase flexibility & mobility
  - Improve health & longevity
  - Reduce pain & prevent injury
  - Reduce stress & anxiety
  - Improve athletic performance
  - Improve circulation & blood flow
  - Accelerate muscle recovery
  - Improve balance & coordination
  - Strengthen core
  - Improve posture
  - Improve sleep quality

**Step 7 — Body Focus Areas (multi-select)**
- "Which areas of the body do you want to focus on?"
- "Select at least 1 to continue"
- Options: Full Body, Neck, Shoulders, Posture, Lower Back, Hips, Chest, Hamstrings, Quadriceps, Feet & Ankles

**Step 8 — Specific Concerns (multi-select, skippable)**
- "Select any specific areas of concern."
- "Select all which apply to you"
- Options: Feet, Ankles, Toes, Calves, Shins, Knees, Quadriceps, Hamstrings, Hips, Lower Back, Upper Back, Shoulders, Neck, Elbows, Wrists, Fingers
- SKIP button (teal, bottom)

**Step 9 — Health Conditions (multi-select, skippable)**
- "Do you have any health conditions or concerns?"
- "Select all which apply to you"
- Options: Arthritis, Chronic Pain, Dizziness, Fibromyalgia, Heart Condition, Herniated Disc, High Blood Pressure, Injury, Pregnancy
- SKIP button

**Step 10 — Preferred Stretch Time**
- "When is a good time for your daily stretch?"
- "Choose an option to continue"
- 7 option cards:
  - After waking up
  - After morning coffee or tea
  - After exercising
  - Before showering
  - During work break
  - Before going to bed
  - Other

**Step 11 — Daily Reminder**
- "Set your daily reminder to stretch every day."
- "Choose a time below"
- Time picker (hour / minute / AM-PM scroll wheels)
- SKIP REMINDER text button
- NEXT button (teal)
- On completion: save profile to InstantDB, schedule notification, route to Home

### 3. Home Screen

**Header area:**
- Date label: "MARCH 21" in caps, muted
- Day name: "Saturday" large heading
- Streak badge (fire icon + count) — top right
- Profile avatar — top right corner

**Featured Daily Routine Card:**
- Large rounded card (cream-dark surface)
- Duration label: "5 MINUTES" in caps, terracotta
- Routine name: large heading (e.g., "Wake Up")
- Grid of circular exercise illustration thumbnails (2 rows × 3-4)
- Tap → opens routine detail

**Search Bar:**
- "Search for a routine" placeholder
- Tap → navigates to Explore tab with search focused

**Browse by Area:**
- Section heading: "BROWSE BY AREA"
- 2-column grid of cards
- Each card: circular illustration thumbnail + area name
- Areas: Hips, Lower Back, Neck, Shoulders, Chest, Full Body, Hamstrings, Quadriceps

**Recommended Routine Algorithm:**
- Map user's `preferredStretchTime` → routine category
- Filter by experience level → difficulty
- Rotate daily using completion history to avoid repeats

### 4. Exercise Player

**Layout (top to bottom):**
1. Header: X (close) — "1 of 8" — ⋯ (options menu)
2. Progress bar (thin, terracotta fill)
3. Large circular illustration with countdown ring (SVG, terracotta stroke)
4. Countdown number overlay on ring (large, e.g., "2")
5. Exercise name + (i) info button
6. Timer display below (e.g., "0:30" large muted text)
7. Playback controls: ⏪ Pause ⏩

**Timer Behavior:**
- Reanimated 3 `useSharedValue` drives SVG `strokeDashoffset` from 1.0 → 0.0
- Duration per exercise is the hold time (default 30s, customizable)
- On timer complete: play chime → transition screen → next exercise
- Transition screen: "Next: [exercise name]" with short countdown (configurable 0-25s)

**Controls:**
- Previous: restart current if <3s elapsed, otherwise go back one
- Pause/Resume: cancels animation, stores progress value
- Next: skip to next exercise
- Close (X): confirm dialog → exit player

**Background Behavior:**
- AppState listener: on `background` → auto-pause, record timestamp
- If backgrounded > 5 minutes → schedule local notification "Ready to continue your stretch?"
- On `foreground` → cancel notification, show resume state

**Options Modal (⋯ button):**
- SOUND section:
  - "Play a sound at the end of each exercise" toggle
  - "Play a sound after the transition time" toggle
- TRANSITION TIME section:
  - "The time to transition between exercises"
  - Scroll picker: Off / 5s / 10s / 15s / 20s / 25s

**Exercise Info Sheet (i button):**
- Slides up from bottom (pauses timer)
- Large illustration/photo
- Exercise name (heading)
- INSTRUCTIONS: numbered step-by-step
- TIPS: bullet points
- MODIFICATIONS: easier/harder alternatives
- BENEFITS: target muscle groups listed

**Completion:**
- After last exercise: show completion screen
  - Celebration animation
  - "Great stretch!" message
  - Stats: duration, exercises completed
  - "Done" button
- Write `progressEntry` to InstantDB

### 5. Explore Tab

**Layout:**
1. Search bar at top
2. Filter chips row (horizontally scrollable):
   - Body Area (dropdown/modal with all areas)
   - Difficulty (Beginner / Intermediate / Expert)
   - Duration (5 / 10 / 15 / 20 min)
   - Time of Day (Morning / Midday / Evening / Post-Workout)
3. "Favorites" section (if user has any hearted routines)
4. "My Routines" section (custom routines)
5. All routines grid (filtered)

**RoutineCard:**
- Routine name
- Difficulty badge + duration badge + category tag
- Strip of 3-4 exercise illustration thumbnails
- Heart icon (toggle favorite)
- Tap → routine detail screen

**Routine Detail Screen (`routine/[id].tsx`):**
- Routine name (heading), heart/favorite icon
- Duration + difficulty badges
- Description paragraph
- Divider
- Exercise list:
  - Circular illustration thumbnail
  - Exercise name
  - Hold duration with +/- adjustment buttons
  - Drag handle for reordering
  - Swipe-to-remove
- "Share Routine" button
- "Save as Custom" (if modified)
- START button (large teal CTA at bottom)

### 6. Progress Tab

**Layout:**
1. Large streak number with fire icon
   - "Day streak" label below
2. Calendar heatmap
   - Month name + year heading with ← → navigation
   - Day-of-week headers (S M T W T F S)
   - Grid of day cells
   - Color intensity: no session (cream) → 1 session (light earth-green) → 2+ (full earth-green)
   - Today highlighted with terracotta ring
3. Stats row (3 cards):
   - Total sessions
   - Total minutes
   - Longest streak

**Streak Calculation:**
- Query progressEntries for current user, ordered by completedAt desc
- Walk backwards from today counting consecutive days with ≥1 entry
- A day counts if it has at least one completed routine

### 7. Settings Tab

**Sections:**

**Profile**
- Avatar placeholder circle
- User name / email (from InstantDB auth)

**Preferences**
- Reminder time (tap to change, opens time picker)
- Sound effects (toggle switch)
- Transition time (segmented: Off / 5s / 10s / 15s / 20s / 25s)

**Appearance**
- Theme (Light / Dark toggle or segmented control)

**Account**
- Redo onboarding quiz (resets profile, restarts onboarding)
- Sign out

**About**
- Version number
- Privacy policy (opens URL)
- Terms of service (opens URL)

### 8. Custom Routine Builder (`routine/custom.tsx`)

- "Create Routine" heading
- Name text input
- Description text input (optional)
- "Add Exercises" button → opens exercise browser
  - Search + filter by body area
  - Tap exercise to add to routine
- Exercise list (same as routine detail):
  - Drag to reorder
  - +/- hold duration
  - X to remove
- "Save Routine" button → writes to InstantDB customRoutines
- Appears in Explore under "My Routines"

### 9. Sharing

- Each custom routine gets a 6-character alphanumeric `shareCode`
- Share button generates deep link: `dem://routine/share?code=ABC123`
- Native share sheet (iOS/Android)
- When deep link opened: query customRoutines by shareCode → prompt "Add to My Routines?" → duplicate into user's account

---

## Content Library Specification

### Exercise Distribution (60+ total)

| Body Area | Count | Examples |
|---|---|---|
| Neck | 6 | Neck Side Tilt, Neck Roll, Chin Tuck, Levator Scapulae Stretch, SCM Stretch, Shoulder Shrug |
| Shoulders | 8 | Shoulder Roll, Cross-Body Stretch, Doorway Stretch, Thread the Needle, Eagle Arms, Overhead Tricep, Reverse Prayer, Arm Circles |
| Back (Upper + Lower) | 10 | Cat-Cow, Child's Pose, Thoracic Rotation, Seated Spinal Twist, Cobra, Sphinx, Standing Extension, Prayer Stretch, Knee-to-Chest, Pelvic Tilt |
| Hips | 10 | Pigeon Pose, Hip Flexor Lunge, Figure-4, Butterfly, Happy Baby, Frog Stretch, Lizard Pose, 90/90, Fire Hydrant, Hip Circles |
| Legs (Quads, Hamstrings, Calves) | 12 | Standing Quad Stretch, Lying Quad Stretch, Standing Hamstring, Seated Forward Fold, Toe Touch, Standing Calf, Wall Calf, Soleus Stretch, IT Band Stretch, Inner Thigh Squat, Wide Leg Bend, Ankle Circles |
| Chest | 6 | Doorway Chest Stretch, Floor Chest Opener, Clasp Behind Back, Wall Chest Stretch, Side-Lying Rotation, Chest Expansion |
| Full Body | 8 | Upward Salute, Downward Dog, Upward Dog, Standing Side Bend, World's Greatest Stretch, Sun Salutation A, Rag Doll, Star Stretch |

### Pre-Built Routines (20-25)

| Category | Routines |
|---|---|
| Morning (3) | Wake Up (5min, beginner), Morning Flow (10min, intermediate), Sunrise Stretch (15min, intermediate) |
| Midday/Office (3) | Desk Break (5min, beginner), Office Reset (10min, beginner), Midday Mobility (15min, intermediate) |
| Evening (3) | Wind Down (5min, beginner), Evening Unwind (10min, intermediate), Deep Relax (20min, expert) |
| Post-Workout (3) | Quick Cool Down (5min, beginner), Recovery Flow (10min, intermediate), Deep Recovery (15min, expert) |
| By Body Area (7+) | Neck Relief, Shoulder Opener, Back Release, Hip Opener, Leg Day Recovery, Chest & Shoulders, Full Body Flow |
| Duration variety | At least one 5-min, 10-min, 15-min, 20-min routine per difficulty level |

### Illustration Prompt Template

```
Flat vector illustration of [PERSON DOING SPECIFIC POSE/STRETCH],
warm earthy color palette with cream background (#FAF7F2),
sage green and terracotta accents,
minimal clean lines, no text, no shadows, no background elements,
person wearing [dark/neutral workout clothes],
side view / front view / 3/4 view,
suitable for a wellness mobile app,
consistent minimalist style, 400x400px
```

Each exercise in the content data includes a specific `illustrationPrompt` field with the pose details filled in.

---

## Component Library

### UI Primitives (`src/components/ui/`)

| Component | Description |
|---|---|
| Text | Themed text with variants: display, heading, body, caption |
| Button | Variants: primary (earth-green filled), secondary (outline), ghost, icon |
| Card | Cream-dark surface, 16px border radius, subtle shadow |
| Chip | Multi-select option chip. Selected: terracotta border + light tint |
| Badge | Small colored tags (difficulty, duration) |
| ProgressBar | Thin linear bar, terracotta fill |
| BottomSheet | Gesture-dismissable bottom sheet wrapper |
| Divider | Thin horizontal line using border color |

### Feature Components

| Component | Location | Purpose |
|---|---|---|
| CountdownRing | player/ | Reanimated 3 SVG animated timer ring |
| PlayerControls | player/ | Prev / Pause / Next buttons |
| PlayerHeader | player/ | "X of Y" with progress bar |
| ExerciseInfoSheet | player/ | Slide-up detail modal |
| PlayerOptionsModal | player/ | Sound + transition settings |
| RoutineCard | routine/ | Card with thumbnail strip |
| ExerciseRow | routine/ | Row with drag handle + duration picker |
| HoldDurationPicker | routine/ | +/- buttons for hold time |
| StreakBadge | home/ | Fire icon + streak count |
| DailyRoutineCard | home/ | Featured routine card |
| AreaGrid | home/ | Circular area thumbnails grid |
| OnboardingProgress | onboarding/ | Step dots indicator |
| MultiSelectGrid | onboarding/ | Reusable chip grid for goals/areas |
| AgePicker | onboarding/ | Scroll wheel age picker |
| OptionCard | onboarding/ | Single-select rounded option card |
| CalendarHeatmap | progress/ | Month grid colored by session count |
| StatCard | progress/ | Metric card (total sessions, etc.) |

### Custom Hooks

| Hook | Purpose |
|---|---|
| useAuth | Wraps InstantDB auth state |
| useStreak | Computes current/longest streak from progressEntries |
| useNotifications | Schedule/cancel daily reminders |
| usePlayer | Player session logic (timer, navigation, completion) |
| useAppState | App foreground/background detection |
| useRecommendedRoutine | Algorithm to pick daily routine based on profile |
| useTheme | Current theme color/spacing tokens |

---

## Implementation Phases

### Phase 0: Project Bootstrap
- `npx create-expo-app@latest --template default@sdk-55` (Expo SDK 55, React 19.2, RN 0.83.1)
- Install dependencies (see Tech Stack section for exact npm commands)
- Configure `app.config.ts` (bundle ID, scheme `dem://`)
- Create InstantDB account + app, configure OAuth clients
- Create `instant.schema.ts` using `i.schema()` from `@instantdb/core`
- Push schema with `npx instant-cli push schema`
- Create folder skeleton + `.gitignore`
- **Verify:** `npx expo start` runs clean

### Phase 1: Design System & Theme
- Create `src/theme/` — colors, typography, spacing
- Load Nunito font
- Build all UI primitives (Text, Button, Card, Chip, Badge, etc.)
- **Verify:** Test screen renders all components correctly

### Phase 2: Auth & Routing Gate
- Init InstantDB with `init()` from `@instantdb/react-native`
- Build sign-in screen using `db.SignedIn`/`db.SignedOut` components
- Apple auth: use `expo-apple-authentication` with nonce → `db.auth.signInWithIdToken()`
- Google auth: use `@react-native-google-signin/google-signin` → `db.auth.signInWithIdToken()`
- Wire root layout with `Stack.Protected` guards (Expo Router)
- Create onboarding store with Zustand 5 `persist` + `createJSONStorage(() => AsyncStorage)`
- **Verify:** Sign-in → routes to onboarding or tabs

### Phase 3: Onboarding Flow
- Build all 11 onboarding screens
- Shared components (progress dots, multi-select grid, pickers)
- Final step saves profile to InstantDB + schedules notification
- **Verify:** Complete onboarding → lands on Home

### Phase 4: Content Library
- Define TypeScript types for Exercise and Routine
- Author 60+ exercises with full metadata + illustration prompts
- Author 20-25 pre-built routines
- **Verify:** All imports resolve, types validate, no duplicate IDs

### Phase 5: Home Screen
- Date display, streak badge, profile avatar
- Daily routine card with recommendation algorithm
- Search bar, area grid
- **Verify:** Personalized content loads, navigation works

### Phase 6: Exercise Player
- Countdown ring with Reanimated 4 (`useSharedValue`, `useAnimatedProps`, `withTiming`) + `react-native-svg`
- Use `Animated.createAnimatedComponent(Circle)` for animated SVG strokeDashoffset
- Exercise progression, controls, transition screens
- Sound effects via `expo-av`, info sheet, options modal
- Auto-pause on background + reminder via `expo-notifications` `SchedulableTriggerInputTypes.TIME_INTERVAL`
- Progress entry saved to InstantDB via `db.transact()` on completion
- **Verify:** Full routine plays smoothly end-to-end

### Phase 7: Explore Tab
- Search, filter chips (4 dimensions)
- Favorites section, routine cards
- Routine detail screen with customization controls
- **Verify:** Browse → filter → view → start routine

### Phase 8: Progress Tab
- Streak counter, calendar heatmap, stats
- **Verify:** Reflects actual completed sessions

### Phase 9: Settings Tab
- All settings with persistence
- Theme toggle (light/dark)
- Redo quiz, sign out
- **Verify:** Settings persist across restarts

### Phase 10: Polish & Notifications
- Push notification scheduling
- Haptic feedback
- Loading skeletons, empty states
- Error boundaries
- **Verify:** Notifications fire, haptics work

### Phase 11: Illustrations (parallel)
- AI-generate all 60+ exercise illustrations
- Consistent warm/organic style
- Compress to WebP/PNG, 400x400px
- **Verify:** All render correctly in player and cards

### Phase 12: Custom Routines & Sharing
- Custom routine builder
- Save to InstantDB
- Deep link sharing with share codes
- **Verify:** Create → play → share → import works

---

## Phase Dependencies

```
Phase 0 (Bootstrap)
  └─> Phase 1 (Design System)
        └─> Phase 2 (Auth)
              └─> Phase 3 (Onboarding)
                    └─> Phase 5 (Home) ←── Phase 4 (Content, can start earlier)
                          └─> Phase 6 (Player) ←── Phase 11 (Illustrations, parallel)
                                └─> Phase 7 (Explore)
                                      └─> Phase 8 (Progress)
                                            └─> Phase 9 (Settings)
                                                  └─> Phase 10 (Polish)
                                                        └─> Phase 12 (Custom/Share)
```

Phase 4 (Content) and Phase 11 (Illustrations) can run in parallel with other phases.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| SVG timer ring performance on old Android | Test early in Phase 6; fallback to `react-native-countdown-circle-timer` |
| 60+ illustration PNGs bloat app bundle | Compress to WebP ~20KB each → ~1.2MB total |
| Auth routing flash on cold start | Show splash while InstantDB resolves; Zustand hydrates synchronously |
| InstantDB offline with large custom routines | `json()` fields sync atomically — fine at this scale |
| Apple Sign-In requires physical device + dev account | Implement "Continue as Guest" fallback for dev/testing |

---

## Verification Strategy

**Per-phase:** Run `npx expo start`, test on iOS sim + Android emu, verify features end-to-end.

**Final integration test:** Fresh install → sign in → complete onboarding → play routine → check progress → create custom routine → change settings → force close → reopen → verify all data persists.
