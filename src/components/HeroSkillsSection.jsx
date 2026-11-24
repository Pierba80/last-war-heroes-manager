import React from 'react';
import { Sword, Flame, Star, Plus, Minus } from 'lucide-react';
import { getMaxSkillLevel } from '../data/heroesData';
import { styles } from '../styles';

const SKILL_NAMES = ['Auto Attack', 'Tactic', 'Passive'];

export default function HeroSkillsSection({ hero, progress, onUpdate }) {
  const ewLevel = progress.exclusiveWeaponLevel || 0;
  const maxSkillLvl = getMaxSkillLevel(ewLevel);
  const skills = Array.isArray(progress.skills) && progress.skills.length === 3
    ? progress.skills
    :;

  const awakeningStars = progress.awakeningStars || 0;
  const awakeningSkill = progress.awakeningSkill || 1;

  const updateSingleSkill = (index, newValue) => {
    const clamped = Math.max(1, Math.min(maxSkillLvl, newValue));
    const updated = [...skills];
    updated[index] = clamped;
    onUpdate(hero.id, { skills: updated });
  };

  const updateWeaponLevel = (newValue) => {
    const clamped = Math.max(0, Math.min(30, newValue));
    const updates = { exclusiveWeaponLevel: clamped };
    if (clamped < 20) {
      updates.awakeningStars = 0;
    }
    onUpdate(hero.id, updates);
  };

  const canAwaken = hero.hasExclusiveWeapon && progress.stars >= 5 && ewLevel >= 20;

  return (
    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Base 3 Skills */}
      <div style={{ backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>Skills</span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Max Lv. {maxSkillLvl}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {SKILL_NAMES.map((label, idx) => (
            <div key={label} style={{ backgroundColor: '#1e293b', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#cbd5e1', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <button
                  onClick={() => updateSingleSkill(idx, skills[idx] - 1)}
                  style={{ ...styles.smallBtn, padding: '4px 6px' }}
                >
                  <Minus size={12} />
                </button>
                <span style={{ fontSize: '13px', fontWeight: 'bold', minWidth: '20px' }}>{skills[idx]}</span>
                <button
                  onClick={() => updateSingleSkill(idx, skills[idx] + 1)}
                  style={{ ...styles.smallBtn, padding: '4px 6px' }}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive Weapon (UR Heroes only) */}
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
              <button onClick={() => updateWeaponLevel(ewLevel - 1)} style={styles.smallBtn}>
                <Minus size={12} />
              </button>
              <span style={{ fontSize: '13px', fontWeight: 'bold', minWidth: '22px', textAlign: 'center', color: '#f97316' }}>
                {ewLevel}
              </span>
              <button onClick={() => updateWeaponLevel(ewLevel + 1)} style={{ ...styles.smallBtn, backgroundColor: '#ea580c' }}>
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hero Awakening (Requires 5 Stars + Exclusive Weapon Lv. 20+) */}
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
                  onClick={() => onUpdate(hero.id, { awakeningStars: Math.max(0, awakeningStars - 1) })}
                  style={{ ...styles.smallBtn, padding: '4px 6px' }}
                >
                  -1
                </button>
                <div style={{ display: 'flex', gap: '2px', padding: '0 4px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      fill={s <= awakeningStars ? '#ef4444' : 'none'}
                      color={s <= awakeningStars ? '#ef4444' : '#475569'}
                    />
                  ))}
                </div>
                <button
                  onClick={() => onUpdate(hero.id, { awakeningStars: Math.min(5, awakeningStars + 1) })}
                  style={{ ...styles.smallBtn, padding: '4px 6px', backgroundColor: '#dc2626' }}
                >
                  +1
                </button>
              </div>
            )}
          </div>

          {/* 4th Skill (Awakening Skill) */}
          {canAwaken && awakeningStars > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '6px 8px', borderRadius: '6px' }}>
              <span style={{ fontSize: '11px', color: '#fca5a5' }}>4th Skill (Awakening)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => onUpdate(hero.id, { awakeningSkill: Math.max(1, awakeningSkill - 1) })}
                  style={{ ...styles.smallBtn, padding: '4px 6px' }}
                >
                  <Minus size={12} />
                </button>
                <span style={{ fontSize: '12px', fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>
                  Lv.{awakeningSkill}
                </span>
                <button
                  onClick={() => onUpdate(hero.id, { awakeningSkill: Math.min(40, awakeningSkill + 1) })}
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
                     
