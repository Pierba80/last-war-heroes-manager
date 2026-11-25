export const OVERLORD_SKILLS = [
  { key: 'strike', name: "Overlord's Strike", unlockLevel: 1, sub: 'Active Damage' },
  { key: 'roar', name: 'Furious Roar', unlockLevel: 10, sub: 'Squad ATK Boost' },
  { key: 'armor', name: 'Iron Hide', unlockLevel: 20, sub: 'Squad HP / DEF' },
  { key: 'instinct', name: 'Primal Instinct', unlockLevel: 30, sub: 'Damage Reduction' },
];

export const OVERLORD_STATS = [
  { key: 'atk', label: 'ATK Training', color: '#f87171' },
  { key: 'hp', label: 'HP Training', color: '#4ade80' },
  { key: 'def', label: 'DEF Training', color: '#38bdf8' },
];

export const createDefaultOverlord = () => ({
  unlocked: false,
  avatar: null,
  level: 1,       // Main Overlord Level (1 - 60)
  subLevel: 0,    // Sub-level / Tier progress (0 - 5)
  training: {
    atk: 1,
    hp: 1,
    def: 1,
  },
  skills: {
    strike: 1,
    roar: 1,
    armor: 1,
    instinct: 1,
  },
  squad: null,    // 1 | 2 | 3 | 4 | null
});

export const calculateOverlordResources = (ov) => {
  const currentLvl = Math.min(60, Math.max(1, ov.level || 1));
  const currentSub = Math.min(5, Math.max(0, ov.subLevel || 0));

  // Total sub-steps from Lv.1 (sub 0) to Lv.60 (max) = 59 * 5 = 295 steps
  const completedSteps = (currentLvl - 1) * 5 + currentSub;
  const remainingSteps = Math.max(0, 295 - completedSteps);

  // Overlord Shards (100 to unlock + shards per level step) & Promotion Certificates
  const unlockShards = ov.unlocked ? 0 : 100;
  const levelShards = remainingSteps * 5;
  const totalShards = unlockShards + levelShards;

  // Training Guidebooks & Promotion Certificates (Max Lv. 200 per stat)
  const tr = ov.training || { atk: 1, hp: 1, def: 1 };
  const statKeys = ['atk', 'hp', 'def'];
  let guidebooks = 0;
  let certificates = 0;

  // Certificates from main Overlord level tiers (every 10 levels)
  for (let lvl = currentLvl + 1; lvl <= 60; lvl++) {
    if (lvl % 10 === 0) {
      certificates += (lvl / 10) * 50;
    }
  }

  // Guidebooks & Certificates from ATK / HP / DEF Training
  statKeys.forEach((k) => {
    const statLvl = Math.min(200, Math.max(1, tr[k] || 1));
    for (let lvl = statLvl + 1; lvl <= 200; lvl++) {
      guidebooks += Math.round(15 + lvl * 2.5);
      if (lvl % 20 === 0) {
        certificates += (lvl / 20) * 15;
      }
    }
  });

  // 4 Skills (Max Lv. 40 each) -> Overlord Skill Badges
  const sk = ov.skills || { strike: 1, roar: 1, armor: 1, instinct: 1 };
  let skillBadges = 0;
  OVERLORD_SKILLS.forEach((s) => {
    const val = Math.min(40, Math.max(1, sk[s.key] || 1));
    for (let lvl = val + 1; lvl <= 40; lvl++) {
      skillBadges += Math.round(20 + Math.pow(lvl, 1.85) * 3);
    }
  });

  return {
    totalShards,
    guidebooks,
    certificates,
    skillBadges,
  };
};
      
