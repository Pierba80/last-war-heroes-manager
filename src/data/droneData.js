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

export const getDroneModelInfo = (level) => {
  const lvl = Math.max(1, Number(level) || 1);
  let currentIndex = 0;
  for (let i = 0; i < DRONE_MODELS.length; i++) {
    if (lvl >= DRONE_MODELS[i].minLevel) {
      currentIndex = i;
    }
  }
  const current = DRONE_MODELS[currentIndex];
  const next = DRONE_MODELS[currentIndex + 1] || null;
  return { current, next };
};

export const getDroneAbilityStars = (level) => {
  const lvl = Math.max(1, Number(level) || 1);
  return Math.min(6, Math.floor(lvl / 50) + 1);
};

export const DRONE_COMPONENTS_LIST = [
  { key: 'radar', label: 'Radar Tattico' },
  { key: 'targeting', label: 'Mirino Ottico' },
  { key: 'turbine', label: 'Turbina Reattore' },
  { key: 'core', label: 'Nucleo Energetico' },
  { key: 'armor', label: 'Corazza Reattiva' },
  { key: 'missile', label: 'Testata Missilistica' },
];

export const COMBAT_BOOST_STAGES = [
  { stage: 'I', minLvl: 1, maxLvl: 149, color: '#94a3b8', presets: 1, chipBoost: 0 },
  { stage: 'II', minLvl: 150, maxLvl: 299, color: '#4ade80', presets: 2, chipBoost: 1 },
  { stage: 'III', minLvl: 300, maxLvl: 449, color: '#38bdf8', presets: 3, chipBoost: 2 },
  { stage: 'IV', minLvl: 450, maxLvl: 599, color: '#c084fc', presets: 4, chipBoost: 3 },
  { stage: 'V', minLvl: 600, maxLvl: 749, color: '#facc15', presets: 4, chipBoost: 4 },
  { stage: 'VI', minLvl: 750, maxLvl: 899, color: '#fb923c', presets: 4, chipBoost: 5 },
  { stage: 'VII', minLvl: 900, maxLvl: 999, color: '#ef4444', presets: 4, chipBoost: 5 },
];

export const getCombatBoostInfo = (combatBoostLvl) => {
  const lvl = Math.max(1, Number(combatBoostLvl) || 1);
  const current =
    COMBAT_BOOST_STAGES.find((s) => lvl >= s.minLvl && lvl <= s.maxLvl) ||
    COMBAT_BOOST_STAGES;
  const idx = COMBAT_BOOST_STAGES.indexOf(current);
  const next = COMBAT_BOOST_STAGES[idx + 1] || null;
  return { ...current, current, next };
};

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

export const DRONE_PARTS_MILESTONES_151_250 = [
  { level: 151, parts: 2350, battleData: 1950000 },
  { level: 160, parts: 2800, battleData: 2400000 },
  { level: 170, parts: 3400, battleData: 3000000 },
  { level: 180, parts: 4100, battleData: 3700000 },
  { level: 190, parts: 4900, battleData: 4500000 },
  { level: 200, parts: 5800, battleData: 5500000 },
  { level: 210, parts: 6800, battleData: 6600000 },
  { level: 220, parts: 7900, battleData: 7800000 },
  { level: 230, parts: 9100, battleData: 9200000 },
  { level: 240, parts: 10400, battleData: 10800000 },
  { level: 250, parts: 12000, battleData: 12500000 },
];

export const ALL_DRONE_MILESTONES = [
  ...DRONE_PARTS_MILESTONES_PRE150,
  ...DRONE_PARTS_MILESTONES_151_250,
];

export const getDronePartsForLevel = (level) => {
  const lvl = Math.max(1, Number(level) || 1);
  if (lvl <= 250) {
    const milestone = [...ALL_DRONE_MILESTONES]
      .reverse()
      .find((m) => lvl >= m.level);
    return milestone ? milestone.parts : 5;
  }
  return 12000 + (lvl - 250) * 500;
};

export const getDroneDataForLevel = (level) => {
  const lvl = Math.max(1, Number(level) || 1);
  if (lvl <= 250) {
    const milestone = [...ALL_DRONE_MILESTONES]
      .reverse()
      .find((m) => lvl >= m.level);
    return milestone ? milestone.battleData : 1000;
  }
  return 12500000 + (lvl - 250) * 500000;
};

export const calculateDronePower = (droneInput = {}) => {
  if (typeof droneInput === 'number') {
    return droneInput * 12500;
  }

  const d = droneInput || {};
  if (d.manualPowerM !== undefined && d.manualPowerM !== null && d.manualPowerM !== '') {
    const manual = Number(d.manualPowerM);
    if (!Number.isNaN(manual) && manual > 0) {
      return Math.round(manual * 1000000);
    }
  }

  const lvl = Math.max(1, Number(d.level) || 1);
  const critStage = Math.max(1, Number(d.critStage) || 1);
  const basePower = lvl * 12500 + (critStage - 1) * 25000;

  const componentsPower = Object.values(d.components || {}).reduce((total, comp) => {
    const compLvl = typeof comp === 'object' ? Number(comp?.level) || 1 : Number(comp) || 1;
    const compPct = typeof comp === 'object' ? Number(comp?.pct) || 0 : 0;
    return total + compLvl * 45000 + compPct * 450;
  }, 0);

  const boostLvl = Number(d.combatBoostLevel) || 1;
  const boostPower = boostLvl * 8000;

  const chipSetsPower = Object.values(d.chipSets || {}).reduce((sum, set) => {
    if (!set || typeof set !== 'object') return sum;
    const stars =
      (Number(set.top) || 0) +
      (Number(set.center) || 0) +
      (Number(set.left) || 0) +
      (Number(set.right) || 0);
    return sum + stars * 15000;
  }, 0);

  return basePower + componentsPower + boostPower + chipSetsPower;
};

const sumResourcesRange = (fromLvl, toLvl) => {
  let parts = 0;
  let data = 0;
  for (let lvl = fromLvl; lvl < toLvl; lvl++) {
    parts += getDronePartsForLevel(lvl);
    data += getDroneDataForLevel(lvl);
  }
  return { parts, data };
};

export const calculateDroneResources = (droneInput = {}) => {
  const currentLvl =
    typeof droneInput === 'object'
      ? Math.max(1, Number(droneInput?.level) || 1)
      : Math.max(1, Number(droneInput) || 1);

  const { next: nextModel } = getDroneModelInfo(currentLvl);
  const nextTarget = nextModel ? nextModel.minLevel : 250;

  const toNext = currentLvl < nextTarget
    ? sumResourcesRange(currentLvl, nextTarget)
    : { parts: 0, data: 0 };

  const to250 = currentLvl < 250
    ? sumResourcesRange(currentLvl, 250)
    : { parts: 0, data: 0 };

  return {
    nextModel,
    dataToNext: toNext.data,
    partsToNext: toNext.parts,
    dataTo250: to250.data,
    partsTo250: to250.parts,
  };
};

export const createDefaultDrone = () => ({
  level: 1,
  critStage: 1,
  combatBoostLevel: 1,
  manualPowerM: '',
  stageAvatars: {},
  components: {
    radar: { level: 1, pct: 0 },
    targeting: { level: 1, pct: 0 },
    turbine: { level: 1, pct: 0 },
    core: { level: 1, pct: 0 },
    armor: { level: 1, pct: 0 },
    missile: { level: 1, pct: 0 },
  },
  chipSets: {
    1: { squad: 1, top: 0, center: 0, left: 0, right: 0 },
    2: { squad: 2, top: 0, center: 0, left: 0, right: 0 },
    3: { squad: 3, top: 0, center: 0, left: 0, right: 0 },
    4: { squad: 4, top: 0, center: 0, left: 0, right: 0 },
  },
});

export const INITIAL_DRONE_CONFIG = createDefaultDrone();
    
