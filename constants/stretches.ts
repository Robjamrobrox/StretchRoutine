// Powered by OnSpace.AI
export interface Stretch {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  sets: string;
  instructions: string;
  why: string;
  emoji: string;
}

export const STRETCHES: Stretch[] = [
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
  },
];
