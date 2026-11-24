import React, { useState } from 'react';
import { Star, Shield, Plane, Rocket, Plus, Minus, Sparkles, Lock, Unlock, Sword, Wrench, RotateCcw, X } from 'lucide-react';
import { calculateShardsNeeded } from '../data/heroesData';
import HeroSkillsSection from './HeroSkillsSection';
import HeroGearSection from './HeroGearSection';
import HeroAvatar from './HeroAvatar';
import { styles } from '../styles';

const STAR_NUMBERS = Array.from({ length: 5 }, (_, i) => i + 1);

export default function HeroCard({ hero, progress, onUpdate, onChangeTier, onRemoveFromSquad }) {
  const [activeTab, setActiveTab] = useState('none');
  const shards = calculateShardsNeeded(progress.stars, progress.tiers, progress.isPromotedUR);

  const toggleTab = (tab) => {
    setActiveTab((prev) => (prev === tab ? 'none' : tab));
  };

  const handleResetHero = () => {
    if (!window.confirm(`Reset all stats, skills and gear for ${hero.name}?`)) return;
    onUpdate(hero.id, {
      unlocked: hero.rarity !== 'UR',
      isPromotedUR: false,
      level: 1,
      stars: 0,
      tiers: 0,
      skills: Array(3).fill(1),
      exclusiveWeaponLevel: 0,
      awakeningStars: 0,
      awakeningSkill: 1,
      gear: {
        railgun: { rarity: 'None', level: 0, stars: 0 },
        chip: { rarity: 'None', level: 0, stars: 0 },
        armor: { rarity: 'None', level: 0, stars: 0 },
        radar: { rarity: 'None', level: 0, stars: 0 },
      },
    });
  };

  const getTypeIcon = (type) => {
    if (type === 'Tank') return <Shield size={15} color="#4ade80" />;
    if (type === 'Aircraft') return <Plane size={15} color="#38bdf8" />;
    return <Rocket size={15} color="#f87171" />;
  };

  const getRarityBorder = () => {
    const effectiveRarity = progress.isPromotedUR ? 'UR' : hero.rarity;
    if (effectiveRarity === 'UR') return '#eab308';
    if (effectiveRarity === 'SSR') return '#a855f7';
    return '#3b82f6';
  };

  const tabBtnStyle = (isActive) => ({
    flex: 1,
    padding: '6px 8px',
    backgroundColor: isActive ? '#334155' : 'transparent',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: isActive ? '#facc15' : '#94a3b8',
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    cursor: 'pointer',
  });

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
      {/* Row 1: Avatar, Name, Role, Squad, Reset, Unlock */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <HeroAvatar
            hero={hero}
            avatar={progress.avatar}
            borderColor={getRarityBorder()}
            size={46}
            editable={true}
            onChangeAvatar={(imgData) => onUpdate(hero.id, { avatar: imgData })}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {getTypeIcon(hero.type)}
              <strong style={{ fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {hero.name}
              </strong>
            </div>
            <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#334155', color: '#cbd5e1', display: 'inline-block', marginTop: '3px' }}>
              {hero.role}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {progress.squad && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onRemoveFromSquad) {
                  onRemoveFromSquad(hero.id);
                } else {
                  onUpdate(hero.id, { squad: null });
                }
              }}
              title="Remove from Squad"
              style={{
                fontSize: '12px',
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #facc15',
                color: '#facc15',
                fontWeight: 'bold',
                marginRight: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
            >
              Squad {progress.squad} <X size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={handleResetHero}
            title="Reset Hero Setup"
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
          >
            <RotateCcw size={15} />
          </button>

          <button
            type="button"
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
          <button type="button" onClick={() => onUpdate(hero.id, { level: Math.max(1, progress.level - 1) })} style={styles.smallBtn}>
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
          <button type="button" onClick={() => onUpdate(hero.id, { level: progress.level + 1 })} style={styles.smallBtn}>
            <Plus size={14} />
          </button>
        </div>

        {hero.canPromoteUR && (
          <button
            type="button"
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
            {STAR_NUMBERS.map((s) => (
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
          <button type="button" onClick={() => onChangeTier(hero.id, -1)} style={styles.smallBtn}>-1</button>
          <button type="button" onClick={() => onChangeTier(hero.id, 1)} style={{ ...styles.smallBtn, backgroundColor: '#2563eb' }}>+1</button>
        </div>
      </div>

      {/* Toggle Tabs: Skills & Gear */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button type="button" onClick={() => toggleTab('skills')} style={tabBtnStyle(activeTab === 'skills')}>
          <Sword size={13} /> Skills & Weapon
        </button>
        <button type="button" onClick={() => toggleTab('gear')} style={tabBtnStyle(activeTab === 'gear')}>
          <Wrench size={13} /> Gear (4 Slots)
        </button>
      </div>

      {activeTab === 'skills' && (
        <HeroSkillsSection hero={hero} progress={progress} onUpdate={onUpdate} />
      )}

      {activeTab === 'gear' && (
        <HeroGearSection hero={hero} progress={progress} onUpdate={onUpdate} />
      )}
    </div>
  );
}
