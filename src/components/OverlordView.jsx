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
                    size={14}
                    fill={t <= autoStars ? '#facc15' : 'none'}
                    color={t <= autoStars ? '#facc15' : '#475569'}
                  />
                ))}
                <span style={{ fontSize: '10px', color: '#facc15', marginLeft: '4px', fontWeight: 'bold' }}>
                  {autoStars}/7
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fb923c' }}>
                  ⚡ {formatPower(overlordPower)}
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
                placeholder="e.g. 5.06"
                value={ov.manualPowerM ?? ''}
                onChange={(e) => onUpdateOverlord({ manualPowerM: e.target.value.replace(',', '.') })}
                style={{ ...numInputStyle, width: '75px', borderColor: '#fb923c' }}
              />
              <button
                type="button"
                onClick={() => onUpdateOverlord({ manualPowerM: '' })}
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
