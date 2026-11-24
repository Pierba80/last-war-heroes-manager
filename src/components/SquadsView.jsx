import React, { useState } from 'react';
import { Shield, Plane, Rocket, Users, X, Sparkles } from 'lucide-react';
import { INITIAL_HEROES } from '../data/heroesData';
import HeroAvatar from './HeroAvatar';
import HeroPickerModal from './HeroPickerModal';
import { styles } from '../styles';

const SQUAD_TABS =;

const SLOTS = [
  { key: 'front1', label: 'Front Left', row: 'front' },
  { key: 'front2', label: 'Front Right', row: 'front' },
  { key: 'back1', label: 'Back Left', row: 'back' },
  { key: 'back2', label: 'Back Center', row: 'back' },
  { key: 'back3', label: 'Back Right', row: 'back' },
];

const getSquadSynergy = (heroIds) => {
  const heroes = heroIds
    .map((id) => INITIAL_HEROES.find((h) => h.id === id))
    .filter(Boolean);

  if (heroes.length === 0) {
    return { bonus: 0, label: 'Empty Squad', counter: null };
  }

  const counts = { Tank: 0, Aircraft: 0, Missile: 0 };
  heroes.forEach((h) => {
    counts[h.type] = (counts[h.type] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [topType, topCount] = sorted[0];
  const [, secondCount] = sorted[1];

  let bonus = 0;
  let label = 'No Type Synergy (<3 same type)';

  if (topCount === 5) {
    bonus = 20;
    label = `5 ${topType} Heroes (+20% HP, ATK & DEF)`;
  } else if (topCount === 4) {
    bonus = 15;
    label = `4 ${topType} Heroes (+15% HP, ATK & DEF)`;
  } else if (topCount === 3 && secondCount === 2) {
    bonus = 10;
    label = `3 ${topType} + 2 Mix (+10% HP, ATK & DEF)`;
  } else if (topCount === 3) {
    bonus = 5;
    label = `3 ${topType} Heroes (+5% HP, ATK & DEF)`;
  }

  const counters = {
    Tank: 'Strong vs Missile (-20% dmg taken)',
    Aircraft: 'Strong vs Tank (-20% dmg taken)',
    Missile: 'Strong vs Aircraft (-20% dmg taken)',
  };

  return {
    bonus,
    label,
    counter: topCount >= 3 ? counters[topType] : null,
  };
};

export default function SquadsView({ progress, squads, onAssignSlot, onClearSlot }) {
  const [selectedSquad, setSelectedSquad] = useState(1);
  const [pickingSlot, setPickingSlot] = useState(null);

  const currentSquadSlots = squads[selectedSquad] || {};
  const assignedIds = Object.values(currentSquadSlots).filter(Boolean);
  const synergy = getSquadSynergy(assignedIds);

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

  const renderSlotCard = (slot) => {
    const heroId = currentSquadSlots[slot.key];
    const hero = INITIAL_HEROES.find((h) => h.id === heroId);
    const p = hero ? progress[hero.id] || {} : null;

    return (
      <div
        key={slot.key}
        onClick={() => setPickingSlot(slot.key)}
        style={{
          backgroundColor: '#1e293b',
          border: hero ? `1px solid ${getRarityBorder(hero)}` : '1px dashed #475569',
          borderRadius: '10px',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
          minHeight: '115px',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '9px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
          {slot.label}
        </span>

        {hero ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearSlot(selectedSquad, slot.key);
              }}
              title="Remove from slot"
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={11} />
            </button>

            <HeroAvatar
              hero={hero}
              avatar={p.avatar}
              borderColor={getRarityBorder(hero)}
              size={44}
              editable={false}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '5px' }}>
              {getTypeIcon(hero.type)}
              <strong style={{ fontSize: '12px' }}>{hero.name}</strong>
            </div>

            <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '2px' }}>
              Lv.{p.level || 1} • {p.stars || 0}★
            </div>
          </>
        ) : (
          <div style={{ color: '#64748b', fontSize: '11px', padding: '12px 4px' }}>
            + Select Hero
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Squad Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {SQUAD_TABS.map((num) => (
          <button
            key={num}
            onClick={() => {
              setSelectedSquad(num);
              setPickingSlot(null);
            }}
            style={{
              ...styles.filterBtn(selectedSquad === num),
              flex: 1,
              padding: '8px',
              textAlign: 'center',
            }}
          >
            Squad {num}
          </button>
        ))}
      </div>

      {/* Synergy Banner */}
      <div
        style={{
          backgroundColor: '#1e293b',
          border: `1px solid ${synergy.bonus > 0 ? '#eab308' : '#334155'}`,
          borderRadius: '10px',
          padding: '10px 12px',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <Sparkles size={15} color={synergy.bonus > 0 ? '#facc15' : '#64748b'} />
          <strong style={{ fontSize: '13px', color: synergy.bonus > 0 ? '#facc15' : '#cbd5e1' }}>
            {synergy.label}
          </strong>
        </div>
        {synergy.counter && (
          <div style={{ fontSize: '11px', color: '#4ade80', marginLeft: '21px' }}>
            {synergy.counter}
          </div>
        )}
      </div>

      {/* Front Row (2 Slots) */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Users size={14} /> Front Row (Defense / Tank)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {SLOTS.filter((s) => s.row === 'front').map(renderSlotCard)}
        </div>
      </div>

      {/* Back Row (3 Slots) */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Users size={14} /> Back Row (Attack / Support)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {SLOTS.filter((s) => s.row === 'back').map(renderSlotCard)}
        </div>
      </div>

      {/* Hero Picker Modal */}
      {pickingSlot && (
        <HeroPickerModal
          selectedSquad={selectedSquad}
          progress={progress}
          squads={squads}
          onSelect={(heroId) => {
            onAssignSlot(selectedSquad, pickingSlot, heroId);
            setPickingSlot(null);
          }}
          onClose={() => setPickingSlot(null)}
        />
      )}
    </div>
  );
      }
      
