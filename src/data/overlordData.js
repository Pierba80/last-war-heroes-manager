export const OVERLORD_SKILLS = [
  { key: 'strike', name: 'Overlord Strike', type: 'Active' },
  { key: 'roar', name: 'Primal Roar', type: 'Passive' },
  { key: 'brutal', name: 'Brutal Force', type: 'Passive' },
  { key: 'instinct', name: 'Apex Instinct', type: 'Passive' },
  { key: 'command', name: 'Warlord Command', type: 'Passive' },
];

export const OVERLORD_STATS = [
  { key: 'atk', label: 'ATK Training', color: '#f87171' },
  { key: 'def', label: 'DEF Training', color: '#38bdf8' },
  { key: 'hp', label: 'HP Training', color: '#4ade80' },
];

export const SUB_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export const BOND_RATINGS = [
  { rank: 1, roman: 'I', label: 'Novice Partner', color: '#94a3b8', maxTrain: 49 },
  { rank: 2, roman: 'II', label: 'Trusted Ally', color: '#60a5fa', maxTrain: 99 },
  { rank: 3, roman: 'III', label: 'Battle Comrade', color: '#38bdf8', maxTrain: 149 },
  { rank: 4, roman: 'IV', label: 'Loyal Companion', color: '#34d399', maxTrain: 199 },
  { rank: 5, roman: 'V', label: 'Sworn Guardian', color: '#4ade80', maxTrain: 249 },
  { rank: 6, roman: 'VI', label: 'Bonded Partner', color: '#a3e635', maxTrain: 349 },
  { rank: 7, roman: 'VII', label: 'Soulbound Ally', color: '#facc15', maxTrain: 399 },
  { rank: 8, roman: 'VIII', label: 'Apex Herald', color: '#fbbf24', maxTrain: 449 },
  { rank: 9, roman: 'IX', label: 'Warlord Champion', color: '#fb923c', maxTrain: 499 },
  { rank: 10, roman: 'X', label: 'Primal Sovereign', color: '#f97316', maxTrain: 549 },
  { rank: 11, roman: 'XI', label: 'Mythic Overlord', color: '#ef4444', maxTrain: 599 },
  { rank: 12, roman: 'XII', label: 'Eternal Monarch', color: '#f43f5e', maxTrain: 600 },
];

export const getBondInfo = (rank = 1) => {
  return BOND_RATINGS.find((b) => b.rank === rank) || BOND_RATINGS.at(0);
};

export const getMaxOverlordSkillLevel = (stars = 0) => {
  if (stars <= 0) return 10;
  if (stars === 1) return 15;
  if (stars === 2) return 20;
  if (stars === 3) return 25;
  if (stars === 4) return 30;
  if (stars === 5) return 35;
  return 40;
};
   export const createDefaultOverlord = () => ({
  unlocked: false,
  squad: null,
  level: 1,
  tier: 1,
  bondRank: 1,
  bondProgress: 0,
  manualPowerM: '',
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
    strike: 4,
    roar: 4,
    brutal: 4,
    instinct: 4,
    command: 4,
  },
});

export const calculateOverlordResources = (ov = {}) => {
  const maxTrain = 600;
  const maxSkill = 40;
  const maxLevel = 60;

  const tr = ov.training || { atk: 1, def: 1, hp: 1 };
  const atkRem = Math.max(0, maxTrain - (tr.atk || 1));
  const defRem = Math.max(0, maxTrain - (tr.def || 1));
  const hpRem = Math.max(0, maxTrain - (tr.hp || 1));
  const totalTrainLevels = atkRem + defRem + hpRem;

  const sk = ov.skills || {};
  let totalSkillLevels = 0;
  OVERLORD_SKILLS.forEach((s) => {
    totalSkillLevels += Math.max(0, maxSkill - (sk[s.key] || 1));
  });

  const lvlRem = Math.max(0, maxLevel - (ov.level ?? 1));

  return {
    guidebooks: totalTrainLevels * 145,
    certificates: Math.floor(totalTrainLevels / 5) * 18,
    skillBadges: totalSkillLevels * 120,
    totalShards: lvlRem * 28,
  };
};
