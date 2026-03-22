import { Exercise } from '../types';

export const neckExercises: Exercise[] = [
  {
    id: 'neck-side-tilt',
    name: 'Neck Side Tilt',
    difficulty: 'beginner',
    targetMuscles: ['sternocleidomastoid', 'scalenes', 'upper trapezius', 'levator scapulae'],
    bodyAreas: ['neck'],
    illustrationFile: 'neck-side-tilt.png',
    illustrationPrompt:
      'Flat vector illustration of a person sitting upright tilting their head to the right side with their right ear moving toward their right shoulder, warm earthy color palette with cream background, sage green and terracotta accents, minimal clean lines, no text, no shadows, wellness mobile app style, 400x400px',
    instructions: [
      'Sit or stand tall with your spine long and shoulders relaxed and level.',
      'Slowly tilt your right ear toward your right shoulder, stopping when you feel a gentle stretch along the left side of your neck.',
      'Hold the position for 30 seconds, breathing slowly and allowing the neck muscles to soften with each exhale.',
      'Return your head to center with control, then repeat on the left side.',
    ],
    tips: [
      'Keep both shoulders pressed down and away from your ears — do not let the shoulder on the stretching side creep upward to meet your ear.',
      'Do not force the head further with your hand; let gravity do the work, or use only the lightest fingertip pressure on the temple for a gentle assist.',
      'Keep your chin parallel to the floor rather than letting it drift forward or backward.',
    ],
    modifications: {
      easier: 'Perform the tilt seated in a chair with your back supported, and use no additional pressure — rely purely on the weight of your head.',
      harder: 'Place your fingertips lightly on the opposite temple and apply gentle downward pressure to deepen the stretch, or add a slight rotation of the chin toward your armpit before tilting.',
    },
    benefits: [
      'Relieves tension in the lateral neck muscles and scalenes',
      'Improves lateral cervical range of motion',
      'Reduces tightness caused by prolonged one-sided postures',
      'Helps decompress the cervical vertebrae on the shortened side',
    ],
    defaultHoldSeconds: 30,
  },
  {
    id: 'neck-forward-fold',
    name: 'Neck Forward Fold',
    difficulty: 'beginner',
    targetMuscles: ['upper trapezius', 'suboccipitals', 'semispinalis capitis', 'splenius capitis'],
    bodyAreas: ['neck'],
    illustrationFile: 'neck-forward-fold.png',
    illustrationPrompt:
      'Flat vector illustration of a person sitting upright with their chin gently dropped toward their chest in a neck forward fold stretch, warm earthy color palette with cream background, sage green and terracotta accents, minimal clean lines, no text, no shadows, wellness mobile app style, 400x400px',
    instructions: [
      'Sit or stand with your spine erect and your shoulders rolled back and down.',
      'Take a slow breath in, and as you exhale, gently lower your chin toward your chest until you feel a stretch across the back of your neck.',
      'Let the weight of your head create the stretch naturally — do not pull the head down with your hands.',
      'Hold for 30 seconds, breathing deeply and releasing any tension in the neck and upper back with each exhale.',
      'Slowly lift your head back to neutral on an inhale.',
    ],
    tips: [
      'Avoid rounding your upper back — keep the chest open and the shoulders back so only the neck is stretching.',
      'If you feel tingling or numbness, ease off immediately and bring your head back to neutral.',
      'Soften your jaw and let your face muscles relax completely during the hold.',
    ],
    modifications: {
      easier: 'Only lower the chin halfway down, stopping before any discomfort, and focus on slow diaphragmatic breathing to encourage the muscles to release.',
      harder: 'Interlace your fingers behind your head and use the weight of your hands alone (no pulling) to deepen the stretch, or add a slow chin-to-chest nod pulsing gently.',
    },
    benefits: [
      'Stretches the deep posterior cervical muscles and suboccipitals',
      'Relieves tension headaches originating at the base of the skull',
      'Counteracts the forward-head posture common with screen use',
      'Increases flexion range of motion in the cervical spine',
    ],
    defaultHoldSeconds: 30,
  },
  {
    id: 'neck-roll',
    name: 'Neck Roll',
    difficulty: 'beginner',
    targetMuscles: ['sternocleidomastoid', 'scalenes', 'upper trapezius', 'levator scapulae', 'suboccipitals'],
    bodyAreas: ['neck'],
    illustrationFile: 'neck-roll.png',
    illustrationPrompt:
      'Flat vector illustration of a person sitting upright slowly rolling their head in a semicircular arc from shoulder to shoulder with eyes closed, warm earthy color palette with cream background, sage green and terracotta accents, minimal clean lines, no text, no shadows, wellness mobile app style, 400x400px',
    instructions: [
      'Sit or stand tall with your spine long and your shoulders relaxed away from your ears.',
      'Drop your right ear toward your right shoulder to begin.',
      'Slowly roll your chin down toward your chest in a smooth, controlled arc.',
      'Continue rolling your left ear toward your left shoulder, then pause to feel the stretch on the right side of your neck.',
      'Reverse direction, rolling back through center and ending with the right ear toward the right shoulder again. Complete 3–5 slow rolls each direction.',
    ],
    tips: [
      'Never roll the head backward through full extension — keep the movement to a front semicircle (ear to chin to ear) to protect the cervical joints.',
      'Move at a pace slow enough that you can pause and breathe into any area of tightness you encounter.',
      'Keep your jaw relaxed and your face soft throughout the movement.',
    ],
    modifications: {
      easier: 'Perform only the side-to-side arc without reaching the full chin-to-chest position, staying within a pain-free range.',
      harder: 'Pause for 5–10 seconds at any particularly tight spot in the arc before continuing the roll.',
    },
    benefits: [
      'Mobilizes all planes of cervical movement in one fluid exercise',
      'Releases accumulated tension across the full circumference of the neck',
      'Improves synovial fluid distribution in cervical facet joints',
      'Encourages body awareness of neck tension patterns',
    ],
    defaultHoldSeconds: 30,
  },
  {
    id: 'chin-tuck',
    name: 'Chin Tuck',
    difficulty: 'beginner',
    targetMuscles: ['deep cervical flexors', 'longus colli', 'longus capitis', 'suboccipitals'],
    bodyAreas: ['neck'],
    illustrationFile: 'chin-tuck.png',
    illustrationPrompt:
      'Flat vector illustration of a person standing against a wall performing a chin tuck exercise with the back of their head gently pressing backward to create a double chin, warm earthy color palette with cream background, sage green and terracotta accents, minimal clean lines, no text, no shadows, wellness mobile app style, 400x400px',
    instructions: [
      'Stand with your back against a wall, with your heels, glutes, and upper back lightly touching it.',
      'Look straight ahead with your chin level, then draw your chin straight back — as if making a "double chin" — until the back of your head moves closer to or touches the wall.',
      'Hold this retracted position for 20 seconds, keeping your jaw relaxed and your gaze forward.',
      'Release the chin forward to a neutral position, rest for a breath, and repeat for 3–5 repetitions.',
    ],
    tips: [
      'The motion is a straight horizontal retraction — do not tuck your chin down toward your chest or tilt your head backward.',
      'You should feel a gentle stretch at the base of your skull and a mild activation in the front of your throat, not sharp pain.',
      'Keep your shoulders away from your ears and your chest open throughout.',
    ],
    modifications: {
      easier: 'Perform the exercise lying flat on your back on the floor, pressing the back of your head gently into the surface as you tuck.',
      harder: 'Add a light resistance band looped around the back of your head and anchored in front, or hold for longer (up to 10 seconds per rep) for greater endurance challenge.',
    },
    benefits: [
      'Strengthens the deep cervical flexors to correct forward head posture',
      'Decompresses the suboccipital joints at the base of the skull',
      'Reduces strain on posterior neck muscles caused by tech-neck positioning',
      'Retrains proper cervical alignment in daily activities',
    ],
    defaultHoldSeconds: 20,
  },
  {
    id: 'levator-scapulae-stretch',
    name: 'Levator Scapulae Stretch',
    difficulty: 'intermediate',
    targetMuscles: ['levator scapulae', 'upper trapezius', 'splenius cervicis'],
    bodyAreas: ['neck', 'shoulders'],
    illustrationFile: 'levator-scapulae-stretch.png',
    illustrationPrompt:
      'Flat vector illustration of a person sitting and rotating their head diagonally so they look toward one armpit while gently pressing their head down with one hand to stretch the back corner of the neck, warm earthy color palette with cream background, sage green and terracotta accents, minimal clean lines, no text, no shadows, wellness mobile app style, 400x400px',
    instructions: [
      'Sit upright in a chair and anchor your right hand under the seat to keep the right shoulder blade depressed.',
      'Rotate your head approximately 45 degrees to the left, pointing your nose toward your left armpit.',
      'From this rotated position, gently drop your chin diagonally down toward your left armpit until you feel a stretch in the upper-right back corner of your neck.',
      'Use your left hand to apply very light downward pressure on the back of your head to deepen the stretch without forcing it.',
      'Hold for 30 seconds, breathing steadily, then repeat on the opposite side.',
    ],
    tips: [
      'Anchoring the hand under the chair is critical — it stabilizes the shoulder blade and isolates the levator scapulae rather than letting the shoulder shrug up to reduce the stretch.',
      'The diagonal angle of the nose toward the armpit targets the levator scapulae specifically; too far forward or too far to the side shifts the emphasis to other muscles.',
      'Only use fingertip pressure on the head — never press hard or force the neck further than it comfortably goes.',
    ],
    modifications: {
      easier: 'Skip the hand pressure on the head and allow only the weight of the head itself to provide the stretch in the rotated and tilted position.',
      harder: 'Add a side-bend component by bringing the ear slightly toward the shoulder after reaching the diagonal position, or increase hold time to 45 seconds.',
    },
    benefits: [
      'Directly targets the levator scapulae, a common site of desk-posture tension',
      'Reduces referred pain between the neck and shoulder blade',
      'Improves rotation and lateral flexion of the cervical spine',
      'Relieves tension headaches originating from upper cervical and shoulder girdle tightness',
    ],
    defaultHoldSeconds: 30,
  },
  {
    id: 'scm-stretch',
    name: 'SCM Stretch',
    difficulty: 'intermediate',
    targetMuscles: ['sternocleidomastoid', 'scalenes', 'platysma'],
    bodyAreas: ['neck'],
    illustrationFile: 'scm-stretch.png',
    illustrationPrompt:
      'Flat vector illustration of a person sitting upright rotating their head to one side and tilting it slightly back to stretch the front and side of the neck, showing the long diagonal line of the sternocleidomastoid muscle, warm earthy color palette with cream background, sage green and terracotta accents, minimal clean lines, no text, no shadows, wellness mobile app style, 400x400px',
    instructions: [
      'Sit or stand tall with your shoulders down and back, spine long.',
      'Rotate your head to the right so your nose points over your right shoulder.',
      'From that rotated position, gently tilt your head back and slightly upward to extend the cervical spine diagonally, stretching the left SCM muscle along the front-left of your neck.',
      'Hold the position for 30 seconds, breathing slowly and maintaining the rotation throughout — do not let the head drift back to center.',
      'Return to neutral slowly, rest, and repeat rotating to the left to stretch the right SCM.',
    ],
    tips: [
      'The combination of rotation AND slight extension is key to isolating the SCM — rotation alone will not fully stretch this muscle.',
      'Keep the extension gentle; you do not need to go far back. Stop as soon as you feel the diagonal pull along the front of the neck.',
      'If you feel dizzy or experience any head rushes, return to neutral immediately and avoid extending the neck until assessed by a professional.',
    ],
    modifications: {
      easier: 'Omit the extension component and perform rotation only, keeping the chin level, for a gentler stretch of the anterior neck.',
      harder: 'Place two fingers of the opposite hand lightly on the collarbone to gently depress the clavicle while stretching, increasing the length of the SCM stretch.',
    },
    benefits: [
      'Stretches the sternocleidomastoid, the primary lateral neck rotator and flexor',
      'Reduces anterior neck tightness linked to forward-head posture',
      'Helps relieve tension-type headaches that radiate from the neck into the temples',
      'Improves cervical rotation range of motion',
    ],
    defaultHoldSeconds: 30,
  },
];
