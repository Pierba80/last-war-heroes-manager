import React from 'react';
import { INITIAL_HEROES } from '../data/heroesData';
import { calculateHeroPower, calculateOverlordPower, formatPower } from '../utils/powerCalculator';

const SQUAD_NUMS = Array.from({ length: 4 }, (_, i) => i + 1);
const FRONT_KEYS = ['front1', 'front2'];
const BACK_KEYS = ['back1', 'back2', 'back3'];
const GEAR_LIST = [
  { key: 'railgun', short: 'Gun' },
  { key: 'chip', short: 'Chip' },
  { key: 'armor', short: 'Armor' },
  { key: 'radar', short: 'Radar' },
];

export default function SquadExportCard({ exportRef, squads, progress, overlord, getSynergyFn }) {
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

  const renderHeroBox = (slots, slotKey, positionLabel) => {
    const heroId = slots[slotKey];
    const hero = INITIAL_HEROES.find((h) => h.id === heroId);

    if (!hero) {
      return (
        <div
          key={slotKey}
          style={{
            backgroundColor: '#1e293b',
            border: '1px dashed #475569',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '155px',
            color: '#64748b',
            fontSize: '11px',
          }}
        >
          <div style={{ fontSize: '9px', marginBottom: '3px' }}>{positionLabel}</div>
          Empty
        </div>
      );
    }

    const p = progress[hero.id] || {};
    const heroPower = calculateHeroPower(hero, p);
    const borderCol = getRarityColor(hero.rarity, p.isPromotedUR);
    const skills = Array.isArray(p.skills) && p.skills.length === 3 ? p.skills : Array(3).fill(1);
    const gear = p.gear || {};

    return (
      <div
        key={slotKey}
        style={{
          backgroundColor: '#1e293b',
          border: `2px solid ${borderCol}`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              minWidth: '38px',
              borderRadius: '7px',
              border: `2px solid ${borderCol}`,
              backgroundColor: '#0f172a',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={p.avatar || `/heroes/${hero.id}.png`}
              alt={hero.name}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase' }}>{positionLabel}</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {hero.name}
            </div>
            <div style={{ fontSize: '10px', color: '#facc15', fontWeight: 'bold' }}>
              Lv.{p.level || 1} • {p.stars || 0}★ • <span style={{ color: '#fb923c' }}>⚡{formatPower(heroPower)}</span>
            </div>
          </div>
        </div>

        {(p.exclusiveWeaponLevel > 0 || p.awakeningStars > 0) && (
          <div style={{ backgroundColor: '#0f172a', padding: '3px 5px', borderRadius: '5px', fontSize: '9px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3px' }}>
            {p.exclusiveWeaponLevel > 0 && (
              <span style={{ color: '#fb923c', fontWeight: 'bold' }}>
                Wpn: Lv.{p.exclusiveWeaponLevel}
              </span>
            )}
            {p.awakeningStars > 0 && (
              <span style={{ color: '#f87171', fontWeight: 'bold' }}>
                Awk: {p.awakeningStars}★ (Lv.{p.awakeningSkill || 1})
              </span>
            )}
          </div>
        )}

        <div style={{ backgroundColor: '#0f172a', padding: '3px 5px', borderRadius: '5px', fontSize: '9px', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
          <span>Skills:</span>
          <strong style={{ color: '#38bdf8' }}>
            {skills.at(0)} / {skills.at(1)} / {skills.at(2)}
          </strong>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
          {GEAR_LIST.map(({ key, short }) => {
            const g = gear[key] || { rarity: 'None', level: 0, stars: 0 };
            const gColor = getGearColor(g.rarity);
            return (
              <div
                key={key}
                style={{
                  backgroundColor: '#0f172a',
                  borderLeft: `2px solid ${gColor}`,
                  padding: '2px 4px',
                  borderRadius: '3px',
                  fontSize: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#94a3b8' }}>{short}</span>
                <strong style={{ color: gColor }}>
                  {g.rarity === 'None'
                    ? '-'
                    : `${g.rarity} ${g.level}${g.stars > 0 ? ` ${g.stars}★` : ''}`}
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
          width: '760px',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          border: '2px solid #eab308',
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/Logo.png" alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '19px', fontWeight: '900', color: '#facc15' }}>
                ALL SQUADS OVERVIEW (1–4)
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Heroes, Overlord, Power, Skills, Weapons & Gear
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#facc15' }}>© Pīərbâ</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {SQUAD_NUMS.map((sqNum) => {
          const slots = squads[sqNum] || {};
          const assignedIds = Object.values(slots).filter(Boolean);
          const synergy = getSynergyFn(assignedIds);
          const hasOverlord = overlord && overlord.squad === sqNum;

          const heroesBasePower = assignedIds.reduce((sum, id) => {
            const h = INITIAL_HEROES.find((item) => item.id === id);
            return h ? sum + calculateHeroPower(h, progress[id]) : sum;
          }, 0);
          const ovPower = hasOverlord ? calculateOverlordPower(overlord) : 0;
          const totalPower = Math.round(heroesBasePower * (1 + synergy.bonus / 100) + ovPower);

          return (
            <div
              key={sqNum}
              style={{
                backgroundColor: '#131c31',
                border: hasOverlord ? '1px solid #ef4444' : '1px solid #334155',
                borderRadius: '10px',
                padding: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <strong style={{ fontSize: '15px', color: '#facc15' }}>SQUAD {sqNum}</strong>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fb923c' }}>
                    ⚡ {formatPower(totalPower)}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: synergy.bonus > 0 ? '#4ade80' : '#94a3b8', fontWeight: 'bold' }}>
                  {synergy.label}
                </span>
              </div>

              {hasOverlord && (
                <div
                  style={{
                    backgroundColor: '#1e1b2e',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={overlord.avatar || '/heroes/overlord.png'}
                      alt="Overlord"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #ef4444', objectFit: 'cover' }}
                    />
                    <strong style={{ color: '#fca5a5' }}>
                      OVERLORD Lv.{overlord.level || 1} • <span style={{ color: '#fb923c' }}>⚡{formatPower(ovPower)}</span>
                    </strong>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '10px' }}>
                    ATK/DEF/PS: <strong style={{ color: '#4ade80' }}>{overlord.training?.atk || 1}/{overlord.training?.def || 1}/{overlord.training?.hp || 1}</strong> • Skills: <strong style={{ color: '#38bdf8' }}>{overlord.skills?.strike || 1}/{overlord.skills?.roar || 1}/{overlord.skills?.brutal || 1}/{overlord.skills?.instinct || 1}/{overlord.skills?.command || 1}</strong>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                {renderHeroBox(slots, FRONT_KEYS.at(0), 'Front Left')}
                {renderHeroBox(slots, FRONT_KEYS.at(1), 'Front Right')}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {renderHeroBox(slots, BACK_KEYS.at(0), 'Back Left')}
                {renderHeroBox(slots, BACK_KEYS.at(1), 'Back Center')}
                {renderHeroBox(slots, BACK_KEYS.at(2), 'Back Right')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
          }
                          
