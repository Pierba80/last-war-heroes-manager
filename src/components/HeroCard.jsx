import React, { useState } from 'react';
import { Shield, Plane, Rocket, Star, Lock, Unlock, ChevronDown, ChevronUp, Sparkles, RotateCcw } from 'lucide-react';
import { calculateShardsNeeded } from '../data/heroesData';
import HeroAvatar from './HeroAvatar';
import HeroSkillsSection from './HeroSkillsSection';
import HeroGearSection from './HeroGearSection';
import { calculateHeroPower, formatPower } from '../utils/powerCalculator';
import { styles } from '../styles';

const STAR_INDEXES = Array.from({ length: 5 }, (_, i) => i + 1);
const TIER_INDEXES = Array.from({ length: 5 }, (_, i) => i + 1);

export default function HeroCard({ hero, progress, onUpdate, onChangeTier, onRemoveFromSquad }) {
  const [expanded, setExpanded] = useState(false);
  const p = progress;
  const heroPower = calculateHeroPower(hero, p);
  const shards = calculateShardsNeeded(p.stars, p.tiers, p.isPromotedUR);

  const handleResetHero = () => {
    if (!window.confirm(`Reset all stats, skills and gear for ${hero.name}?`)) return;
    if (onRemoveFromSquad) {
      onRemoveFromSquad(hero.id);
    }
    onUpdate(hero.id, {
      unlocked: false,
      isPromotedUR: false,
      level: 1,
      stars: 0,
      tiers: 0,
      squad: null,
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

  const getRarityColor = (rarity, isPromoted) => {
    const effectiveRarity = isPromoted ? 'UR' : rarity;
    if (effectiveRarity === 'UR') return '#eab308';
    if (effectiveRarity === 'SSR') return '#a855f7';
    return '#3b82f6';
  };

  const borderColor = getRarityColor(hero.rarity, p.isPromotedUR);

  return (
    <div style={{ ...styles.card, borderLeft: `5px solid ${borderColor}`, opacity: p.unlocked ? 1 : 0.65 }}>
      {/* Top Row: Avatar + Name + Power + Squad Badge + Lock */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <HeroAvatar
            hero={hero}
            avatar={p.avatar}
            borderColor={borderColor}
            size={48}
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
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {hero.role} {p.isPromotedUR && '(Promoted UR)'} •{' '}
              <strong style={{ color: '#fb923c' }}>⚡ {formatPower(heroPower)}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {p.squad && (
            <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#334155', color: '#facc15', fontWeight: 'bold' }}>
              S{p.squad}
            </span>
          )}

          <button
            type="button"
            onClick={handleResetHero}
            title={`Reset ${hero.name}`}
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '3px' }}
          >
            <RotateCcw size={15} />
          </button>

          <button
            type="button"
            onClick={() => onUpdate(hero.id, { unlocked: !p.unlocked })}
            title={p.unlocked ? 'Unlocked' : 'Locked'}
            style={{ background: 'none', border: 'none', color: p.unlocked ? '#4ade80' : '#94a3b8', cursor: 'pointer', padding: '3px' }}
          >
            {p.unlocked ? <Unlock size={17} /> : <Lock size={17} />}
          </button>
        </div>
      </div>
                        {/* SSR -> UR Promotion Toggle */}
      {hero.canPromoteUR && (
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '6px 10px', borderRadius: '8px' }}>
          <span style={{ fontSize: '11px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={13} color="#eab308" /> UR Promotion (Season)
          </span>
          <button
            type="button"
            onClick={() => onUpdate(hero.id, { isPromotedUR: !p.isPromotedUR })}
            style={{
              padding: '3px 8px',
              borderRadius: '5px',
              border: 'none',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: p.isPromotedUR ? '#eab308' : '#334155',
              color: p.isPromotedUR ? '#0f172a' : '#cbd5e1',
            }}
          >
            {p.isPromotedUR ? 'UR Active' : 'Promote to UR'}
          </button>
        </div>
      )}

      {/* Stars & Tiers Control */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px', marginBottom: '10px' }}>
        <div>
          <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
            {STAR_INDEXES.map((s) => (
              <Star
                key={s}
                size={15}
                fill={s <= p.stars ? '#facc15' : 'none'}
                color={s <= p.stars ? '#facc15' : '#475569'}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {TIER_INDEXES.map((t) => (
              <div
                key={t}
                style={{
                  width: '18px',
                  height: '5px',
                  borderRadius: '2px',
                  backgroundColor: p.stars === 5 || t <= p.tiers ? '#38bdf8' : '#334155',
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button type="button" onClick={() => onChangeTier(hero.id, -1)} style={styles.smallBtn}>
            -1
          </button>
          <button type="button" onClick={() => onChangeTier(hero.id, 1)} style={{ ...styles.smallBtn, backgroundColor: '#2563eb' }}>
            +1
          </button>
        </div>
      </div>

      {/* Level & Shards Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#cbd5e1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>EXP Lv:</span>
          <input
            type="number"
            min="1"
            max="200"
            value={p.level}
            onChange={(e) => onUpdate(hero.id, { level: Math.max(1, Number(e.target.value)) })}
            style={styles.numInput}
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          {p.stars < 5 ? (
            <>
              <div>Next ★: <strong style={{ color: '#38bdf8' }}>{shards.nextStar}</strong> shards</div>
              <div>To 5★: <strong style={{ color: '#facc15' }}>{shards.maxStars}</strong> shards</div>
            </>
          ) : (
            <strong style={{ color: '#4ade80' }}>MAX 5 STARS</strong>
          )}
        </div>
      </div>

      {/* Expandable Details: Skills, Exclusive Weapon, Awakening & Gear */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          marginTop: '10px',
          padding: '7px',
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '6px',
          color: '#cbd5e1',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          cursor: 'pointer',
        }}
      >
        {expanded ? (
          <>Hide Skills, Weapon & Gear <ChevronUp size={15} /></>
        ) : (
          <>Edit Skills, Weapon & Gear <ChevronDown size={15} /></>
        )}
      </button>

      {expanded && (
        <>
          <HeroSkillsSection hero={hero} progress={p} onUpdate={onUpdate} />
          <HeroGearSection hero={hero} progress={p} onUpdate={onUpdate} />
        </>
      )}
    </div>
  );
          }
