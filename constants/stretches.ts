// Powered by OnSpace.AI
export interface TimerPhase {
  name: string;
  duration: number; // seconds
  cue: string; // spoken audio cue
  color: string;
}

export interface Stretch {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  sets: string;
  instructions: string;
  why: string;
  emoji: string;
  timerPhases: TimerPhase[];
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  emoji: string;
  duration: string;
  stretches: Stretch[];
}

// ─── Main Stretches ──────────────────────────────────────────────────────────

const MAIN_STRETCHES: Stretch[] = [
  {
    id: 'sciatic-nerve-floss',
    number: 1,
    name: 'Sciatic Nerve Floss',
    subtitle: 'Neural Release',
    sets: '3 sets × 12 reps per side',
    emoji: '🧠',
    instructions:
      'Sit on the edge of a high bench. As you straighten your knee, tilt your head back to look at the ceiling. As you bend your knee back down, tuck your chin down to your chest.',
    why:
      'Clears neural trapping out of the way first so your hamstrings can actually yield in subsequent stretches.',
    timerPhases: [
      { name: 'Straighten Knee', duration: 2, cue: 'Straighten, head back', color: '#4ADEAF' },
      { name: 'Bend Knee', duration: 2, cue: 'Bend, chin down', color: '#FFB347' },
    ],
  },
  {
    id: 'seated-butterfly-pnf',
    number: 2,
    name: "Seated Butterfly / Taylor's Pose PNF",
    subtitle: 'Right Hip & Adductor Release',
    sets: '3 sets × 8 reps per side (3-sec hold)',
    emoji: '🦋',
    instructions:
      'Sit tall against a wall with the soles of your feet together. Push your knees down toward the floor using your hip muscles for 3 seconds, then gently press your knees back up into your hands (resisting with 30% effort) for 5 seconds, then relax and lower them deeper.',
    why:
      'Directly targets the short adductors and rotators of the hip. Opening this bent-leg range removes the right hip pinching/sensation you felt during Test 2.',
    timerPhases: [
      { name: 'Push Down', duration: 3, cue: 'Push knees down', color: '#FF6B6B' },
      { name: 'Resist Up', duration: 5, cue: 'Resist upward, 30 percent effort', color: '#FFB347' },
      { name: 'Relax & Deepen', duration: 4, cue: 'Relax and sink deeper', color: '#4ADEAF' },
    ],
  },
  {
    id: 'supine-banded-hamstring-pnf',
    number: 3,
    name: 'Supine Banded Hamstring PNF',
    subtitle: 'Assisted Range Opener',
    sets: '3 sets × 4 reps per leg (5-sec push, 10-sec relax)',
    emoji: '🦵',
    instructions:
      'Lie flat on your back, loop a towel or strap around your foot, and lift the leg until you feel a comfortable stretch. Drive your heel down into the strap at 50% effort for 5 seconds, then relax completely and gently pull the leg slightly deeper for 10 seconds.',
    why:
      'This is your Assisted exercise. The floor prevents your upper back from rounding, forcing your hamstrings to stretch while keeping your spine neutral.',
    timerPhases: [
      { name: 'PUSH', duration: 5, cue: 'Drive heel into strap, 50 percent', color: '#FF6B6B' },
      { name: 'RELAX', duration: 10, cue: 'Relax completely and deepen', color: '#4ADEAF' },
    ],
  },
  {
    id: 'seated-single-leg-compression',
    number: 4,
    name: 'Seated Single-Leg Active Compression Lifts',
    subtitle: 'Resisted Strength',
    sets: '3 sets × 8 reps per leg (2-sec hold at top)',
    emoji: '💪',
    instructions:
      'Sit upright on the floor with your back against a wall. Place your hands near your knees. Keeping your leg locked straight, lift one foot 2 inches off the ground using your hip flexor and quad, hold for 2 seconds, then lower under control.',
    why:
      'This is your Resisted exercise. Stacking this right after your PNF stretch builds active strength in your newly opened range, teaching your brain to pull the pelvis forward into the catch on the erg.',
    timerPhases: [
      { name: 'Lift & Hold', duration: 2, cue: 'Lift and hold', color: '#FF6B6B' },
      { name: 'Lower Slowly', duration: 3, cue: 'Lower slowly under control', color: '#4ADEAF' },
    ],
  },
];

// ─── Morning Routine Stretches ────────────────────────────────────────────────

const MORNING_STRETCHES: Stretch[] = [
  {
    id: 'morning-sciatic-nerve-floss',
    number: 1,
    name: 'Seated Sciatic Nerve Floss',
    subtitle: 'Neural Wake-Up',
    sets: '60 seconds (15 reps per leg)',
    emoji: '🌅',
    instructions:
      'Sit on the edge of your bed, a chair, or the erg bench. Straighten one knee while tilting your head back to look at the ceiling. Bend your knee back down while tucking your chin to your chest.',
    why:
      'Wakes up neural gliding first thing in the morning and clears nerve restriction so your hamstrings do not lock up during your row.',
    timerPhases: [
      { name: 'Straighten', duration: 2, cue: 'Straighten, head back', color: '#4ADEAF' },
      { name: 'Bend', duration: 2, cue: 'Bend knee, chin down', color: '#FFB347' },
    ],
  },
  {
    id: 'elephant-walks',
    number: 2,
    name: 'Hands-Elevated Elephant Walks',
    subtitle: 'Dynamic Hamstring Pump',
    sets: '2 minutes (20 total alternating reps)',
    emoji: '🐘',
    instructions:
      'Place your hands on a bed frame, chair, or erg rail so your torso is tilted at a gentle 45-degree angle (avoiding full floor depth while cold). Hinge at your hips, keeping your lower back long and flat. Alternately bend one knee while locking the other leg straight, driving that hip up toward the ceiling.',
    why:
      'Dynamically pumps blood into the hamstring tendons and forces your pelvis to practice anterior tilting without overloading your lower back.',
    timerPhases: [
      { name: 'Left Straight', duration: 3, cue: 'Left leg straight, right bends', color: '#4ADEAF' },
      { name: 'Right Straight', duration: 3, cue: 'Right leg straight, left bends', color: '#64B5F6' },
    ],
  },
  {
    id: 'hip-hinge-target-touch',
    number: 3,
    name: 'Standing Hip Hinge with Target Touch',
    subtitle: 'Catch Pattern Activation',
    sets: '2 minutes (10 reps per side, 3-sec hold)',
    emoji: '🎯',
    instructions:
      'Stand tall, feet hip-width apart, soft bend in your knees. Place your knuckles in the creases of your hips (where your thighs meet your pelvis). Push your hips backward into your hands while keeping your chest up and spine flat until you feel a clean stretch high in the hamstrings and sit bones. Squeeze your glutes and push your hips forward to stand tall.',
    why:
      'Activates active compression and teaches your body the exact "rock-over" hip hinge pattern required at the catch of your rowing stroke.',
    timerPhases: [
      { name: 'Hinge Back', duration: 3, cue: 'Push hips back, chest up', color: '#FF6B6B' },
      { name: 'Hold', duration: 3, cue: 'Hold, feel the stretch at sit bones', color: '#FFB347' },
      { name: 'Stand Tall', duration: 2, cue: 'Squeeze glutes, stand tall', color: '#4ADEAF' },
    ],
  },
];

// ─── Routines ─────────────────────────────────────────────────────────────────

export const ROUTINES: Routine[] = [
  {
    id: 'main-stretches',
    name: 'Main Stretches',
    description: 'Full hamstring & hip flexibility program',
    emoji: '💪',
    duration: '~15 min',
    stretches: MAIN_STRETCHES,
  },
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Gentle wake-up flow before your row',
    emoji: '🌅',
    duration: '~7 min',
    stretches: MORNING_STRETCHES,
  },
];

// Legacy export for backward compatibility
export const STRETCHES = MAIN_STRETCHES;
