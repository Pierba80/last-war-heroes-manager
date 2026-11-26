import React from 'react';
import { Crown, Lock, Unlock, RotateCcw, Plus, Minus, Shield, Sparkles, BookOpen, Award, FileCheck, Star, Heart } from 'lucide-react';
import {
  OVERLORD_SKILLS,
  OVERLORD_STATS,
  SUB_ROMAN,
  getBondInfo,
  getMaxOverlordSkillLevel,
  createDefaultOverlord,
  calculateOverlordResources,
} from '../data/overlordData';
import HeroAvatar from './HeroAvatar';
import { calculateOverlordPower, formatPower } from '../utils/powerCalculator';
import { styles } from '../styles';

const SQUAD_OPTIONS = Array.from({ length: 4 }, (_, i) => i + 1);
const TIER_STARS = Array.from({ length: 7 }, (_, i) => i + 1);
const SUB_BARS = Array.from({ length: 10 }, (_, i) => i + 1);
const SKILL_STAR_LIST = Array.from({ length: 6 }, (_, i) => i + 1);

export default function OverlordView({ overlord, onUpdateOverlord, onAssignOverlordSquad }) {
  const ov = { ...createDefaultOverlord(), ...(overlord || {}) };
  const res = calculateOverlordResources(ov);
  const overlordPower = calculateOverlordPower(ov);
  const bondRank = Math.min(12, Math.max(1, ov.bondRank || 1));
  const bondSub = Math.min(10, Math.max(0, ov.bondProgress || 0));
  const bondSubRoman = bondSub === 0 ? '0' : SUB_ROMAN.at(bondSub - 1);
  const bondTotalLvl = (bondRank - 1) * 10 + bondSub;
  const bondInfo = getBondInfo(bondRank);
  const maxTrainCap = bondInfo.maxTrain;

  // Level 0-60: 1★ at Lv.0, 2★ at Lv.10, ..., 6★ at Lv.50, 7★ at Lv.60
  const currentLvl = Math.min(60, Math.max(0, ov.level ?? 1));
  const autoStars = Math.min(7, Math.floor(currentLvl / 10) + 1);
  const autoBars = currentLvl >= 60 ? 10 : currentLvl % 10;

  const handleReset = () => {
    if (!window.confirm('Reset all Overlord stats, bond and skills?')) return;
    onUpdateOverlord({
      ...createDefaultOverlord(),
      avatar: ov.avatar,
    });
  };

  const updateMainLevel = (rawVal) => {
    const parsed = Number(rawVal);
    const safe = Number.isNaN(parsed) ? 0 : parsed;
    const clamped = Math.max(0, Math.min(60, safe));
    onUpdateOverlord({
      level: clamped,
      tier: Math.min(7, Math.floor(clamped / 10) + 1),
    });
  };

  const updateBondRank = (newRank) => {
    const clampedRank = Math.max(1, Math.min(12, newRank));
    onUpdateOverlord({
      bondRank: clampedRank,
      bondProgress: clampedRank === 12 ? 10 : Math.min(10, bondSub),
    });
  };

  const updateBondSub = (newSub) => {
    const clamped = Math.max(0, Math.min(10, newSub));
    if (clamped === 10 && bondRank < 12) {
      onUpdateOverlord({
        bondRank: bondRank + 1,
        bondProgress: 0,
      });
    } else {
      onUpdateOverlord({ bondProgress: clamped });
    }
  };

  const updateTraining = (statKey, rawVal) => {
    const parsed = Number(rawVal);
    const safe = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(maxTrainCap, safe));
    onUpdateOverlord({
      training: {
        ...(ov.training || { atk: 1, def: 1, hp: 1 }),
        [statKey]: clamped,
      },
    });
  };

  const updateSkillStars = (skillKey, newStars) => {
    const clampedStars = Math.max(0, Math.min(6, newStars));
    const newMax = getMaxOverlordSkillLevel(clampedStars);
    const currentVal = (ov.skills && ov.skills[skillKey]) || 1;
    onUpdateOverlord({
      skillStars: {
        ...(ov.skillStars || {}),
        [skillKey]: clampedStars,
      },
      skills: {
        ...(ov.skills || {}),
        [skillKey]: Math.min(newMax, currentVal),
      },
    });
  };

  const updateSkillLevel = (skillKey, rawVal) => {
    const stars = (ov.skillStars && ov.skillStars[skillKey]) ?? 4;
    const maxLvl = getMaxOverlordSkillLevel(stars);
    const parsed = Number(rawVal);
    const safe = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(maxLvl, safe));
    onUpdateOverlord({
      skills: {
        ...(ov.skills || {}),
        [skillKey]: clamped,
      },
    });
  };

  const numInputStyle = {
    width: '48px',
    textAlign: 'center',
    backgroundColor: '#0f172a',
    border: '1px solid #475569',
    color: '#ffffff',
    borderRadius: '5px',
    padding: '4px 0',
    fontSize: '13px',
    fontWeight: 'bold',
  };
      return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div
        style={{
          backgroundColor: '#1e293b',
          borderLeft: '5px solid #ef4444',
          borderRadius: '10px',
          padding: '12px',
          opacity: ov.unlocked ? 1 : 0.75,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HeroAvatar
              hero={{ id: 'overlord', name: 'Overlord' }}
              avatar={ov.avatar}
              borderColor="#ef4444"
              size={52}
              editable={true}
              onChangeAvatar={(imgData) => onUpdateOverlord({ avatar: imgData })}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Crown size={16} color="#facc15" />
                <strong style={{ fontSize: '16px', color: '#f8fafc' }}>Overlord (Gorilla)</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px', pointerEvents: 'none' }}>
                {TIER_STARS.map((t) => (
                  <Star
                    key={t}
                    size={15}
                    fill={t <= autoStars ? '#facc15' : 'none'}
                    color={t <= autoStars ? '#facc15' : '#475569'}
                  />
                ))}
                <span style={{ fontSize: '10px', color: '#facc15', marginLeft: '5px', fontWeight: 'bold' }}>
                  Grade {autoStars}/7 • <span style={{ color: '#fb923c' }}>⚡ {formatPower(overlordPower)}</span>
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button type="button" onClick={handleReset} title="Reset Overlord" style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}>
              <RotateCcw size={16} />
            </button>
            <button type="button" onClick={() => onUpdateOverlord({ unlocked: !ov.unlocked })} style={{ background: 'none', border: 'none', color: ov.unlocked ? '#4ade80' : '#94a3b8', cursor: 'pointer', padding: '4px' }}>
              {ov.unlocked ? <Unlock size={17} /> : <Lock size={17} />}
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px', marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Shield size={13} color="#facc15" /> Assigned Squad:
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button type="button" onClick={() => onAssignOverlordSquad(null)} style={{ ...styles.filterBtn(ov.squad === null), flex: 1, textAlign: 'center', padding: '6px 2px', fontSize: '11px' }}>
              None
            </button>
            {SQUAD_OPTIONS.map((num) => (
              <button key={num} type="button" onClick={() => onAssignOverlordSquad(num)} style={{ ...styles.filterBtn(ov.squad === num), flex: 1, textAlign: 'center', padding: '6px 2px', fontSize: '11px' }}>
                S{num}
              </button>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>
                Overlord Level
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                Starts at 1★ • 7★ at Lv. 60 (Max)
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button type="button" onClick={() => updateMainLevel(currentLvl - 1)} style={styles.smallBtn}>
                <Minus size={14} />
              </button>
              <input
                type="number"
                min="0"
                max="60"
                value={currentLvl}
                onChange={(e) => updateMainLevel(e.target.value)}
                style={numInputStyle}
              />
              <button type="button" onClick={() => updateMainLevel(currentLvl + 1)} style={{ ...styles.smallBtn, backgroundColor: '#dc2626' }}>
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', pointerEvents: 'none' }}>
            {SUB_BARS.map((bar) => (
              <div
                key={bar}
                style={{
                  flex: 1,
                  height: '7px',
                  borderRadius: '2px',
                  backgroundColor: bar <= autoBars ? '#facc15' : '#334155',
                }}
              />
            ))}
            <span style={{ fontSize: '10px', color: '#facc15', marginLeft: '6px', fontWeight: 'bold', minWidth: '30px' }}>
              {currentLvl >= 60 ? 'MAX' : `${autoBars}/10`}
            </span>
          </div>
        </div>
      </div>

      {/* 12-Color Bond Rating (I-XII) + Roman Sub-Levels (I-X) = 120 Total */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '12px' }}>
        <div
          style={{
            backgroundColor: '#0f172a',
            padding: '10px',
            borderRadius: '8px',
            border: `2px solid ${bondInfo.color}`,
            marginBottom: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: bondInfo.color, fontSize: '13px', fontWeight: 'bold' }}>
                <Heart size={15} fill={bondInfo.color} /> Bond {bondInfo.roman}/XII • {bondInfo.label}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                Total Lv. {bondTotalLvl}/120 • Training Max Lv. {maxTrainCap}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button type="button" onClick={() => updateBondRank(bondRank - 1)} style={styles.smallBtn}>
                -
              </button>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: bondInfo.color, minWidth: '32px', textAlign: 'center' }}>
                {bondInfo.roman}
              </span>
              <button
                type="button"
                onClick={() => updateBondRank(bondRank + 1)}
                style={{ ...styles.smallBtn, backgroundColor: bondInfo.color, color: '#0f172a' }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
              Sub-level: <strong style={{ color: bondInfo.color }}>{bondSubRoman} / X</strong>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button type="button" onClick={() => updateBondSub(bondSub - 1)} style={{ ...styles.smallBtn, padding: '3px 7px' }}>
                -1
              </button>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: bondInfo.color, minWidth: '30px', textAlign: 'center' }}>
                {bondSubRoman}
              </span>
              <button type="button" onClick={() => updateBondSub(bondSub + 1)} style={{ ...styles.smallBtn, padding: '3px 7px' }}>
                +1
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', pointerEvents: 'none' }}>
            {SUB_BARS.map((bar) => (
              <div
                key={bar}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '2px',
                  backgroundColor: bar <= bondSub ? bondInfo.color : '#334155',
                }}
              />
            ))}
          </div>
        </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {OVERLORD_STATS.map((st) => {
            const val = (ov.training && ov.training[st.key]) || 1;
            return (
              <div
                key={st.key}
                style={{
                  backgroundColor: '#0f172a',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${st.color}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: st.color }}>
                    {st.label}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                    Max Lv. {maxTrainCap}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button type="button" onClick={() => updateTraining(st.key, val - 1)} style={styles.smallBtn}>
                    <Minus size={12} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={maxTrainCap}
                    value={val}
                    onChange={(e) => updateTraining(st.key, e.target.value)}
                    style={{ ...numInputStyle, width: '52px' }}
                  />
                  <button type="button" onClick={() => updateTraining(st.key, val + 1)} style={styles.smallBtn}>
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <strong style={{ fontSize: '13px', color: '#f8fafc' }}>Overlord Skills (5)</strong>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Tap ★ to set skill cap</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {OVERLORD_SKILLS.map((sk) => {
            const stars = (ov.skillStars && ov.skillStars[sk.key]) ?? 4;
            const maxSkillLvl = getMaxOverlordSkillLevel(stars);
            const val = Math.min(maxSkillLvl, (ov.skills && ov.skills[sk.key]) || 1);

            return (
              <div
                key={sk.key}
                style={{
                  backgroundColor: '#0f172a',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#facc15' }}>
                    {sk.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '3px' }}>
                    {SKILL_STAR_LIST.map((s) => (
                      <Star
                        key={s}
                        size={12}
                        onClick={() => updateSkillStars(sk.key, s)}
                        fill={s <= stars ? '#facc15' : 'none'}
                        color={s <= stars ? '#facc15' : '#475569'}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '4px' }}>
                      Max {maxSkillLvl}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <button type="button" onClick={() => updateSkillLevel(sk.key, val - 1)} style={{ ...styles.smallBtn, padding: '4px 6px' }}>
                    <Minus size={11} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={maxSkillLvl}
                    value={val}
                    onChange={(e) => updateSkillLevel(sk.key, e.target.value)}
                    style={{ ...numInputStyle, width: '40px', fontSize: '12px' }}
                  />
                  <button type="button" onClick={() => updateSkillLevel(sk.key, val + 1)} style={{ ...styles.smallBtn, padding: '4px 6px' }}>
                    <Plus size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSkillLevel(sk.key, maxSkillLvl)}
                    style={{ ...styles.smallBtn, padding: '4px 6px', backgroundColor: '#2563eb', fontSize: '10px' }}
                  >
                    MAX
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', border: '1px solid #ef4444', borderRadius: '10px', padding: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fca5a5', marginBottom: '8px' }}>
          Resources Needed to Max Overlord
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px' }}>
            <div style={{ color: '#facc15', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} /> Overlord Shards
            </div>
            <strong style={{ fontSize: '15px', color: '#fff' }}>{res.totalShards.toLocaleString()}</strong>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px' }}>
            <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={13} /> Skill Badges
            </div>
            <strong style={{ fontSize: '15px', color: '#fff' }}>{res.skillBadges.toLocaleString()}</strong>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px' }}>
            <div style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen size={13} /> Guidebooks
            </div>
            <strong style={{ fontSize: '15px', color: '#fff' }}>{res.guidebooks.toLocaleString()}</strong>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px' }}>
            <div style={{ color: '#fb923c', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileCheck size={13} /> Certificates
            </div>
            <strong style={{ fontSize: '15px', color: '#fff' }}>{res.certificates.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
