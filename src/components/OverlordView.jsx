import React, { useState } from 'react';
import { Crown, Lock, Unlock, RotateCcw, Plus, Minus, Shield, Sparkles, BookOpen, Award, FileCheck, Star, Heart, Edit3 } from 'lucide-react';
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
  const [editingPower, setEditingPower] = useState(false);

  const res = calculateOverlordResources(ov);
  const overlordPower = calculateOverlordPower(ov);
  const bondRank = Math.min(12, Math.max(1, ov.bondRank || 1));
  const bondSub = Math.min(10, Math.max(0, ov.bondProgress || 0));
  const bondSubRoman = bondSub === 0 ? '0' : SUB_ROMAN.at(bondSub - 1);
  const bondTotalLvl = (bondRank - 1) * 10 + bondSub;
  const bondInfo = getBondInfo(bondRank);
  const maxTrainCap = bondInfo.maxTrain;

  const currentLvl = Math.min(60, Math.max(0, ov.level ?? 1));
  const autoStars = Math.min(7, Math.floor(currentLvl / 10) + 1);
  const autoBars = currentLvl >= 60 ? 10 : currentLvl % 10;

  const handleReset = () => {
    if (!window.confirm('Reset all Overlord stats, bond and skills?')) return;
    setEditingPower(false);
    onUpdateOverlord({
      ...createDefaultOverlord(),
      avatar: ov.avatar,
      manualPowerM: '',
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
          borderLeft: `5px solid ${model.color}`,
          borderRadius: '10px',
          padding: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              title="Tap to change Drone stage image"
              style={{
                width: '58px',
                height: '58px',
                minWidth: '58px',
                borderRadius: '10px',
                border: `2px solid ${model.color}`,
                backgroundColor: '#0f172a',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={currentAvatar}
                alt={model.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Camera size={13} color="#cbd5e1" style={{ position: 'absolute', bottom: '2px', right: '2px', opacity: 0.8 }} />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadStageImage}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Plane size={15} color={model.color} />
                <strong style={{ fontSize: '15px', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {model.code} "{model.name}"
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fb923c' }}>
                  ⚡ {formatPower(dronePower)}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingPower(!editingPower)}
                  style={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #fb923c',
                    color: '#fb923c',
                    borderRadius: '5px',
                    padding: '2px 7px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    cursor: 'pointer',
                  }}
                >
                  <Edit3 size={10} /> Set Power
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '3px' }}>
                {ABILITY_STARS.map((s) => (
                  <Star
                    key={s}
                    size={12}
                    fill={s <= abilityStars ? '#facc15' : 'none'}
                    color={s <= abilityStars ? '#facc15' : '#475569'}
                  />
                ))}
                <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '4px' }}>
                  Skill {abilityStars}★
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            title="Reset Drone"
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
                        {editingPower && (
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid #fb923c',
              borderRadius: '8px',
              padding: '8px 10px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '11px', color: '#fed7aa', fontWeight: 'bold' }}>
              Real Power (M):
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="text"
                inputMode="decimal"
                placeholder="e.g. 14.78"
                value={d.manualPowerM ?? ''}
                onChange={(e) => onUpdateDrone({ manualPowerM: e.target.value.replace(',', '.') })}
                style={{ ...numInputStyle, width: '75px', borderColor: '#fb923c' }}
              />
              <button
                type="button"
                onClick={() => onUpdateDrone({ manualPowerM: '' })}
                style={{ ...styles.smallBtn, fontSize: '10px', padding: '5px 7px' }}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setEditingPower(false)}
                style={{ ...styles.smallBtn, backgroundColor: '#16a34a', fontSize: '10px', padding: '5px 8px' }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            backgroundColor: '#0f172a',
            border: `1px solid ${model.color}`,
            borderRadius: '8px',
            padding: '7px 10px',
            marginBottom: '10px',
            fontSize: '11px',
            color: '#cbd5e1',
          }}
        >
          <strong style={{ color: model.color }}>Skin Bonus Active:</strong> {model.bonus}
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>
                Drone Level
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                {nextModel ? `Next skin: ${nextModel.code} at Lv.${nextModel.minLevel}` : 'Max Skin Unlocked (TD-6)'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button type="button" onClick={() => commitLevel((d.level || 1) - 1)} style={styles.smallBtn}>
                <Minus size={13} />
              </button>
              <input
                type="number"
                min="1"
                max="300"
                value={levelText}
                onChange={(e) => handleLevelInput(e.target.value)}
                onBlur={(e) => commitLevel(e.target.value)}
                style={{ ...numInputStyle, width: '54px', fontSize: '13px' }}
              />
              <button type="button" onClick={() => commitLevel((d.level || 1) + 1)} style={{ ...styles.smallBtn, backgroundColor: '#2563eb' }}>
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
            <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
              Critical Boost: <strong style={{ color: '#facc15' }}>Stage {d.critStage || 1}/5</strong>
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {CRIT_STAGES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onUpdateDrone({ critStage: st })}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    backgroundColor: (d.critStage || 1) === st ? '#eab308' : '#1e293b',
                    color: (d.critStage || 1) === st ? '#0f172a' : '#94a3b8',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '12px' }}>
        <div
          style={{
            backgroundColor: '#0f172a',
            border: `1px solid ${boostInfo.color}`,
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: boostInfo.color, fontSize: '13px', fontWeight: 'bold' }}>
              <Zap size={15} /> Combat Boost • Stage {boostInfo.stage}
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
              Presets: <strong>{boostInfo.presets}</strong> • Chip Boost: <strong style={{ color: '#facc15' }}>+{boostInfo.chipBoost}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button type="button" onClick={() => commitBoost((d.combatBoostLevel || 1) - 1)} style={{ ...styles.smallBtn, padding: '5px 7px' }}>
              -1
            </button>
            <input
              type="number"
              min="1"
              max="900"
              value={boostText}
              onChange={(e) => handleBoostInput(e.target.value)}
              onBlur={(e) => commitBoost(e.target.value)}
              style={{ ...numInputStyle, width: '54px', fontSize: '13px' }}
            />
            <button type="button" onClick={() => commitBoost((d.combatBoostLevel || 1) + 1)} style={{ ...styles.smallBtn, padding: '5px 7px', backgroundColor: '#2563eb' }}>
              +1
            </button>
          </div>
        </div>
      </div>
                  <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <strong style={{ fontSize: '13px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Layers size={14} color="#facc15" /> Skill Chips (Set {selectedChipSet})
          </strong>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>5★ Gold → 5★ Red</span>
        </div>

        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          {CHIP_SETS.map((setNum) => (
            <button
              key={setNum}
              type="button"
              onClick={() => setSelectedChipSet(setNum)}
              style={{ ...styles.filterBtn(selectedChipSet === setNum), flex: 1, textAlign: 'center', padding: '5px 4px', fontSize: '11px' }}
            >
              Set {setNum} (S{setNum})
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {CHIP_SLOTS.map((slot) => {
            const totalStars = activeSet[slot.key] || 0;
            const redCount = Math.max(0, totalStars - 5);
            const isRedPhase = totalStars > 5;

            return (
              <div
                key={slot.key}
                style={{
                  backgroundColor: '#0f172a',
                  border: `1px solid ${isRedPhase ? '#ef4444' : totalStars > 0 ? slot.color : '#334155'}`,
                  borderRadius: '8px',
                  padding: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: slot.color }}>
                    {slot.label}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: isRedPhase ? '#ef4444' : '#facc15' }}>
                    {isRedPhase ? `${redCount}★ Red` : `${totalStars}★`}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => changeChipStars(slot.key, -1)}
                    style={{ ...styles.smallBtn, padding: '3px 6px' }}
                  >
                    -1
                  </button>

                  <div style={{ display: 'flex', gap: '2px' }}>
                    {CHIP_STAR_LIST.map((s) => {
                      const isRed = s <= redCount;
                      const isYellow = !isRed && s <= totalStars;
                      const starColor = isRed ? '#ef4444' : isYellow ? '#facc15' : '#475569';
                      return (
                        <Star
                          key={s}
                          size={13}
                          fill={isRed || isYellow ? starColor : 'none'}
                          color={starColor}
                        />
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => changeChipStars(slot.key, 1)}
                    style={{ ...styles.smallBtn, padding: '3px 6px', backgroundColor: totalStars >= 5 ? '#dc2626' : '#2563eb' }}
                  >
                    +1
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <strong style={{ fontSize: '13px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Cpu size={14} color="#38bdf8" /> Drone Components (6)
          </strong>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>Level & Progress %</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {DRONE_COMPONENTS_LIST.map((comp) => {
            const item = (d.components && d.components[comp.key]) || { level: 1, pct: 0 };
            return (
              <div
                key={comp.key}
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#ef4444', marginBottom: '6px' }}>
                  {comp.label}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                  <div>
                    <div style={{ fontSize: '9px', color: '#94a3b8' }}>Lv.</div>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={item.level}
                      onChange={(e) => updateComponent(comp.key, 'level', e.target.value, 20)}
                      style={{ ...numInputStyle, width: '42px', padding: '2px 0' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', color: '#94a3b8' }}>Prog %</div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.pct}
                      onChange={(e) => updateComponent(comp.key, 'pct', e.target.value, 100)}
                      style={{ ...numInputStyle, width: '46px', padding: '2px 0' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', border: '1px solid #38bdf8', borderRadius: '10px', padding: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#7dd3fc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Sparkles size={14} /> Drone Upgrade Resources
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px' }}>
            <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Database size={13} /> Data to {res.nextModel ? res.nextModel.code : 'Lv.250'}
            </div>
            <strong style={{ fontSize: '14px', color: '#fff' }}>{formatPower(res.dataToNext)}</strong>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px' }}>
            <div style={{ color: '#facc15', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Settings size={13} /> Parts to {res.nextModel ? res.nextModel.code : 'Lv.250'}
            </div>
            <strong style={{ fontSize: '14px', color: '#fff' }}>{res.partsToNext.toLocaleString()}</strong>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px' }}>
            <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Database size={13} /> Total Data to Lv.250
            </div>
            <strong style={{ fontSize: '14px', color: '#cbd5e1' }}>{formatPower(res.dataTo250)}</strong>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px' }}>
            <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Settings size={13} /> Total Parts to Lv.250
            </div>
            <strong style={{ fontSize: '14px', color: '#cbd5e1' }}>{res.partsTo250.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
