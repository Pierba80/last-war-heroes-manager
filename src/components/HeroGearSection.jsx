import React from 'react';
import { Crosshair, Cpu, Shield, Radio, Star, Plus, Minus } from 'lucide-react';
import { styles } from '../styles';

const GEAR_SLOTS = [
  { key: 'railgun', label: 'Railgun', sub: 'Attack', Icon: Crosshair },
  { key: 'chip', label: 'Data Chip', sub: 'Attack / HP', Icon: Cpu },
  { key: 'armor', label: 'Armor', sub: 'Defense', Icon: Shield },
  { key: 'radar', label: 'Radar', sub: 'Energy Res.', Icon: Radio },
];

const STAR_NUMBERS = Array.from({ length: 5 }, (_, i) => i + 1);

const DEFAULT_SLOT = { rarity: 'None', level: 0, stars: 0 };

export default function HeroGearSection({ hero, progress, onUpdate }) {
  const currentGear = progress.gear || {};

  const updateSlot = (slotKey, changes) => {
    const prevSlot = { ...DEFAULT_SLOT, ...(currentGear[slotKey] || {}) };
    const nextSlot = { ...prevSlot, ...changes };

    if (nextSlot.rarity === 'None') {
      nextSlot.level = 0;
      nextSlot.stars = 0;
    } else if (nextSlot.level === 0) {
      nextSlot.level = 1;
    }

    if (nextSlot.level < 40 && nextSlot.rarity !== 'Mythic') {
      nextSlot.stars = 0;
    }

    if (nextSlot.rarity === 'Mythic') {
      nextSlot.level = 40;
      nextSlot.stars = 5;
    }

    onUpdate(hero.id, {
      gear: {
        ...currentGear,
        [slotKey]: nextSlot,
      },
    });
  };

  const getRarityStyle = (rarity) => {
    if (rarity === 'Mythic') return { border: '#ef4444', badgeBg: '#7f1d1d', text: '#fca5a5' };
    if (rarity === 'UR') return { border: '#eab308', badgeBg: '#713f12', text: '#fde047' };
    if (rarity === 'SSR') return { border: '#a855f7', badgeBg: '#581c87', text: '#e9d5ff' };
    return { border: '#334155', badgeBg: '#1e293b', text: '#94a3b8' };
  };

  return (
    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #334155', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      {GEAR_SLOTS.map(({ key, label, sub, Icon }) => {
        const slot = { ...DEFAULT_SLOT, ...(currentGear[key] || {}) };
        const rStyle = getRarityStyle(slot.rarity);
        const canPromoteStars = (slot.rarity === 'UR' && slot.level >= 40) || slot.rarity === 'Mythic';

        return (
          <div
            key={key}
            style={{
              backgroundColor: '#0f172a',
              border: `1px solid ${rStyle.border}`,
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {/* Header Slot & Rarity Select */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                <Icon size={14} color={rStyle.text} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>{sub}</div>
                </div>
              </div>

              <select
                value={slot.rarity}
                onChange={(e) => updateSlot(key, { rarity: e.target.value })}
                style={{
                  backgroundColor: rStyle.badgeBg,
                  color: rStyle.text,
                  border: `1px solid ${rStyle.border}`,
                  borderRadius: '5px',
                  padding: '2px 4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
              >
                <option value="None">None</option>
                <option value="SSR">SSR</option>
                <option value="UR">UR</option>
                <option value="Mythic">Mythic</option>
              </select>
            </div>

            {/* Level Controls (0 - 40) */}
            {slot.rarity !== 'None' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '4px 6px', borderRadius: '6px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Lv.{slot.level}</span>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <button
                    onClick={() => updateSlot(key, { level: Math.max(1, slot.level - 1) })}
                    style={{ ...styles.smallBtn, padding: '3px 5px' }}
                    title="-1 Level"
                  >
                    <Minus size={11} />
                  </button>
                  <button
                    onClick={() => updateSlot(key, { level: Math.min(40, slot.level + 1) })}
                    style={{ ...styles.smallBtn, padding: '3px 5px' }}
                    title="+1 Level"
                  >
                    <Plus size={11} />
                  </button>
                  <button
                    onClick={() => updateSlot(key, { level: Math.min(40, slot.level + 10) })}
                    style={{ ...styles.smallBtn, padding: '3px 5px', backgroundColor: '#2563eb', fontSize: '10px' }}
                    title="+10 Levels"
                  >
                    +10
                  </button>
                </div>
              </div>
            )}

            {/* Promotion Stars (Unlocked at UR Lv. 40) */}
            {canPromoteStars && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px' }}>
                <div style={{ display: 'flex', gap: '1px' }}>
                  {STAR_NUMBERS.map((s) => (
                    <Star
                      key={s}
                      size={11}
                      fill={s <= slot.stars ? (slot.rarity === 'Mythic' ? '#ef4444' : '#facc15') : 'none'}
                      color={s <= slot.stars ? (slot.rarity === 'Mythic' ? '#ef4444' : '#facc15') : '#475569'}
                    />
                  ))}
                </div>
                {slot.rarity !== 'Mythic' && (
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <button
                      onClick={() => updateSlot(key, { stars: Math.max(0, slot.stars - 1) })}
                      style={{ ...styles.smallBtn, padding: '2px 5px', fontSize: '10px' }}
                    >
                      -★
                    </button>
                    <button
                      onClick={() => updateSlot(key, { stars: Math.min(5, slot.stars + 1) })}
                      style={{ ...styles.smallBtn, padding: '2px 5px', fontSize: '10px', backgroundColor: '#ca8a04' }}
                    >
                      +★
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
  }
              
