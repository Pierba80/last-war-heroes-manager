import React from 'react';
import { Sword, Flame, Star, Plus, Minus } from 'lucide-react';
import { getMaxSkillLevel } from '../data/heroesData';
import { styles } from '../styles';

const AWAKEN_STARS = Array.from({ length: 5 }, (_, i) => i + 1);
const AWAKEN_TIERS = Array.from({ length: 5 }, (_, i) => i + 1);

export const getMaxAwakeningSkillLevel = (awakenStars = 0) => {
  if (awakenStars <= 0) return 10;
  if (awakenStars === 1) return 20;
  if (awakenStars === 2) return 25;
  if (awakenStars === 3) return 30;
  if (awakenStars === 4) return 35;
  return 40;
};

export default function HeroSkillsSection({ hero, progress, onUpdate }) {
  const ewLevel = progress.exclusiveWeaponLevel || 0;
  const maxSkillLevel = getMaxSkillLevel(ewLevel);
  const currentSkills = Array.isArray(progress.skills) && progress.skills.length === 3
    ? progress.skills
    : Array(3).fill(1);

  const skillLabels = Array.isArray(hero.skillNames) && hero.skillNames.length === 3
    ? hero.skillNames
    : ['Active Skill', 'Passive Skill 1', 'Passive Skill 2'];

  const awakenStars = progress.awakeningStars || 0;
  const awakenTiers = progress.awakeningTiers || 0;
  const maxAwakenSkill = getMaxAwakeningSkillLevel(awakenStars);
  const currentAwakenSkill = Math.min(maxAwakenSkill, Math.max(1, progress.awakeningSkill || 1));

  const updateSkill = (idx, rawValue) => {
    const parsed = Number(rawValue);
    const safeVal = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(maxSkillLevel, safeVal));
    const updated = [...currentSkills];
    updated[idx] = clamped;
    onUpdate(hero.id, { skills: updated });
  };

  const updateWeaponLevel = (rawValue) => {
    const parsed = Number(rawValue);
    const safeVal = Number.isNaN(parsed) ? 0 : parsed;
    const newEw = Math.max(0, Math.min(30, safeVal));
    const newMax = getMaxSkillLevel(newEw);
    const clampedSkills = currentSkills.map((lvl) => Math.min(newMax, lvl));
    onUpdate(hero.id, {
      exclusiveWeaponLevel: newEw,
      skills: clampedSkills,
    });
  };

  const changeAwakenTier = (delta) => {
    let totalSteps = awakenStars * 5 + awakenTiers + delta;
    if (totalSteps < 0) totalSteps = 0;
    if (totalSteps > 25) totalSteps = 25;
    const nextStars = Math.floor(totalSteps / 5);
    const nextTiers = totalSteps % 5;
    const nextMaxSkill = getMaxAwakeningSkillLevel(nextStars);

    onUpdate(hero.id, {
      awakeningStars: nextStars,
      awakeningTiers: nextTiers,
      awakeningSkill: Math.min(nextMaxSkill, currentAwakenSkill),
    });
  };

  const updateAwakenSkill = (rawValue) => {
    const parsed = Number(rawValue);
    const safeVal = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(maxAwakenSkill, safeVal));
    onUpdate(hero.id, { awakeningSkill: clamped });
  };

  const numBoxStyle = {
    width: '38px',
    textAlign: 'center',
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '2px 0',
    fontSize: '11px',
    fontWeight: 'bold',
  };  return (
    <div style={{ marginTop: '10px', borderTop: '1px solid #334155', paddingTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc' }}>
          Skills (Max Lv. {maxSkillLevel})
        </span>
        {hero.hasExclusiveWeapon && (
          <span style={{ fontSize: '10px', color: '#38bdf8' }}>
            {ewLevel >= 30 ? 'Cap Maxed (40)' : 'Upgrade Weapon to raise cap'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
        {skillLabels.map((skillName, idx) => {
          const val = Math.min(maxSkillLevel, currentSkills[idx] || 1);
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#0f172a',
                padding: '6px 8px',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {idx + 1}. {skillName}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => updateSkill(idx, val - 1)}
                  style={{ ...styles.smallBtn, padding: '3px 6px' }}
                >
                  <Minus size={11} />
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxSkillLevel}
                  value={val}
                  onChange={(e) => updateSkill(idx, e.target.value)}
                  style={numBoxStyle}
                />
                <button
                  type="button"
                  onClick={() => updateSkill(idx, val + 1)}
                  style={{ ...styles.smallBtn, padding: '3px 6px' }}
                >
                  <Plus size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => updateSkill(idx, maxSkillLevel)}
                  style={{ ...styles.smallBtn, padding: '3px 6px', backgroundColor: '#2563eb', fontSize: '10px' }}
                >
                  MAX
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {hero.hasExclusiveWeapon && (
        <div style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sword size={15} color="#f97316" />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fb923c' }}>
                  {hero.exclusiveWeaponName || 'Exclusive Weapon'}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {ewLevel === 0 ? 'Not unlocked (Lv. 0)' : `Unlocked • Skill Cap Lv. ${maxSkillLevel}`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={() => updateWeaponLevel(ewLevel - 1)}
                style={{ ...styles.smallBtn, padding: '4px 7px' }}
              >
                -1
              </button>
              <input
                type="number"
                min="0"
                max="30"
                value={ewLevel}
                onChange={(e) => updateWeaponLevel(e.target.value)}
                style={{ ...numBoxStyle, width: '42px', padding: '3px 0' }}
              />
              <button
                type="button"
                onClick={() => updateWeaponLevel(ewLevel + 1)}
                style={{ ...styles.smallBtn, padding: '4px 7px', backgroundColor: '#ea580c' }}
              >
                +1
              </button>
            </div>
          </div>
        </div>
      )}

      {hero.hasExclusiveWeapon && (
        <div style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '8px', border: '1px solid #7f1d1d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                <Flame size={14} color="#ef4444" />
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fca5a5' }}>
                  Awakening ({awakenStars}★ Red)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                {AWAKEN_STARS.map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= awakenStars ? '#ef4444' : 'none'}
                    color={s <= awakenStars ? '#ef4444' : '#64748b'}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '3px' }}>
                {AWAKEN_TIERS.map((t) => (
                  <div
                    key={t}
                    style={{
                      width: '15px',
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor: awakenStars === 5 || t <= awakenTiers ? '#ef4444' : '#334155',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                type="button"
                onClick={() => changeAwakenTier(-1)}
                style={{ ...styles.smallBtn, padding: '4px 8px' }}
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => changeAwakenTier(1)}
                style={{ ...styles.smallBtn, padding: '4px 8px', backgroundColor: '#dc2626' }}
              >
                +1
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', borderTop: '1px solid #1e293b', paddingTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
              4th Skill (Max Lv. {maxAwakenSkill})
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={() => updateAwakenSkill(currentAwakenSkill - 1)}
                style={{ ...styles.smallBtn, padding: '3px 6px' }}
              >
                <Minus size={11} />
              </button>
              <input
                type="number"
                min="1"
                max={maxAwakenSkill}
                value={currentAwakenSkill}
                onChange={(e) => updateAwakenSkill(e.target.value)}
                style={numBoxStyle}
              />
              <button
                type="button"
                onClick={() => updateAwakenSkill(currentAwakenSkill + 1)}
                style={{ ...styles.smallBtn, padding: '3px 6px' }}
              >
                <Plus size={11} />
              </button>
              <button
                type="button"
                onClick={() => updateAwakenSkill(maxAwakenSkill)}
                style={{ ...styles.smallBtn, padding: '3px 6px', backgroundColor: '#dc2626', fontSize: '10px' }}
              >
                MAX
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
                                         }
                         
                                                               
