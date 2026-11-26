export const DRONE_MODELS = [
  {
    stage: 1,
    minLevel: 1,
    code: 'TD-1',
    name: 'Pathfinder',
    bonus: 'Supporto in combattimento agli eroi',
    color: '#94a3b8',
    defaultImg: '/drone/td1.png',
  },
  {
    stage: 2,
    minLevel: 50,
    code: 'TD-2',
    name: 'Blaster',
    bonus: 'Attacco drone +5.000',
    color: '#4ade80',
    defaultImg: '/drone/td2.png',
  },
  {
    stage: 3,
    minLevel: 100,
    code: 'TD-3',
    name: "Cavaliere d'Argento",
    bonus: 'Attacco di tutti gli eroi +5%',
    color: '#38bdf8',
    defaultImg: '/drone/td3.png',
  },
  {
    stage: 4,
    minLevel: 150,
    code: 'TD-4',
    name: 'Fantasma',
    bonus: 'Danni di tutte le abilità degli eroi +2%',
    color: '#c084fc',
    defaultImg: '/drone/td4.png',
  },
  {
    stage: 5,
    minLevel: 200,
    code: 'TD-5',
    name: 'Distruttore',
    bonus: 'Danni subiti da tutti gli eroi -5%',
    color: '#facc15',
    defaultImg: '/drone/td5.png',
  },
  {
    stage: 6,
    minLevel: 250,
    code: 'TD-6',
    name: 'Colosso',
    bonus: '+5% tasso vittime unità nemiche in PvP',
    color: '#ef4444',
    defaultImg: '/drone/td6.png',
  },
];

export const DRONE_COMPONENTS_LIST = [
  { key: 'radar', label: 'Radar Tattico' },
  { key: 'targeting', label: 'Mirino Ottico' },
  { key: 'turbine', label: 'Turbina Reattore' },
  { key: 'core', label: 'Nucleo Energetico' },
  { key: 'armor', label: 'Corazza Reattiva' },
  { key: 'missile', label: 'Testata Missilistica' },
];

export const COMBAT_BOOST_STAGES = [
  { stage: 'I', minLvl: 10, maxLvl: 149, color: '#94a3b8', presets: 1, chipBoost: 0 },
  { stage: 'II', minLvl: 150, maxLvl: 299, color: '#4ade80', presets: 2, chipBoost: 1 },
  { stage: 'III', minLvl: 300, maxLvl: 449, color: '#38bdf8', presets: 3, chipBoost: 2 },
  { stage: 'IV', minLvl: 450, maxLvl: 599, color: '#c084fc', presets: 4, chipBoost: 3 },
  { stage: 'V', minLvl: 600, maxLvl: 749, color: '#facc15', presets: 4, chipBoost: 4 },
  { stage: 'VI', minLvl: 750, maxLvl: 899, color: '#fb923c', presets: 4, chipBoost: 5 },
  { stage: 'VII', minLvl: 900, maxLvl: 999, color: '#ef4444', presets: 4, chipBoost: 5 },
];

export const getDroneModelInfo = (level = 1) => {
  let current = DRONE_MODELS.at(0);
  let next = null;
  for (let i = 0; i < DRONE_MODELS.length; i++) {
    if (level >= DRONE_MODELS.at(i).minLevel) {
      current = DRONE_MODELS.at(i);
      next = DRONE_MODELS.at(i + 1) || null;
    }
  }
  return { current, next };
};

export const getDroneAbilityStars = (level = 1) => {
  if (level >= 110) return 6;
  if (level >= 90) return 5;
  if (level >= 70) return 4;
  if (level >= 50) return 3;
  if (level >= 30) return 2;
  return 1;
};

export const getCombatBoostInfo = (boostLevel = 1) => {
  if (boostLevel < 10) {
    return { stage: '0', minLvl: 1, nextLvl: 10, color: '#64748b', presets: 0, chipBoost: 0 };
  }
  let current = COMBAT_BOOST_STAGES.at(0);
  let nextLvl = 150;
  for (let i = 0; i < COMBAT_BOOST_STAGES.length; i++) {
    const item = COMBAT_BOOST_STAGES.at(i);
    if (boostLevel >= item.minLvl) {
      current = item;
      nextLvl = COMBAT_BOOST_STAGES.at(i + 1)?.minLvl || 900;
    }
  }
  return { ...current, nextLvl };
};
    export const createDefaultDrone = () => ({
  level: 208,
  critStage: 1,
  stageAvatars: {},
  components: {
    radar: { level: 10, pct: 15 },
    targeting: { level: 9, pct: 45 },
    turbine: { level: 10, pct: 14 },
    core: { level: 9, pct: 49 },
    armor: { level: 10, pct: 14 },
    missile: { level: 9, pct: 48 },
  },
  combatBoostLevel: 600,
  chipSets: {
    1: { squad: 1, top: 5, center: 5, left: 5, right: 5 },
    2: { squad: 2, top: 3, center: 3, left: 3, right: 3 },
    3: { squad: 3, top: 2, center: 2, left: 2, right: 2 },
    4: { squad: 4, top: 1, center: 1, left: 1, right: 1 },
  },
});

export const calculateDronePower = (drone = {}) => {
  const lvl = Math.max(1, drone.level || 1);
  const crit = Math.max(1, drone.critStage || 1);
  const basePower = 430_000 + lvl * 10_200 + crit * 42_000;

  const comps = drone.components || {};
  let compPower = 0;
  DRONE_COMPONENTS_LIST.forEach((c) => {
    const item = comps[c.key] || { level: 1, pct: 0 };
    compPower += (item.level || 1) * 207_000 + ((item.pct || 0) / 100) * 207_000;
  });

  const boostLvl = Math.max(1, drone.combatBoostLevel || 1);
  const boostPower = boostLvl * 1_460;

  const sets = drone.chipSets || {};
  let chipStarsSum = 0;
  Array.from({ length: 4 }, (_, i) => i + 1).forEach((setNum) => {
    const s = sets[setNum] || { top: 0, center: 0, left: 0, right: 0 };
    chipStarsSum += (s.top || 0) + (s.center || 0) + (s.left || 0) + (s.right || 0);
  });
  const chipPower = chipStarsSum * 38_000;

  const rawDronePower = basePower + compPower + boostPower + chipPower;
  return Math.round(rawDronePower * 0.89);
};

export const calculateDroneResources = (drone = {}) => {
  const currentLvl = Math.min(250, Math.max(1, drone.level || 1));
  const { next } = getDroneModelInfo(currentLvl);

  let dataToNext = 0;
  let partsToNext = 0;
  if (next) {
    for (let l = currentLvl + 1; l <= next.minLevel; l++) {
      dataToNext += Math.round(50_000 + l * 1_550);
      partsToNext += l % 5 === 0 ? 200 : 0;
    }
  }

  let dataTo250 = 0;
  let partsTo250 = 0;
  for (let l = currentLvl + 1; l <= 250; l++) {
    dataTo250 += Math.round(50_000 + l * 1_550);
    partsTo250 += l % 5 === 0 ? 200 : 0;
  }

  return {
    nextModel: next,
    dataToNext,
    partsToNext,
    dataTo250,
    partsTo250,
  };
};
