import React, { useState } from 'react';
import { Star, Shield, Plane, Rocket, Plus, Minus, Sparkles, Lock, Unlock, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateShardsNeeded } from '../data/heroesData';
import HeroSkillsSection from './HeroSkillsSection';
import { styles } from '../styles';

export default function HeroCard({ hero, progress, onUpdate, onChangeTier }) {
  const [showDetails, setShowDetails] = useState(true);
  const shards = calculateShardsNeeded(progress.stars, progress.tiers, progress.isPromotedUR);

  const getTypeIcon = (type) => {
    if (type === 'Tank') return <Shield size={16} color="#4ade80" />;
    if (type === 'Aircraft') return <Plane size={16} color="#38bdf8" />;
    return <Rocket size={16} color="#f87171" />;
  };

  const getRarityBorder = () => {
    const effectiveRarity = progress.isPromotedUR ? 'UR' : hero.rarity;
    if (effectiveRarity === 'UR') return '#eab308';
    if (effectiveRarity === 'SSR') return '#a855f7';
    return '#3b82f6';
  };

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        borderLeft: `5px solid ${getRarityBorder()}`,
        borderRadius: '10px',
        padding: '12px',
        opacity: progress.unlocked ? 1 : 0.6,
      }}
    >
      {/* Row 1: Name, Role, Squad, Unlock */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getTypeIcon(hero.type)}
          <strong style={{ fontSize: '16px' }}>{hero.name}</strong>
          <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#334155', color: '#cbd5e1' }}>
            {hero.role}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={progress.squad || ''}
            onChange={(e) => onUpdate(hero.id, { squad: e.target.value ? Number(e.target.value) : null })}
            style={{
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '4px 6px',
              fontSize: '12px',
            }}
          >
            <option value="">No Squad</option>
            <option value="1">Squad 1</option>
            <option value="2">Squad 2</option>
            <option value="3">Squad 3</option>
          </select>

          <button
            onClick={() => onUpdate(hero.id, { unlocked: !progress.unlocked })}
            title={progress.unlocked ? 'Unlocked' : 'Locked'}
            style={{ background: 'none', border: 'none', color: progress.unlocked ? '#4ade80' : '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            {progress.unlocked ? <Unlock size={16} /> : <Lock size={16} />}
          </button>
        </div>
      </div>

      {/* Row 2: Level & UR Promotion */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Level:</span>
          <button onClick={() => onUpdate(hero.id, { level: Math.max(1, progress.level - 1) })} style={styles.smallBtn}>
            <Minus size={14} />
          </button>
          <input
            type="number"
            min="1"
            max="175"
            value={progress.level}
            onChange={(e) => onUpdate(hero.id, { level: Math.max(1, Number(e.target.value)) })}
            style={{
              width: '48px',
              textAlign: 'center',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              color: '#fff',
              borderRadius: '6px',
              padding: '4px',
              fontWeight: 'bold',
            }}
          />
          <button onClick={() => onUpdate(hero.id, { level: progress.level + 1 })} style={styles.smallBtn}>
            <Plus size={14} />
          </button>
        </div>

        {hero.canPromoteUR && (
          <button
            onClick={() => onUpdate(hero.id, { isPromotedUR: !progress.isPromotedUR })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #eab308',
              backgroundColor: progress.isPromotedUR ? '#eab308' : 'transparent',
              color: progress.isPromotedUR ? '#0f172a' : '#eab308',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={12} />
            {progress.isPromotedUR ? 'Promoted UR' : `Promote UR (S${hero.promotionSeason})`}
          </button>
        )}
      </div>

      {/* Row 3: Stars, Tiers & Shards */}
      <div style={{ backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '4px' }}>
            {Array.from({ length: 5 }, (_, i) => i + 1).map((s) => (
              <Star
                key={s}
                size={16}
                fill={s <= progress.stars ? '#facc15' : 'none'}
                color={s <= progress.stars ? '#facc15' : '#475569'}
              />
            ))}
            <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '6px' }}>
              ({progress.tiers}/5 tiers)
            </span>
          </div>

          <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
            {progress.stars >= 5 ? (
              <span style={{ color: '#4ade80' }}>★ Max Stars Reached!</span>
            ) : (
              <>
                Next star: <strong style={{ color: '#facc15' }}>{shards.nextStar}</strong> shards • Max: <strong>{shards.maxStars}</strong>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => onChangeTier(hero.id, -1)} style={styles.smallBtn}>-1</button>
          <button onClick={() => onChangeTier(hero.id, 1)} style={{ ...styles.smallBtn, backgroundColor: '#2563eb' }}>+1</button>
        </div>
      </div>

      {/* Toggle Button & Skills/Weapon/Awakening Section */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          width: '100%',
          marginTop: '8px',
          padding: '6px',
          backgroundColor: 'transparent',
          border: '1px solid #334155',
          borderRadius: '6px',
          color: '#94a3b8',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          cursor: 'pointer',
        }}
      >
        {showDetails ? (
          <>Hide Skills & Weapon <ChevronUp size={14} /></>
        ) : (
          <>Show Skills & Weapon <ChevronDown size={14} /></>
        )}
      </button>

      {showDetails && (
        <HeroSkillsSection hero={hero} progress={progress} onUpdate={onUpdate} />
      )}
    </div>
  );
      }
              
