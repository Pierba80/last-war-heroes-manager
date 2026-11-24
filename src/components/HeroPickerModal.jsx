import React from 'react';
import { Shield, Plane, Rocket, Star, X } from 'lucide-react';
import { INITIAL_HEROES } from '../data/heroesData';
import HeroAvatar from './HeroAvatar';

export default function HeroPickerModal({ selectedSquad, progress, squads, onSelect, onClose }) {
  const getRarityBorder = (hero) => {
    const p = progress[hero.id] || {};
    const effectiveRarity = p.isPromotedUR ? 'UR' : hero.rarity;
    if (effectiveRarity === 'UR') return '#eab308';
    if (effectiveRarity === 'SSR') return '#a855f7';
    return '#3b82f6';
  };

  const getTypeIcon = (type) => {
    if (type === 'Tank') return <Shield size={13} color="#4ade80" />;
    if (type === 'Aircraft') return <Plane size={13} color="#38bdf8" />;
    return <Rocket size={13} color="#f87171" />;
  };

  const findHeroSquad = (heroId) => {
      const squadNumbers = Array.from({ length: 3 }, (_, i) => i + 1);
    for (let i = 0; i < squadNumbers.length; i++) {
      const num = squadNumbers[i];
      const sq = squads[num] || {};
      if (Object.values(sq).includes(heroId)) return num;
    }
    return null;
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '460px',
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #475569',
        }}
      >
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: '15px', color: '#facc15' }}>Select Hero for Squad {selectedSquad}</strong>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {INITIAL_HEROES.map((hero) => {
            const p = progress[hero.id] || {};
            const inSquad = findHeroSquad(hero.id);

            return (
              <button
                key={hero.id}
                onClick={() => onSelect(hero.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HeroAvatar
                    hero={hero}
                    avatar={p.avatar}
                    borderColor={getRarityBorder(hero)}
                    size={36}
                    editable={false}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {getTypeIcon(hero.type)}
                      <strong style={{ fontSize: '14px' }}>{hero.name}</strong>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>({hero.role})</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                      Lv.{p.level || 1} • {p.stars || 0} <Star size={10} fill="#facc15" color="#facc15" style={{ display: 'inline' }} />
                    </div>
                  </div>
                </div>

                {inSquad && (
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#334155', color: '#facc15' }}>
                    Squad {inSquad}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
                      }
