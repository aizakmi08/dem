#!/usr/bin/env node
/**
 * Reads bend_app_complete_structure.xlsx and generates TypeScript content files
 * for exercises, routines, categories, and body areas.
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = XLSX.readFile(path.join(__dirname, '..', 'bend_app_complete_structure.xlsx'));

// ── Parse all sheets ──────────────────────────────────────────────────────────
const exercisesRaw = XLSX.utils.sheet_to_json(wb.Sheets['All Exercises']);
const categoriesRaw = XLSX.utils.sheet_to_json(wb.Sheets['Categories & Routines']);
const routineDetailsRaw = XLSX.utils.sheet_to_json(wb.Sheets['Routine Details']);
const browseByAreaRaw = XLSX.utils.sheet_to_json(wb.Sheets['Browse by Area']);
const seriesRaw = XLSX.utils.sheet_to_json(wb.Sheets['Series Progressions']);

// ── Helpers ───────────────────────────────────────────────────────────────────
function toKebab(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['']/g, '')
    .replace(/\//g, '-')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseDuration(str) {
  if (!str || str === '?') return 0;
  const m = String(str).match(/^(\d+):(\d+)$/);
  if (m) return parseInt(m[1]) * 60 + parseInt(m[2]);
  const minMatch = String(str).match(/(\d+)\s*min/);
  if (minMatch) return parseInt(minMatch[1]);
  return parseInt(str) || 0;
}

function parseSides(str) {
  return str === '⟲' ? 'both' : 'none';
}

function exerciseTypeToTs(type) {
  const map = {
    'Activation': 'activation',
    'Advanced': 'advanced',
    'Balance': 'balance',
    'Chair': 'chair',
    'Dynamic': 'dynamic',
    'Restorative': 'restorative',
    'Static': 'static',
    'Strength': 'strength',
  };
  return map[type] || 'static';
}

function routineTypeToTs(type) {
  const map = {
    'Stretching': 'stretching',
    'Dynamic': 'dynamic',
    'Strength': 'strength',
    'Deep Stretch': 'deep-stretch',
    'Restorative': 'restorative',
  };
  return map[type] || 'stretching';
}

function categoryToTs(cat) {
  const map = {
    'Full Body': 'beginner-series',
    'Energize': 'energize',
    'Posture': 'posture',
    'Relax & Unwind': 'relax-unwind',
    'At the Office': 'at-the-office',
    'Running': 'running',
    'Splits': 'splits',
    'Pre- & Post-Workout': 'pre-post-workout',
    'Strength': 'strength',
    'Planks': 'planks',
    'Targeted': 'targeted',
    'Body Part': 'body-part',
    'Pelvic Floor': 'pelvic-floor',
    'Beginner Series': 'beginner-series',
  };
  return map[cat] || 'beginner-series';
}

function difficultyFromDuration(mins, type) {
  if (type === 'strength' || type === 'deep-stretch') {
    if (mins <= 5) return 'beginner';
    if (mins <= 12) return 'intermediate';
    return 'expert';
  }
  if (mins <= 5) return 'beginner';
  if (mins <= 10) return 'intermediate';
  return 'expert';
}

// ── Build exercise name→ID map ────────────────────────────────────────────────
const exerciseNameToId = {};
const exerciseIdToName = {};
const exercisesByName = {};

for (const ex of exercisesRaw) {
  const name = ex['Exercise Name'];
  const id = toKebab(name);
  exerciseNameToId[name] = id;
  exerciseIdToName[id] = name;
  exercisesByName[name] = ex;
}

// ── Generate placeholder content based on exercise type ───────────────────────
function generateInstructions(name, type) {
  const typeName = type.toLowerCase();
  if (typeName === 'dynamic') {
    return [
      `Begin in a comfortable standing position with feet hip-width apart.`,
      `Perform the ${name} movement with controlled, flowing motion.`,
      `Continue the movement for the prescribed duration, maintaining steady breathing.`,
    ];
  }
  if (typeName === 'strength') {
    return [
      `Set up in the correct starting position for ${name}.`,
      `Engage your core and hold the position with proper form.`,
      `Maintain steady breathing throughout the hold duration.`,
    ];
  }
  if (typeName === 'chair') {
    return [
      `Sit upright in your chair with feet flat on the floor.`,
      `Perform the ${name} stretch gently, moving within a comfortable range.`,
      `Hold the position and breathe deeply for the prescribed duration.`,
    ];
  }
  if (typeName === 'activation') {
    return [
      `Start in a neutral position with good posture.`,
      `Perform the ${name} activation with slow, deliberate control.`,
      `Focus on engaging the target muscles throughout the movement.`,
    ];
  }
  // static / restorative / balance / advanced
  return [
    `Move gently into the ${name} position.`,
    `Hold the stretch at a point of mild tension, not pain.`,
    `Breathe deeply and allow the muscles to release with each exhale.`,
    `Return to the starting position slowly and with control.`,
  ];
}

function generateTips(name, type) {
  const tips = ['Keep your breathing slow and steady throughout.'];
  if (type === 'Dynamic') tips.push('Maintain control — avoid using momentum.');
  else if (type === 'Strength') tips.push('Keep your core engaged for stability.');
  else tips.push('Never force a stretch beyond mild discomfort.');
  tips.push('Stop immediately if you feel sharp or sudden pain.');
  return tips;
}

function generateModifications(type) {
  if (type === 'Strength') {
    return {
      easier: 'Reduce the hold time or use a wall for support.',
      harder: 'Increase the hold duration or add resistance.',
    };
  }
  if (type === 'Dynamic') {
    return {
      easier: 'Reduce the range of motion and move more slowly.',
      harder: 'Increase the speed or range of motion gradually.',
    };
  }
  return {
    easier: 'Reduce the range of motion or use a prop for support.',
    harder: 'Deepen the stretch or increase the hold time.',
  };
}

function generateBenefits(name, type) {
  const benefits = ['Improves flexibility and range of motion'];
  if (type === 'Strength') {
    benefits[0] = 'Builds muscular strength and endurance';
    benefits.push('Improves stability and balance');
  } else if (type === 'Dynamic') {
    benefits[0] = 'Warms up muscles and increases blood flow';
    benefits.push('Prepares joints for physical activity');
  } else {
    benefits.push('Reduces muscle tension and stiffness');
  }
  benefits.push('Supports overall body awareness and posture');
  return benefits;
}

// ── Generate exercises.ts ─────────────────────────────────────────────────────
function generateExercisesFile() {
  let out = `import type { Exercise } from './types';\n\n`;
  out += `export const ALL_EXERCISES: Exercise[] = [\n`;

  for (const ex of exercisesRaw) {
    const name = ex['Exercise Name'];
    const id = exerciseNameToId[name];
    const type = ex['Type'];
    const icon = ex['Icon Filename'] || `${toKebab(name)}.png`;

    const instructions = generateInstructions(name, type);
    const tips = generateTips(name, type);
    const mods = generateModifications(type);
    const benefits = generateBenefits(name, type);

    out += `  {\n`;
    out += `    id: ${JSON.stringify(id)},\n`;
    out += `    name: ${JSON.stringify(name)},\n`;
    out += `    exerciseType: ${JSON.stringify(exerciseTypeToTs(type))},\n`;
    out += `    iconFilename: ${JSON.stringify(icon)},\n`;
    out += `    instructions: ${JSON.stringify(instructions)},\n`;
    out += `    tips: ${JSON.stringify(tips)},\n`;
    out += `    modifications: ${JSON.stringify(mods)},\n`;
    out += `    benefits: ${JSON.stringify(benefits)},\n`;
    out += `  },\n`;
  }

  out += `];\n`;
  return out;
}

// ── Build routine details map ─────────────────────────────────────────────────
// Map routine name → ordered exercise entries from Routine Details sheet
const routineDetailsMap = {};
for (const rd of routineDetailsRaw) {
  const routineName = rd['Routine'];
  if (!routineDetailsMap[routineName]) routineDetailsMap[routineName] = [];
  routineDetailsMap[routineName].push({
    position: rd['Position'],
    exerciseName: rd['Exercise'],
    duration: rd['Duration'],
    sides: rd['Sides'],
    type: rd['Type'],
  });
}

// ── Parse "Routines Used In" to build reverse map: routineName → [exerciseName] ──
// Abbreviation expansions
const routineAbbreviations = {
  'S.Back': 'Strength Back',
  'S.Abs': 'Strength Abs',
  'S.Arms': 'Strength Arms',
  'S.Squats': 'Strength Squats',
  'S.Core': 'Strength Core',
  'S.Full Body': 'Strength Full Body',
  'S.Expert': 'Strength Expert',
  'FS Warm Up': 'Front Splits Warm Up',
  'FS Mobility': 'Front Splits Mobility',
  'FS Strength': 'Front Splits Strength',
  'Wake Up': 'Full Body',
};

function expandRoutineRef(ref) {
  ref = ref.trim();
  // Remove multiplier like "(×3)"
  ref = ref.replace(/\s*\(×\d+\)/, '');

  // Direct abbreviation match
  if (routineAbbreviations[ref]) return [routineAbbreviations[ref]];

  // Range patterns like "FS1-3", "PF2-5", "Planks 1-4", "Post-Run 1-3"
  let m;

  // "FS1-3" or "FS 1-3"
  m = ref.match(/^FS\s*(\d+)-(\d+)$/);
  if (m) {
    const result = [];
    for (let i = parseInt(m[1]); i <= parseInt(m[2]); i++) result.push(`Front Splits ${i}`);
    return result;
  }
  m = ref.match(/^FS\s*(\d+)$/);
  if (m) return [`Front Splits ${m[1]}`];

  // "PF2-5"
  m = ref.match(/^PF(\d+)-(\d+)$/);
  if (m) {
    const result = [];
    for (let i = parseInt(m[1]); i <= parseInt(m[2]); i++) result.push(`Pelvic Floor ${i}`);
    return result;
  }
  m = ref.match(/^PF(\d+)$/);
  if (m) return [`Pelvic Floor ${m[1]}`];

  // "Planks 1-4"
  m = ref.match(/^(.+?)\s+(\d+)-(\d+)$/);
  if (m) {
    const result = [];
    for (let i = parseInt(m[2]); i <= parseInt(m[3]); i++) result.push(`${m[1]} ${i}`);
    return result;
  }

  // "Post-Run 1-3"  already handled by above

  return [ref];
}

// Build reverse map: routine name → list of exercise names
const routineToExercises = {};
for (const ex of exercisesRaw) {
  const name = ex['Exercise Name'];
  const usedIn = ex['Routines Used In'] || '';
  const refs = usedIn.split(',').map(s => s.trim()).filter(Boolean);
  for (const ref of refs) {
    const expanded = expandRoutineRef(ref);
    for (const routineName of expanded) {
      if (!routineToExercises[routineName]) routineToExercises[routineName] = [];
      // Check for multiplier
      const multMatch = ref.match(/\(×(\d+)\)/);
      const count = multMatch ? parseInt(multMatch[1]) : 1;
      for (let i = 0; i < count; i++) {
        routineToExercises[routineName].push(name);
      }
    }
  }
}

// ── Build body area map for routines ──────────────────────────────────────────
const routineBodyAreas = {};
for (const ba of browseByAreaRaw) {
  const area = toKebab(ba['Body Area']);
  const routines = (ba['Routines in This Area'] || '').split(',').map(s => s.trim()).filter(Boolean);
  for (const rName of routines) {
    // Expand abbreviations
    const expanded = expandRoutineRef(rName);
    for (const name of expanded) {
      if (!routineBodyAreas[name]) routineBodyAreas[name] = [];
      if (!routineBodyAreas[name].includes(area)) routineBodyAreas[name].push(area);
    }
  }
}

// ── Derive exercise order for routines from Series Progressions ───────────────
// Parse series progressions to get exercise order hints
const seriesExerciseOrder = {};
for (const sp of seriesRaw) {
  if (!sp['Series'] || !sp['What It Adds vs Previous Level']) continue;
  const series = sp['Series'];
  const level = sp['Level'];
  const adds = sp['What It Adds vs Previous Level'];

  // Extract exercise names from the "Base:" or "+" prefixed text
  const exerciseNames = [];
  // Parse "Base: Ex1 → Ex2 → Ex3" or "+Ex1, Ex2, Ex3"
  let cleaned = adds.replace(/^Base:\s*/, '').replace(/^\+/, '');
  // Split by → or comma
  const parts = cleaned.split(/[→,]/).map(s => s.trim()).filter(Boolean);
  exerciseNames.push(...parts);

  const routineName = `${series} ${level}`.replace(/Level /, '');
  seriesExerciseOrder[routineName] = exerciseNames;
}

// ── Build exercises for routines without Routine Details ───────────────────────
function getExercisesForRoutine(routineName, duration, exerciseCount) {
  // 1. Check if we have full Routine Details
  if (routineDetailsMap[routineName]) {
    return routineDetailsMap[routineName].map(rd => {
      const exId = exerciseNameToId[rd.exerciseName];
      if (!exId) {
        console.warn(`  WARNING: Exercise "${rd.exerciseName}" not found in exercise list for routine "${routineName}"`);
      }
      return {
        exerciseId: exId || toKebab(rd.exerciseName),
        holdSeconds: parseDuration(rd.duration),
        sides: parseSides(rd.sides),
        order: rd.position,
      };
    });
  }

  // 2. Use "Routines Used In" reverse map
  const exerciseNames = routineToExercises[routineName];
  if (exerciseNames && exerciseNames.length > 0) {
    // Try to order using series progressions if available
    const totalDurationSec = duration * 60;
    const perExercise = exerciseNames.length > 0 ? Math.round(totalDurationSec / exerciseNames.length) : 30;
    const holdSec = Math.max(15, Math.min(120, perExercise || 30));

    return exerciseNames.map((name, i) => {
      const exId = exerciseNameToId[name];
      // Determine sides based on exercise type
      const ex = exercisesByName[name];
      const type = ex ? ex['Type'] : 'Static';
      // Default: dynamic exercises with rotation are bilateral, strength with sides
      const sides = 'none'; // We'll refine below
      return {
        exerciseId: exId || toKebab(name),
        holdSeconds: holdSec,
        sides,
        order: i + 1,
      };
    });
  }

  // 3. Fallback: empty
  console.warn(`  WARNING: No exercises found for routine "${routineName}"`);
  return [];
}

// ── Refine sides for derived routines using known exercises data ───────────────
// Build a set of exercises that typically have bilateral sides based on Routine Details
const exerciseSidesMap = {};
for (const rd of routineDetailsRaw) {
  const name = rd['Exercise'];
  const sides = rd['Sides'];
  if (sides === '⟲') exerciseSidesMap[name] = 'both';
  else if (!exerciseSidesMap[name]) exerciseSidesMap[name] = 'none';
}

function refineSides(exercises) {
  return exercises.map(ex => {
    const name = exerciseIdToName[ex.exerciseId];
    if (name && exerciseSidesMap[name]) {
      return { ...ex, sides: exerciseSidesMap[name] };
    }
    return ex;
  });
}

// ── Generate routines.ts ──────────────────────────────────────────────────────
function generateRoutinesFile() {
  let out = `import type { Routine } from './types';\n\n`;
  out += `export const ALL_ROUTINES: Routine[] = [\n`;

  for (const cat of categoriesRaw) {
    const status = cat['Status'];
    if (status === 'Partial') {
      console.log(`Skipping partial routine: ${cat['Routine Name']}`);
      continue;
    }

    const name = cat['Routine Name'];
    const id = toKebab(name);
    const category = categoryToTs(cat['Category']);
    const routineType = routineTypeToTs(cat['Type']);
    const durationStr = cat['Duration'];
    const durationMinutes = parseDuration(durationStr);
    const difficulty = difficultyFromDuration(durationMinutes, routineType);
    const bodyAreas = routineBodyAreas[name] || [];

    let description = cat['Description'] || '';
    // Handle "Same as X" descriptions
    if (description.startsWith('Same as') || description === 'Same description') {
      // Find the first routine in same category with a real description
      const sameCategory = categoriesRaw.filter(c => c['Category'] === cat['Category'] && c['Description'] && !c['Description'].startsWith('Same'));
      if (sameCategory.length > 0) description = sameCategory[0]['Description'];
      else description = `A ${routineType} routine focusing on ${cat['Category'].toLowerCase()}.`;
    }
    if (!description) {
      description = `A ${durationMinutes}-minute ${routineType} routine.`;
    }

    let exercises = getExercisesForRoutine(name, durationMinutes, parseInt(cat['Exercises']) || 0);
    exercises = refineSides(exercises);

    // Generate tags
    const tags = [
      category,
      routineType,
      difficulty,
      ...bodyAreas.slice(0, 3),
    ];

    out += `  {\n`;
    out += `    id: ${JSON.stringify(id)},\n`;
    out += `    name: ${JSON.stringify(name)},\n`;
    out += `    description: ${JSON.stringify(description)},\n`;
    out += `    category: ${JSON.stringify(category)},\n`;
    out += `    routineType: ${JSON.stringify(routineType)},\n`;
    out += `    difficulty: ${JSON.stringify(difficulty)},\n`;
    out += `    durationMinutes: ${durationMinutes},\n`;
    out += `    bodyAreas: ${JSON.stringify(bodyAreas)},\n`;
    out += `    exercises: [\n`;
    for (const ex of exercises) {
      out += `      { exerciseId: ${JSON.stringify(ex.exerciseId)}, holdSeconds: ${ex.holdSeconds}, sides: ${JSON.stringify(ex.sides)}, order: ${ex.order} },\n`;
    }
    out += `    ],\n`;
    out += `    tags: ${JSON.stringify(tags)},\n`;
    out += `  },\n`;
  }

  out += `];\n`;
  return out;
}

// ── Generate body-areas.ts ────────────────────────────────────────────────────
function generateBodyAreasFile() {
  let out = `import type { BodyArea } from './types';\n\n`;
  out += `export interface BodyAreaInfo {\n`;
  out += `  area: BodyArea;\n`;
  out += `  label: string;\n`;
  out += `  routineIds: string[];\n`;
  out += `  exerciseNames: string[];\n`;
  out += `}\n\n`;
  out += `export const BODY_AREAS: BodyAreaInfo[] = [\n`;

  for (const ba of browseByAreaRaw) {
    const area = toKebab(ba['Body Area']);
    const label = ba['Body Area'];
    const routines = (ba['Routines in This Area'] || '').split(',').map(s => s.trim()).filter(Boolean);
    const routineIds = [];
    for (const r of routines) {
      const expanded = expandRoutineRef(r);
      for (const name of expanded) routineIds.push(toKebab(name));
    }
    const exercises = (ba['Exercises Targeting This Area'] || '').split(',').map(s => s.trim()).filter(Boolean);

    out += `  {\n`;
    out += `    area: ${JSON.stringify(area)},\n`;
    out += `    label: ${JSON.stringify(label)},\n`;
    out += `    routineIds: ${JSON.stringify(routineIds)},\n`;
    out += `    exerciseNames: ${JSON.stringify(exercises)},\n`;
    out += `  },\n`;
  }

  out += `];\n`;
  return out;
}

// ── Write files ───────────────────────────────────────────────────────────────
const contentDir = path.join(__dirname, '..', 'src', 'content');

console.log('Generating exercises...');
const exercisesContent = generateExercisesFile();
fs.writeFileSync(path.join(contentDir, 'exercise-data.ts'), exercisesContent);
console.log(`  → ${exercisesRaw.length} exercises written`);

console.log('Generating routines...');
const routinesContent = generateRoutinesFile();
fs.writeFileSync(path.join(contentDir, 'routine-data.ts'), routinesContent);
const completeCount = categoriesRaw.filter(c => c['Status'] !== 'Partial').length;
console.log(`  → ${completeCount} routines written`);

console.log('Generating body areas...');
const bodyAreasContent = generateBodyAreasFile();
fs.writeFileSync(path.join(contentDir, 'body-areas.ts'), bodyAreasContent);
console.log(`  → ${browseByAreaRaw.length} body areas written`);

console.log('\nDone! Files written:');
console.log('  src/content/exercise-data.ts');
console.log('  src/content/routine-data.ts');
console.log('  src/content/body-areas.ts');
