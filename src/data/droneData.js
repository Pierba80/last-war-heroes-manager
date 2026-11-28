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

export const DRONE_PARTS_MILESTONES_PRE150 = [
  { level: 1, parts: 5, battleData: 1000 },
  { level: 10, parts: 15, battleData: 5000 },
  { level: 20, parts: 30, battleData: 15000 },
  { level: 30, parts: 50, battleData: 30000 },
  { level: 40, parts: 80, battleData: 55000 },
  { level: 50, parts: 120, battleData: 90000 },
  { level: 60, parts: 170, battleData: 140000 },
  { level: 70, parts: 230, battleData: 200000 },
  { level: 80, parts: 300, battleData: 280000 },
  { level: 90, parts: 400, battleData: 380000 },
  { level: 100, parts: 550, battleData: 500000 },
  { level: 110, parts: 750, battleData: 650000 },
  { level: 120, parts: 1000, battleData: 850000 },
  { level: 130, parts: 1300, battleData: 1100000 },
  { level: 140, parts: 1700, battleData: 1400000 },
  { level: 150, parts: 2200, battleData: 1800000 },
];

export const getDronePartsForLevel = (level) => {
  const lvl = Math.max(1, Number(level) || 1);
  if (lvl <= 150) {
    const milestone = [...DRONE_PARTS_MILESTONES_PRE150]
      .reverse()
      .find((m) => lvl >= m.level);
    return milestone ? milestone.parts : 5;
  }
  return 2200 + (lvl - 150) * 150;
};

export const calculateDronePower = (level, components = {}, combatBoostLvl = 10) => {
  const lvl = Number(level) || 1;
  const basePower = lvl * 12500;

  const componentsPower = Object.values(components).reduce((total, compLvl) => {
    return total + (Number(compLvl) || 1) * 45000;
  }, 0);

  const boostStage = COMBAT_BOOST_STAGES.find(
    (s) => combatBoostLvl >= s.minLvl && combatBoostLvl <= s.maxLvl
  );
  const boostPower = boostStage ? (Number(combatBoostLvl) || 0) * 8000 : 0;

  return basePower + componentsPower + boostPower;
};

export const calculateDroneResources = (currentLevel, targetLevel) => {
  const start = Math.max(1, Number(currentLevel) || 1);
  const end = Math.max(start, Number(targetLevel) || start);

  let totalParts = 0;
  let totalBattleData = 0;

  for (let lvl = start; lvl < end; lvl++) {
    totalParts += getDronePartsForLevel(lvl);
    totalBattleData += lvl * 12000;
  }

  return {
    parts: totalParts,
    battleData: totalBattleData,
  };
};

export const INITIAL_DRONE_CONFIG = {
  level: 100,
  targetLevel: 150,
  combatBoostLevel: 150,
  components: {
    radar: 5,
    targeting: 5,
    turbine: 5,
    core: 5,
    armor: 5,
    missile: 5,
  },
};
  
