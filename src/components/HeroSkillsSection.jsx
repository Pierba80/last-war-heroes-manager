import React from 'react';
import { Sword, Flame, Star, Plus, Minus } from 'lucide-react';
import { getMaxSkillLevel } from '../data/heroesData';
import { styles } from '../styles';

const SKILL_NAMES = ['Auto Attack', 'Tactic', 'Passive'];
const STAR_LIST = Array.from({ length: 5 }, (_, i) => i + 1);

export const getMaxAwakeningSkillLevel = (awakeningStars = 0) => {
  if (awakeningStars <= 0) return 1;
  if (awakeningStars === 1) return 10;
  if (awakeningStars === 2) return 20;
  if (awakeningStars === 3) return 30;
  if (awakeningStars === 4) return 35;
  return 40;
};

export default function HeroSkillsSection({ hero, progress, onUpdate }) {
  const ewLevel = progress.exclusiveWeaponLevel || 0;
  const maxSkillLvl = getMaxSkillLevel(ewLevel);
  const skills = Array.isArray(progress.skills) && progress.skills.length === 3
    ? progress.skills
    : Array(3).fill(1);

  const awakeningStars = progress.awakeningStars || 0;
  const maxAwakenSkillLvl = getMaxAwakeningSkillLevel(awakeningStars);
  const awakeningSkill = Math.min(maxAwakenSkillLvl, progress.awakeningSkill || 1);

  const updateSingleSkill = (index, rawValue) => {
    const parsed = Number(rawValue);
    const safeVal = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(maxSkillLvl, safeVal));
    const updated = [...skills];
    updated[index] = clamped;
    onUpdate(hero.id, { skills: updated });
  };

  const updateWeaponLevel = (newValue) => {
    const clamped = Math.max(0, Math.min(30, newValue));
    const newMaxSkill = getMaxSkillLevel(clamped);
    const updates = {
      exclusiveWeaponLevel: clamped,
      skills: skills.map((s) => Math.min(newMaxSkill, s)),
    };
    if (clamped < 20) {
      updates.awakeningStars = 0;
      updates.awakeningSkill = 1;
    }
    onUpdate(hero.id, updates);
  };

  const updateAwakeningStars = (newStars) => {
    const clampedStars = Math.max(0, Math.min(5, newStars));
    const newMaxAwaken = getMaxAwakeningSkillLevel(clampedStars);
    onUpdate(hero.id, {
      awakeningStars: clampedStars,
      awakeningSkill: Math.min(newMaxAwaken, awakeningSkill),
    });
  };

  const updateAwakeningSkill = (rawValue) => {
    const parsed = Number(rawValue);
    const safeVal = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(maxAwakenSkillLvl, safeVal));
    onUpdate(hero.id, { awakeningSkill: clamped });
  };

  const canAwaken = hero.hasExclusiveWeapon && progress.stars >= 5 && ewLevel >= 20;

  const numInputStyle = {
    width: '34px',
    textAlign: 'center',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '2px 0',
    fontSize: '12px',
    fontWeight: 'bold',
  };
      return (
    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>Skills</span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Max Lv. {maxSkillLvl}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {SKILL_NAMES.map((label, idx) => (
            <div key={label} style={{ backgroundColor: '#1e293b', padding: '6px 4px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#cbd5e1', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                <button
                  type="button"
                  onClick={() => updateSingleSkill(idx, skills[idx] - 1)}
                  style={{ ...styles.smallBtn, padding: '4px 5px' }}
                >
                  <Minus size={11} />
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxSkillLvl}
                  value={skills[idx]}
                  onChange={(e) => updateSingleSkill(idx, e.target.value)}
                  style={numInputStyle}
                />
                <button
                  type="button"
                  onClick={() => updateSingleSkill(idx, skills[idx] + 1)}
                  style={{ ...styles.smallBtn, padding: '4px 5px' }}
                >
                  <Plus size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hero.hasExclusiveWeapon && (
        <div style={{ backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sword size={15} color={ewLevel > 0 ? '#f97316' : '#64748b'} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: ewLevel > 0 ? '#fdba74' : '#94a3b8' }}>
                Exclusive Weapon
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                {progress.stars < 5 ? 'Requires 5★ to unlock' : ewLevel === 0 ? 'Locked (Lv. 0)' : `Level ${ewLevel} / 30`}
              </div>
            </div>
          </div>

          {progress.stars >= 5 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button type="button" onClick={() => updateWeaponLevel(ewLevel - 1)} style={styles.smallBtn}>
                <Minus size={12} />
              </button>
              <span style={{ fontSize: '13px', fontWeight: 'bold', minWidth: '22px', textAlign: 'center', color: '#f97316' }}>
                {ewLevel}
              </span>
              <button type="button" onClick={() => updateWeaponLevel(ewLevel + 1)} style={{ ...styles.smallBtn, backgroundColor: '#ea580c' }}>
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      )}

      {hero.hasExclusiveWeapon && (
        <div style={{ backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px', opacity: canAwaken ? 1 : 0.55 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: canAwaken ? '8px' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={15} color={awakeningStars > 0 ? '#ef4444' : '#64748b'} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: awakeningStars > 0 ? '#fca5a5' : '#94a3b8' }}>
                  Hero Awakening
                </div>
                {!canAwaken && (
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    Requires 5★ & Exclusive Weapon Lv. 20
                  </div>
                )}
              </div>
            </div>

            {canAwaken && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => updateAwakeningStars(awakeningStars - 1)}
                  style={{ ...styles.smallBtn, padding: '4px 6px' }}
                >
                  -1
                </button>
                <div style={{ display: 'flex', gap: '2px', padding: '0 4px' }}>
                  {STAR_LIST.map((s) => (
                    <Star
                      key={s}
                      size={13}
                      fill={s <= awakeningStars ? '#ef4444' : 'none'}
                      color={s <= awakeningStars ? '#ef4444' : '#475569'}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => updateAwakeningStars(awakeningStars + 1)}
                  style={{ ...styles.smallBtn, padding: '4px 6px', backgroundColor: '#dc2626' }}
                >
                  +1
                </button>
              </div>
            )}
          </div>

          {canAwaken && awakeningStars > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '6px 8px', borderRadius: '6px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#fca5a5', fontWeight: 'bold' }}>4th Skill (Awakening)</div>
                <div style={{ fontSize: '9px', color: '#94a3b8' }}>Cap at {awakeningStars}★: Max Lv.{maxAwakenSkillLvl}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => updateAwakeningSkill(awakeningSkill - 1)}
                  style={{ ...styles.smallBtn, padding: '4px 6px' }}
                >
                  <Minus size={12} />
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxAwakenSkillLvl}
                  value={awakeningSkill}
                  onChange={(e) => updateAwakeningSkill(e.target.value)}
                  style={{ ...numInputStyle, width: '38px' }}
                />
                <button
                  type="button"
                  onClick={() => updateAwakeningSkill(awakeningSkill + 1)}
                  style={{ ...styles.smallBtn, padding: '4px 6px' }}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
                                                   }

