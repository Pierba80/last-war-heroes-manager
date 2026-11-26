export const formatPower = (num) => {
  if (!num || num <= 0) return '0';
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

export const calculateHeroPower = (hero, p = {}) => {
  if (!p.unlocked && (p.level || 1) <= 1 && (p.stars || 0) === 0) {
    return 0;
  }

  const effectiveRarity = p.isPromotedUR ? 'UR' : hero.rarity;
  const rarityMult = effectiveRarity === 'UR' ? 1.25 : effectiveRarity === 'SSR' ? 1.05 : 0.85;

  const level = Math.max(1, p.level || 1);
  const levelPower = Math.pow(level, 1.85) * 185 * rarityMult;

  const totalTiers = (p.stars || 0) * 5 + (p.tiers || 0);
  const starPower = totalTiers * 42_000 * rarityMult;

  const skills = Array.isArray(p.skills) && p.skills.length === 3 ? p.skills : Array(3).fill(1);
  const skillSum = skills.reduce((acc, lvl) => acc + Math.max(1, lvl || 1), 0);
  const skillsPower = skillSum * 12_500;

  const ewLevel = p.exclusiveWeaponLevel || 0;
  const weaponPower = ewLevel > 0 ? 180_000 + ewLevel * 32_000 : 0;

  const awakenStars = p.awakeningStars || 0;
  const awakenSkill = p.awakeningSkill || 1;
  const awakenPower = awakenStars > 0
    ? awakenStars * 165_000 + awakenSkill * 14_000
    : 0;

  const gear = p.gear || {};
  const gearRarityBase = {
    None: 0,
    SSR: 85_000,
    UR: 260_000,
    Mythic: 720_000,
  };

  let gearPower = 0;
  ['railgun', 'chip', 'armor', 'radar'].forEach((key) => {
    const slot = gear[key] || { rarity: 'None', level: 0, stars: 0 };
    if (slot.rarity === 'None') return;
    const base = gearRarityBase[slot.rarity] || 0;
    const lvlBonus = (slot.level || 0) * (slot.rarity === 'SSR' ? 2_500 : 6_500);
    const starBonus = (slot.stars || 0) * 95_000;
    gearPower += base + lvlBonus + starBonus;
  });

  return Math.round(levelPower + starPower + skillsPower + weaponPower + awakenPower + gearPower);
};

export const calculateOverlordPower = (ov = {}) => {
  if (!ov.unlocked) return 0;

  const level = Math.max(0, ov.level || 0);
  const levelPower = 350_000 + Math.pow(level, 1.65) * 14_500;

  const bondRank = Math.max(1, ov.bondRank || 1);
  const bondSub = Math.max(0, ov.bondProgress || 0);
  const totalBondLevels = (bondRank - 1) * 10 + bondSub;
  const bondPower = totalBondLevels * 28_000;

  const tr = ov.training || { atk: 1, def: 1, hp: 1 };
  const trainSum = (tr.atk || 1) + (tr.def || 1) + (tr.hp || 1);
  const trainPower = trainSum * 4_200;

  const sk = ov.skills || {};
  const st = ov.skillStars || {};
  let skillsPower = 0;
  ['strike', 'roar', 'brutal', 'instinct', 'command'].forEach((k) => {
    const lvl = sk[k] || 1;
    const stars = st[k] ?? 4;
    skillsPower += lvl * 18_000 + stars * 45_000;
  });

  return Math.round(levelPower + bondPower + trainPower + skillsPower);
};
