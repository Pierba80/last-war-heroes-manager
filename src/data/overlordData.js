export const OVERLORD_SKILLS = [
  { key: 'strike', name: "Overlord's Strike", sub: '1st Skill (Active)' },
  { key: 'roar', name: 'Furious Roar', sub: '2nd Skill (Attack)' },
  { key: 'brutal', name: 'Ruggito Brutale', sub: '3rd Skill (Tactics)' },
  { key: 'instinct', name: 'Primal Instinct', sub: '4th Skill (Defense)' },
  { key: 'command', name: 'Overlord Command', sub: '5th Skill (Passive)' },
];

export const OVERLORD_STATS = [
  { key: 'atk', label: 'ATK (Attacco)', color: '#f87171' },
  { key: 'def', label: 'DEF (Difesa)', color: '#38bdf8' },
  { key: 'hp', label: 'PS (Vita / HP)', color: '#4ade80' },
];

export const BOND_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export const getMaxOverlordSkillLevel = (stars = 4) => {
  if (stars <= 1) return 15;
  if (stars === 2) return 20;
  if (stars === 3) return 25;
  if (stars === 4) return 30;
  if (stars === 5) return 35;
  return 40;
};

export const getMaxTrainingByBond = (bondRank = 1) => {
  return Math.min(500, 100 + bondRank * 40);
};

export const createDefaultOverlord = () => ({
  unlocked: true,
  avatar: null,
  tier: 6,          // Gorilla Grade (1 - 7)
  level: 56,        // Main Level (1 - 70)
  subLevel: 0,      // 10 yellow bars (0 - 10)
  bondRank: 5,      // Bond Rating I..X (1 - 10)
  bondProgress: 0,  // Promotion points (0 - 20)
  training: {
    atk: 1,
    def: 1,
    hp: 1,
  },
  skills: {
    strike: 1,
    roar: 1,
    brutal: 1,
    instinct: 1,
    command: 1,
  },
  skillStars: {
    strike: 5,
    roar: 5,
    brutal: 4,
    instinct: 4,
    command: 4,
  },
  squad: null,
});

export const calculateOverlordResources = (ov) => {
  const currentLvl = Math.min(70, Math.max(1, ov.level || 1));
  const currentSub = Math.min(10, Math.max(0, ov.subLevel || 0));

  // Total sub-steps from Lv.1 to Lv.70 (69 levels * 10 bars = 690 steps)
  const completedSteps = (currentLvl - 1) * 10 + currentSub;
  const remainingSteps = Math.max(0, 690 - completedSteps);

  const unlockShards = ov.unlocked ? 0 : 100;
  const totalShards = unlockShards + remainingSteps * 20;

  // Specialized Training up to Lv. 500
  const tr = ov.training || { atk: 1, def: 1, hp: 1 };
  let guidebooks = 0;
  let certificates = 0;

  ['atk', 'def', 'hp'].forEach((k) => {
    const statLvl = Math.min(500, Math.max(1, tr[k] || 1));
    for (let lvl = statLvl + 1; lvl <= 500; lvl++) {
      guidebooks += Math.round(15 + lvl * 2.2);
      if (lvl % 20 === 0) {
        certificates += Math.floor(lvl / 20) * 10;
      }
    }
  });

  // 5 Skills up to their current star cap (or Lv. 40 max)
  const sk = ov.skills || {};
  const st = ov.skillStars || {};
  let skillBadges = 0;

  OVERLORD_SKILLS.forEach((s) => {
    const val = Math.min(40, Math.max(1, sk[s.key] || 1));
    const cap = getMaxOverlordSkillLevel(st[s.key] ?? 4);
    const target = Math.max(val, cap);
    for (let lvl = val + 1; lvl <= target; lvl++) {
      skillBadges += Math.round(25 + Math.pow(lvl, 1.85) * 3);
    }
  });

  return {
    totalShards,
    guidebooks,
    certificates,
    skillBadges,
  };
};
                                         
