import React from 'react';
import { INITIAL_HEROES } from '../data/heroesData';

const FRONT_KEYS = ['front1', 'front2'];
const BACK_KEYS = ['back1', 'back2', 'back3'];
const GEAR_LIST = [
  { key: 'railgun', short: 'Gun' },
  { key: 'chip', short: 'Chip' },
  { key: 'armor', short: 'Armor' },
  { key: 'radar', short: 'Radar' },
];

export default function SquadExportCard({ exportRef, squadNum, slots, progress, synergy }) {
  const getRarityColor = (rarity, isPromoted) => {
    const eff = isPromoted ? 'UR' : rarity;
    if (eff === 'UR') return '#eab308';
    if (eff === 'SSR') return '#a855f7';
    return '#3b82f6';
  };

  const getGearColor = (rarity) => {
    if (rarity === 'Mythic') return '#ef4444';
    if (rarity === 'UR') return '#facc15';
    if (rarity === 'SSR') return '#c084fc';
    return '#64748b';
  };

  const renderHeroBox = (slotKey, positionLabel) => {
    const heroId = slots[slotKey];
    const hero = INITIAL_HEROES.find((h) => h.id === heroId);

    if (!hero) {
      return (
        <div
          key={slotKey}
          style={{
            backgroundColor: '#1e293b',
            border: '1px dashed #475569',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '190px',
            color: '#64748b',
            fontSize: '12px',
          }}
        >
          <div style={{ fontSize: '10px', marginBottom: '4px' }}>{positionLabel}</div>
          Empty Slot
        </div>
      );
    }

    const p = progress[hero.id] || {};
    const borderCol = getRarityColor(hero.rarity, p.isPromotedUR);
    const skills = Array.isArray(p.skills) && p.skills.length === 3 ? p.skills : Array(3).fill(1);
    const gear = p.gear || {};

    return (
      <div
        key={slotKey}
        style={{
          backgroundColor: '#1e293b',
          border: `2px solid ${borderCol}`,
          borderRadius: '10px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {/* Top: Avatar + Name + Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              borderRadius: '8px',
              border: `2px solid ${borderCol}`,
              backgroundColor: '#0f172a',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#94a3b8',
              fontSize: '14px',
            }}
          >
            {p.avatar ? (
              <img src={p.avatar} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              hero.name.slice(0, 2).toUpperCase()
            )}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }}>{positionLabel}</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {hero.name}
            </div>
            <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 'bold' }}>
              Lv.{p.level || 1} • {p.stars || 0}★ {p.tiers > 0 ? `(${p.tiers}/5)` : ''}
            </div>
          </div>
        </div>

        {/* Exclusive Weapon & Awakening */}
        {(p.exclusiveWeaponLevel > 0 || p.awakeningStars > 0) && (
          <div style={{ backgroundColor: '#0f172a', padding: '4px 6px', borderRadius: '6px', fontSize: '10px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
            {p.exclusiveWeaponLevel > 0 && (
              <span style={{ color: '#fb923c', fontWeight: 'bold' }}>
                Weapon: Lv.{p.exclusiveWeaponLevel}
              </span>
            )}
            {p.awakeningStars > 0 && (
              <span style={{ color: '#f87171', fontWeight: 'bold' }}>
                Awaken: {p.awakeningStars}★ (4th: Lv.{p.awakeningSkill || 1})
              </span>
            )}
          </div>
        )}

        {/* 3 Base Skills */}
        <div style={{ backgroundColor: '#0f172a', padding: '4px 6px', borderRadius: '6px', fontSize: '10px', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
          <span>Skills:</span>
          <strong style={{ color: '#38bdf8' }}>
            {skills.at(0)} / {skills.at(1)} / {skills.at(2)}
          </strong>
        </div>

        {/* 4 Gear Slots */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          {GEAR_LIST.map(({ key, short }) => {
            const g = gear[key] || { rarity: 'None', level: 0, stars: 0 };
            const gColor = getGearColor(g.rarity);
            return (
              <div
                key={key}
                style={{
                  backgroundColor: '#0f172a',
                  borderLeft: `3px solid ${gColor}`,
                  padding: '3px 5px',
                  borderRadius: '4px',
                  fontSize: '9px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#94a3b8' }}>{short}</span>
                <strong style={{ color: gColor }}>
                  {g.rarity === 'None'
                    ? '-'
                    : `${g.rarity} Lv.${g.level}${g.stars > 0 ? ` ${g.stars}★` : ''}`}
                </strong>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}>
      <div
        ref={exportRef}
        style={{
          width: '720px',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          border: '2px solid #eab308',
          borderRadius: '14px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/Logo.png" alt="Logo" style={{ height: '38px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#facc15' }}>
                SQUAD {squadNum} FORMATION
              </div>
              <div style={{ fontSize: '12px', color: '#4ade80', fontWeight: 'bold' }}>
                {synergy.label}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#facc15' }}>© Pīərbâ</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Front Row */}
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
          Front Row
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          {renderHeroBox(FRONT_KEYS.at(0), 'Front Left')}
          {renderHeroBox(FRONT_KEYS.at(1), 'Front Right')}
        </div>

        {/* Back Row */}
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
          Back Row
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {renderHeroBox(BACK_KEYS.at(0), 'Back Left')}
          {renderHeroBox(BACK_KEYS.at(1), 'Back Center')}
          {renderHeroBox(BACK_KEYS.at(2), 'Back Right')}
        </div>
      </div>
    </div>
  );
    }
    
