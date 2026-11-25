import React, { useState } from 'react';
import { Shield, Plane, Rocket, X } from 'lucide-react';
import { INITIAL_HEROES } from '../data/heroesData';
import HeroAvatar from './HeroAvatar';
import { styles } from '../styles';

export default function HeroPickerModal({ selectedSquad, progress, squads, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const getHeroAssignedSquad = (heroId) => {
    const squadNumbers = Array.from({ length: 4 }, (_, i) => i + 1);
    for (const sqNum of squadNumbers) {
      const slots = squads[sqNum] || {};
      if (Object.values(slots).includes(heroId)) {
        return sqNum;
      }
    }
    return null;
  };

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

  const availableHeroes = INITIAL_HEROES.filter((hero) => {
    if (typeFilter !== 'All' && hero.type !== typeFilter) return false;
    if (search && !hero.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid #475569',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '460px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <strong style={{ fontSize: '15px', color: '#facc15' }}>
            Assign Hero to Squad {selectedSquad}
          </strong>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search hero..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...styles.searchInput, marginBottom: '8px' }}
        />

        <div style={{ ...styles.filterRow, marginBottom: '10px' }}>
          {['All', 'Tank', 'Aircraft', 'Missile'].map((t) => (
            <button key={t} type="button" onClick={() => setTypeFilter(t)} style={styles.filterBtn(typeFilter === t)}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {availableHeroes.map((hero) => {
            const p = progress[hero.id] || {};
            const assignedSq = getHeroAssignedSquad(hero.id);

            return (
              <button
                key={hero.id}
                type="button"
                onClick={() => onSelect(hero.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HeroAvatar
                    hero={hero}
                    avatar={p.avatar}
                    borderColor={getRarityBorder(hero)}
                    size={34}
                    editable={false}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {getTypeIcon(hero.type)}
                      <strong style={{ fontSize: '13px' }}>{hero.name}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Lv.{p.level || 1} • {p.stars || 0}★
                    </div>
                  </div>
                </div>

                {assignedSq && (
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#334155', color: '#facc15' }}>
                    In Squad {assignedSq}
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
