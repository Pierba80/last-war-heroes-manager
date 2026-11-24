export const SHARD_COSTS_PER_STAR = {
  1: { perTier: 5, totalStar: 25 },
  2: { perTier: 10, totalStar: 50 },
  3: { perTier: 20, totalStar: 100 },
  4: { perTier: 60, totalStar: 300 },
  5: { perTier: 100, totalStar: 500 },
};

export const INITIAL_HEROES = [
  // UR
  { id: "kimberly", name: "Kimberly", rarity: "UR", type: "Tank", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "murphy", name: "Murphy", rarity: "UR", type: "Tank", role: "Defense", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "williams", name: "Williams", rarity: "UR", type: "Tank", role: "Defense", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "marshall", name: "Marshall", rarity: "UR", type: "Tank", role: "Support", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "stetmann", name: "Stetmann", rarity: "UR", type: "Tank", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: true },

  { id: "dva", name: "DVA", rarity: "UR", type: "Aircraft", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "carlie", name: "Carlie", rarity: "UR", type: "Aircraft", role: "Defense", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "schuyler", name: "Schuyler", rarity: "UR", type: "Aircraft", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "lucius", name: "Lucius", rarity: "UR", type: "Aircraft", role: "Defense", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "morrison", name: "Morrison", rarity: "UR", type: "Aircraft", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: true },

  { id: "tesla", name: "Tesla", rarity: "UR", type: "Missile", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "swift", name: "Swift", rarity: "UR", type: "Missile", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "mcgregor", name: "McGregor", rarity: "UR", type: "Missile", role: "Defense", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "adam", name: "Adam", rarity: "UR", type: "Missile", role: "Defense", canPromoteUR: false, hasExclusiveWeapon: true },
  { id: "fiona", name: "Fiona", rarity: "UR", type: "Missile", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: true },

  // SSR
  { id: "mason", name: "Mason", rarity: "SSR", type: "Tank", role: "Attack", canPromoteUR: true, promotionSeason: 1, hasExclusiveWeapon: false },
  { id: "violet", name: "Violet", rarity: "SSR", type: "Tank", role: "Defense", canPromoteUR: true, promotionSeason: 2, hasExclusiveWeapon: false },
  { id: "scarlett", name: "Scarlett", rarity: "SSR", type: "Tank", role: "Defense", canPromoteUR: true, promotionSeason: 3, hasExclusiveWeapon: false },
  { id: "monica", name: "Monica", rarity: "SSR", type: "Tank", role: "Support", canPromoteUR: false, hasExclusiveWeapon: false },
  { id: "richard", name: "Richard", rarity: "SSR", type: "Tank", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: false },
  { id: "farhad", name: "Farhad", rarity: "SSR", type: "Tank", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: false },

  { id: "sarah", name: "Sarah", rarity: "SSR", type: "Aircraft", role: "Support", canPromoteUR: true, promotionSeason: 4, hasExclusiveWeapon: false },
  { id: "cage", name: "Cage", rarity: "SSR", type: "Aircraft", role: "Defense", canPromoteUR: false, hasExclusiveWeapon: false },
  { id: "maxwell", name: "Maxwell", rarity: "SSR", type: "Aircraft", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: false },

  { id: "venom", name: "Venom", rarity: "SSR", type: "Missile", role: "Attack", canPromoteUR: true, promotionSeason: 5, hasExclusiveWeapon: false },
  { id: "braz", name: "Braz", rarity: "SSR", type: "Missile", role: "Attack", canPromoteUR: true, promotionSeason: 6, hasExclusiveWeapon: false },
  { id: "elsa", name: "Elsa", rarity: "SSR", type: "Missile", role: "Defense", canPromoteUR: false, hasExclusiveWeapon: false },

  // SR
  { id: "loki", name: "Loki", rarity: "SR", type: "Tank", role: "Defense", canPromoteUR: false, hasExclusiveWeapon: false },
  { id: "gump", name: "Gump", rarity: "SR", type: "Tank", role: "Defense", canPromoteUR: false, hasExclusiveWeapon: false },
  { id: "ambolt", name: "Ambolt", rarity: "SR", type: "Aircraft", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: false },
  { id: "kane", name: "Kane", rarity: "SR", type: "Missile", role: "Attack", canPromoteUR: false, hasExclusiveWeapon: false },
];

export const createDefaultProgress = () => {
  const progress = {};
  INITIAL_HEROES.forEach((hero) => {
    progress[hero.id] = {
      unlocked: hero.rarity !== "UR",
      isPromotedUR: false,
      level: 1,
      stars: 0,
      tiers: 0,
      skills: Array(3).fill(1),
      exclusiveWeaponLevel: 0,
      squad: null,
    };
  });
  return progress;
};

export const calculateShardsNeeded = (stars, tiers, isPromotedUR) => {
  if (stars >= 5) return { nextStar: 0, maxStars: 0 };
  const multiplier = isPromotedUR ? 2 : 1;

  const currentStarCost = SHARD_COSTS_PER_STAR[stars + 1];
  const nextStar = (5 - tiers) * currentStarCost.perTier * multiplier;

  let maxStars = nextStar;
  for (let s = stars + 2; s <= 5; s++) {
    maxStars += SHARD_COSTS_PER_STAR[s].totalStar * multiplier;
  }
  return { nextStar, maxStars };
};
   
