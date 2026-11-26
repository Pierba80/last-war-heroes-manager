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

export const SUB_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export const BOND_TIERS = [
  { rank: 1, roman: 'I', label: 'Novizio', color: '#94a3b8', maxTrain: 100 },
  { rank: 2, roman: 'II', label: 'Apprendista', color: '#4ade80', maxTrain: 140 },
  { rank: 3, roman: 'III', label: 'Alleato', color: '#10b981', maxTrain: 180 },
  { rank: 4, roman: 'IV', label: 'Compagno', color: '#38bdf8', maxTrain: 220 },
  { rank: 5, roman: 'V', label: 'Partner Vincolato', color: '#3b82f6', maxTrain: 260 },
  { rank: 6, roman: 'VI', label: 'Fedele', color: '#818cf8', maxTrain: 300 },
  { rank: 7, roman: 'VII', label: 'Protettore', color: '#c084fc', maxTrain: 340 },
  { rank: 8, roman: 'VIII', label: 'Guardiano', color: '#e879f9', maxTrain: 380 },
  { rank: 9, roman: 'IX', label: 'Campione', color: '#facc15', maxTrain: 420 },
  { rank: 10, roman: 'X', label: 'Eroe', color: '#fb923c', maxTrain: 460 },
  { rank: 11, roman: 'XI', label: 'Leggenda', color: '#f87171', maxTrain: 480 },
  { rank: 12, roman: 'XII', label: 'Supremo', color: '#ef4444', maxTrain: 500 },
];

export const getBondInfo = (bondRank = 1) => {
  const idx = Math.min(11, Math.max(0, (bondRank || 1) - 1));
  return BOND_TIERS.at(idx);
};

export const getMaxOverlordSkillLevel = (stars = 4) => {
  if (stars <= 1) return 15;
  if (stars === 2) return 20;
  if (stars === 3) return 25;
  if (stars === 4) return 30;
  if (stars === 5) return 35;
  return 40;
};
   export const createDefaultOverlord = () => ({
  unlocked: true,
  avatar: null,
  tier: 6,
  level: 56,
  bondRank: 5,
  bondProgress: 8,
  training: {
    atk: 309,
    def: 324,
    hp: 339,
  },
  skills: {
    strike: 34,
    roar: 33,
    brutal: 30,
    instinct: 30,
    command: 30,
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
  const currentLvl = Math.min(60, Math.max(0, ov.level ?? 1));
  const remainingLevels = Math.max(0, 60 - currentLvl);

  const unlockShards = ov.unlocked ? 0 : 100;
  const totalShards = unlockShards + remainingLevels * 200;

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
  
