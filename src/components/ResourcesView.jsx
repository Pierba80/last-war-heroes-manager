import React, { useState } from 'react';
import { Sparkles, FileText, Flame, Layers, Shield, Plane, Rocket, Sword, Award } from 'lucide-react';
import { INITIAL_HEROES, calculateShardsNeeded, getMaxSkillLevel } from '../data/heroesData';
import { getMaxAwakeningSkillLevel } from './HeroSkillsSection';
import HeroAvatar from './HeroAvatar';
import { styles } from '../styles';

const BLUEPRINT_COSTS_PER_STAR = {
  1: 5,
  2: 10,
  3: 15,
  4: 20,
};

const GEAR_KEYS = ['railgun', 'chip', 'armor', 'radar'];

const WEAPON_SHARD_COSTS = [
  0,
  50, 10, 10, 15, 15, 20, 20, 25, 25, 40,
  30, 30, 35, 35, 40, 40, 45, 45, 50, 80,
  60, 60, 70, 70, 80, 80, 90, 90, 100, 150,
];

const SKILL_MEDAL_COSTS = [
  0, 0,
  100, 150, 200, 250, 350, 450, 600, 800, 1000,
  1300, 1600, 2000, 2500, 3000, 3600, 4300, 5100, 6000, 7000,
  8200, 9500, 11000, 12600, 14400, 16400, 18600, 21000, 23600, 26500,
  30000, 34000, 38500, 43500, 49000, 55000, 61500, 68500, 76000, 85000,
];

const calculateWeaponShardsNeeded = (hasWeapon, currentLevel = 0) => {
  if (!hasWeapon || currentLevel >= 30) return 0;
  let total = 0;
  for (let lvl = Math.max(0, currentLevel) + 1; lvl <= 30; lvl++) {
    total += WEAPON_SHARD_COSTS.at(lvl) || 0;
  }
  return total;
};

const calculateSkillMedalsNeeded = (hero, p) => {
  const ewLevel = p.exclusiveWeaponLevel || 0;
  const maxBaseSkill = getMaxSkillLevel(ewLevel);
  const currentSkills = Array.isArray(p.skills) && p.skills.length === 3 ? p.skills : Array(3).fill(1);

  let medals = 0;

  currentSkills.forEach((lvl) => {
    const start = Math.max(1, lvl);
    for (let nextLvl = start + 1; nextLvl <= maxBaseSkill; nextLvl++) {
      medals += SKILL_MEDAL_COSTS.at(nextLvl) || 0;
    }
  });

  const awakenStars = p.awakeningStars || 0;
  if (hero.hasExclusiveWeapon && awakenStars > 0) {
    const maxAwakenLvl = getMaxAwakeningSkillLevel(awakenStars);
    const startAwaken = Math.max(1, p.awakeningSkill || 1);
    for (let nextLvl = startAwaken + 1; nextLvl <= maxAwakenLvl; nextLvl++) {
      medals += SKILL_MEDAL_COSTS.at(nextLvl) || 0;
    }
  }

  return medals;
};

const calculateGearNeeds = (gearObj = {}) => {
  let goldBlueprints = 0;
  let mythicBlueprints = 0;
  let ceramic = 0;

  GEAR_KEYS.forEach((key) => {
    const slot = gearObj[key] || { rarity: 'None', level: 0, stars: 0 };

    if (slot.rarity === 'Mythic') {
      return;
    }

    if (slot.rarity === 'None' || slot.rarity === 'SSR') {
      ceramic += 750;
      goldBlueprints += 50;
      mythicBlueprints += 10;
      return;
    }

    if (slot.rarity === 'UR') {
      const currentStars = slot.level >= 40 ? Math.min(4, slot.stars || 0) : 0;
      for (let s = currentStars + 1; s <= 4; s++) {
        goldBlueprints += BLUEPRINT_COSTS_PER_STAR[s];
      }
      mythicBlueprints += 10;
    }
  });

  return { goldBlueprints, mythicBlueprints, ceramic };
};

const getSummaryCardStyle = (borderColor) => {
  return {
    backgroundColor: '#1e293b',
    border: `1px solid ${borderColor}`,
    borderRadius: '10px',
    padding: '10px 12px',
  };
};
export default function ResourcesView({ progress, squads }) {
  const [scope, setScope] = useState('1');

  const getTargetHeroIds = () => {
    const ids = new Set();
    const squadList = scope === 'all' ? Array.from({ length: 3 }, (_, i) => i + 1) : [Number(scope)];

    squadList.forEach((sqNum) => {
      const slots = squads[sqNum] || {};
      Object.values(slots).forEach((heroId) => {
        if (heroId) ids.add(heroId);
      });
    });

    return Array.from(ids);
  };

  const targetIds = getTargetHeroIds();
  const targetHeroes = targetIds
    .map((id) => INITIAL_HEROES.find((h) => h.id === id))
    .filter(Boolean);

  let totalUrShards = 0;
  let totalSsrShards = 0;
  let totalWeaponShards = 0;
  let totalSkillMedals = 0;
  let totalGoldBp = 0;
  let totalMythicBp = 0;
  let totalCeramic = 0;

  const heroBreakdown = targetHeroes.map((hero) => {
    const p = progress[hero.id] || {};
    const shardInfo = calculateShardsNeeded(p.stars || 0, p.tiers || 0, p.isPromotedUR);
    const weaponShards = calculateWeaponShardsNeeded(hero.hasExclusiveWeapon, p.exclusiveWeaponLevel || 0);
    const skillMedals = calculateSkillMedalsNeeded(hero, p);
    const gearInfo = calculateGearNeeds(p.gear);

    const isUrShardType = hero.rarity === 'UR' || p.isPromotedUR;
    if (isUrShardType) {
      totalUrShards += shardInfo.maxStars;
    } else if (hero.rarity === 'SSR') {
      totalSsrShards += shardInfo.maxStars;
    }

    totalWeaponShards += weaponShards;
    totalSkillMedals += skillMedals;
    totalGoldBp += gearInfo.goldBlueprints;
    totalMythicBp += gearInfo.mythicBlueprints;
    totalCeramic += gearInfo.ceramic;

    return {
      hero,
      progress: p,
      shardsNeeded: shardInfo.maxStars,
      isUrShardType,
      weaponShards,
      skillMedals,
      gearInfo,
    };
  });

  const getTypeIcon = (type) => {
    if (type === 'Tank') return <Shield size={13} color="#4ade80" />;
    if (type === 'Aircraft') return <Plane size={13} color="#38bdf8" />;
    return <Rocket size={13} color="#f87171" />;
  };

  const getRarityBorder = (hero, p) => {
    const effectiveRarity = p.isPromotedUR ? 'UR' : hero.rarity;
    if (effectiveRarity === 'UR') return '#eab308';
    if (effectiveRarity === 'SSR') return '#a855f7';
    return '#3b82f6';
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {[
          { label: 'Squad 1', val: '1' },
          { label: 'Squad 2', val: '2' },
          { label: 'Squad 3', val: '3' },
          { label: 'All Squads', val: 'all' },
        ].map((item) => (
          <button
            key={item.val}
            onClick={() => setScope(item.val)}
            style={{ ...styles.filterBtn(scope === item.val), flex: 1, textAlign: 'center' }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {targetHeroes.length === 0 ? (
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
          No heroes assigned to this squad yet. Go to the <strong>Squads</strong> tab to build your formation!
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            <div style={getSummaryCardStyle('#eab308')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#facc15', fontSize: '12px', fontWeight: 'bold' }}>
                <Sparkles size={15} /> UR Shards
              </div>
              <div style={{ fontSize: '19px', fontWeight: 'bold', marginTop: '4px' }}>
                {totalUrShards.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Heroes to 5★ max</div>
            </div>

            <div style={getSummaryCardStyle('#a855f7')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d8b4fe', fontSize: '12px', fontWeight: 'bold' }}>
                <Sparkles size={15} /> SSR Shards
              </div>
              <div style={{ fontSize: '19px', fontWeight: 'bold', marginTop: '4px' }}>
                {totalSsrShards.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Purple heroes to 5★</div>
            </div>

            <div style={getSummaryCardStyle('#f97316')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fdba74', fontSize: '12px', fontWeight: 'bold' }}>
                <Sword size={15} /> Weapon Shards
              </div>
              <div style={{ fontSize: '19px', fontWeight: 'bold', marginTop: '4px' }}>
                {totalWeaponShards.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Exclusive Wpn to Lv.30</div>
            </div>

            <div style={getSummaryCardStyle('#38bdf8')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7dd3fc', fontSize: '12px', fontWeight: 'bold' }}>
                <Award size={15} /> Skill Medals
              </div>
              <div style={{ fontSize: '19px', fontWeight: 'bold', marginTop: '4px' }}>
                {totalSkillMedals.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Skills to unlocked cap</div>
            </div>

            <div style={getSummaryCardStyle('#f59e0b')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fcd34d', fontSize: '12px', fontWeight: 'bold' }}>
                <FileText size={15} /> Gold Blueprints
              </div>
              <div style={{ fontSize: '19px', fontWeight: 'bold', marginTop: '4px' }}>
                {totalGoldBp.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Gear 1★ to 4★ (50/pc)</div>
            </div>

            <div style={getSummaryCardStyle('#ef4444')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fca5a5', fontSize: '12px', fontWeight: 'bold' }}>
                <Flame size={15} /> Mythic Blueprints
              </div>
              <div style={{ fontSize: '19px', fontWeight: 'bold', marginTop: '4px' }}>
                {totalMythicBp.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Gear 5★ Red (10/pc)</div>
            </div>
          </div>
                {totalCeramic > 0 && (
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} color="#38bdf8" /> Dielectric Ceramic (missing UR gear):
              </span>
              <strong style={{ fontSize: '14px', color: '#38bdf8' }}>{totalCeramic.toLocaleString()}</strong>
            </div>
          )}

          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px' }}>
            Breakdown by Hero ({heroBreakdown.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {heroBreakdown.map(({ hero, progress: p, shardsNeeded, isUrShardType, weaponShards, skillMedals, gearInfo }) => (
              <div
                key={hero.id}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  borderLeft: `4px solid ${getRarityBorder(hero, p)}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <HeroAvatar
                    hero={hero}
                    avatar={p.avatar}
                    borderColor={getRarityBorder(hero, p)}
                    size={38}
                    editable={false}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {getTypeIcon(hero.type)}
                      <strong style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {hero.name}
                      </strong>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {p.stars || 0}★ • Wpn Lv.{p.exclusiveWeaponLevel || 0}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '10px', lineHeight: '1.45' }}>
                  <div>
                    Hero:{' '}
                    <strong style={{ color: shardsNeeded === 0 ? '#4ade80' : isUrShardType ? '#facc15' : '#d8b4fe' }}>
                      {shardsNeeded === 0 ? 'MAX' : shardsNeeded}
                    </strong>
                    {hero.hasExclusiveWeapon && (
                      <span>
                        {' '}• Wpn:{' '}
                        <strong style={{ color: weaponShards === 0 ? '#4ade80' : '#fb923c' }}>
                          {weaponShards === 0 ? 'MAX' : weaponShards}
                        </strong>
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#7dd3fc' }}>
                    Medals: <strong>{skillMedals === 0 ? 'MAX' : skillMedals.toLocaleString()}</strong>
                  </div>
                  <div style={{ color: '#cbd5e1' }}>
                    BP: <strong style={{ color: '#fcd34d' }}>{gearInfo.goldBlueprints}</strong> Gold •{' '}
                    <strong style={{ color: '#fca5a5' }}>{gearInfo.mythicBlueprints}</strong> Red
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
