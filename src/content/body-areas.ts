import type { BodyArea } from './types';

export interface BodyAreaInfo {
  area: BodyArea;
  label: string;
  routineIds: string[];
  exerciseNames: string[];
}

export const BODY_AREAS: BodyAreaInfo[] = [
  {
    area: "chest",
    label: "Chest",
    routineIds: ["chest-1"],
    exerciseNames: ["Chest Opener","One Arm Hug","Overhead Tricep","Wall Pecs","Wall Arms","Doorway Pecs","Reverse Shoulder","Arm Swings"],
  },
  {
    area: "core",
    label: "Core",
    routineIds: ["core-1","lower-back-1","pelvic-tilt"],
    exerciseNames: ["Cat Cow","Spinal Twist","Knees-to-chest","Pelvic Tilt Press","Bridge","Single Knee-to-Chest","Lying Figure Four"],
  },
  {
    area: "feet-and-ankles",
    label: "Feet & Ankles",
    routineIds: ["feet-and-ankles-1"],
    exerciseNames: ["Single Leg Stand","Ankle Circles","Heel-to-Toe Rocks","Lateral Foot Rocks","Knee Circles","Soleus Stretch"],
  },
  {
    area: "hamstrings",
    label: "Hamstrings",
    routineIds: ["hamstrings-1","targeted-hamstrings"],
    exerciseNames: ["Toe Touch","Cross Leg Fold","Wide Leg Bend","Side Lunge","Reverse Lunge","Seated Fold","Hurdler","Seated Straddle","Hamstring Pulls"],
  },
  {
    area: "hips",
    label: "Hips",
    routineIds: ["hips-1","targeted-hips"],
    exerciseNames: ["Lunge","Reverse Lunge","Butterfly","Lying Figure Four","Pigeon","Lizard Pose","Frog Pose","Double Pigeon","Squat Stretch"],
  },
  {
    area: "lower-back",
    label: "Lower Back",
    routineIds: ["lower-back-1","targeted-lower-back"],
    exerciseNames: ["Cat Cow","Downward Dog","Lunge","Knees-to-chest","Spinal Twist","Thunderbolt","Seated Straddle","Happy Baby","Legs-up-wall"],
  },
  {
    area: "lower-body",
    label: "Lower Body",
    routineIds: ["lower-body-1","quads-1","hamstrings-1","hips-1","feet-and-ankles-1"],
    exerciseNames: ["All lower body exercises"],
  },
  {
    area: "neck",
    label: "Neck",
    routineIds: ["neck-1"],
    exerciseNames: ["Shoulder Rolls","Neck Roll","Chin Retractions","Neck Extension","Neck Flexion","Ear-to-Shoulder","Scalene Stretch","Neck Rotation","Neck Laterals"],
  },
  {
    area: "posture",
    label: "Posture",
    routineIds: ["posture-reset","tech-neck","posture-stabilizer","posture-power","pelvic-tilt"],
    exerciseNames: ["Chin Retractions","Wall Pecs","Neck Laterals","Crunch Hold","Bird Dog","Squat Hold","Wall Sit"],
  },
  {
    area: "quadriceps",
    label: "Quadriceps",
    routineIds: ["quads-1"],
    exerciseNames: ["Standing Quad","Lunge","Kneeling Quad","Lizard Pose","Quad Stretch"],
  },
  {
    area: "shoulders",
    label: "Shoulders",
    routineIds: ["shoulders-1","targeted-shoulders"],
    exerciseNames: ["Chest Opener","One Arm Hug","Overhead Tricep","Wall Arms","Forward Fold","Shoulder Cross","Shoulder Opener","Wall Dog"],
  },
  {
    area: "splits",
    label: "Splits",
    routineIds: ["front-splits-warm-up","front-splits-1","front-splits-2","front-splits-3","front-splits-mobility","front-splits-strength","targeted-splits"],
    exerciseNames: ["Lunge","Reverse Lunge","Lizard Pose","Pigeon","Kneeling Quad","Front Split","Hamstring Pulls","Side Lunge"],
  },
  {
    area: "upper-body",
    label: "Upper Body",
    routineIds: ["upper-body-1","shoulders-1","chest-1","neck-1"],
    exerciseNames: ["All upper body exercises"],
  },
];
