import React, { useRef, useState, useEffect } from 'react';
import { Plane, Plus, Minus, RotateCcw, Sparkles, Database, Settings, Cpu, Zap, Camera, Star, Layers } from 'lucide-react';
import {
  DRONE_COMPONENTS_LIST,
  getDroneModelInfo,
  getDroneAbilityStars,
  getCombatBoostInfo,
  createDefaultDrone,
  calculateDronePower,
  calculateDroneResources,
} from '../data/droneData';
import { formatPower } from '../utils/powerCalculator';
import { styles } from '../styles';

const CRIT_STAGES = Array.from({ length: 5 }, (_, i) => i + 1);
const ABILITY_STARS = Array.from({ length: 6 }, (_, i) => i + 1);
const CHIP_SETS = Array.from({ length: 4 }, (_, i) => i + 1);
const CHIP_STAR_LIST = Array.from({ length: 5 }, (_, i) => i + 1);

const CHIP_SLOTS = [
  { key: 'top', label: 'Chip Attacco (Top)', color: '#f87171' },
  { key: 'center', label: 'Chip Nucleo (Center)', color: '#facc15' },
  { key: 'left', label: 'Chip Energia (Left)', color: '#38bdf8' },
  { key: 'right', label: 'Chip Difesa (Right)', color: '#4ade80' },
];

export default function DroneView({ drone, onUpdateDrone }) {
  const d = { ...createDefaultDrone(), ...(drone || {}) };
  const fileInputRef = useRef(null);
  const [selectedChipSet, setSelectedChipSet] = useState(1);

  const [levelText, setLevelText] = useState(String(d.level || 1));
  const [boostText, setBoostText] = useState(String(d.combatBoostLevel || 1));

  useEffect(() => {
    setLevelText(String(d.level || 1));
  }, [d.level]);

  useEffect(() => {
    setBoostText(String(d.combatBoostLevel || 1));
  }, [d.combatBoostLevel]);

  const { current: model, next: nextModel } = getDroneModelInfo(d.level || 1);
  const abilityStars = getDroneAbilityStars(d.level || 1);
  const boostInfo = getCombatBoostInfo(d.combatBoostLevel || 1);
  const dronePower = calculateDronePower(d);
  const res = calculateDroneResources(d);

  const currentAvatar = (d.stageAvatars && d.stageAvatars[model.stage]) || model.defaultImg;
  const activeSet = (d.chipSets && d.chipSets[selectedChipSet]) || { squad: selectedChipSet, top: 0, center: 0, left: 0, right: 0 };

  const handleReset = () => {
    if (!window.confirm('Reset Drone level, components, boost and chips?')) return;
    onUpdateDrone({
      ...createDefaultDrone(),
      stageAvatars: d.stageAvatars || {},
    });
  };

  const handleUploadStageImage = (e) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdateDrone({
        stageAvatars: {
          ...(d.stageAvatars || {}),
          [model.stage]: ev.target.result,
        },
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const commitLevel = (rawVal) => {
    if (rawVal === '') {
      setLevelText('1');
      onUpdateDrone({ level: 1 });
      return;
    }
    const parsed = Number(rawVal);
    const safe = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(300, safe));
    setLevelText(String(clamped));
    onUpdateDrone({ level: clamped });
  };

  const handleLevelInput = (val) => {
    setLevelText(val);
    if (val !== '' && !Number.isNaN(Number(val))) {
      const clamped = Math.max(1, Math.min(300, Number(val)));
      onUpdateDrone({ level: clamped });
    }
  };

  const commitBoost = (rawVal) => {
    if (rawVal === '') {
      setBoostText('1');
      onUpdateDrone({ combatBoostLevel: 1 });
      return;
    }
    const parsed = Number(rawVal);
    const safe = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(900, safe));
    setBoostText(String(clamped));
    onUpdateDrone({ combatBoostLevel: clamped });
  };

  const handleBoostInput = (val) => {
    setBoostText(val);
    if (val !== '' && !Number.isNaN(Number(val))) {
      const clamped = Math.max(1, Math.min(900, Number(val)));
      onUpdateDrone({ combatBoostLevel: clamped });
    }
  };

  const updateComponent = (key, field, rawVal, maxVal) => {
    const parsed = rawVal === '' ? 0 : Number(rawVal);
    const safe = Number.isNaN(parsed) ? 0 : parsed;
    const clamped = Math.max(0, Math.min(maxVal, safe));
    onUpdateDrone({
      components: {
        ...(d.components || {}),
        [key]: {
          ...((d.components && d.components[key]) || { level: 1, pct: 0 }),
          [field]: clamped,
        },
      },
    });
  };

  const updateChipStars = (slotKey, starVal) => {
    const nextStar = activeSet[slotKey] === starVal ? starVal - 1 : starVal;
    onUpdateDrone({
      chipSets: {
        ...(d.chipSets || {}),
        [selectedChipSet]: {
          ...activeSet,
          [slotKey]: Math.max(0, nextStar),
        },
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
    fontSize: '12px',
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
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fb923c', marginTop: '2px' }}>
                ⚡ {formatPower(dronePower)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
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

      {/* Combat Boost */}
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
              {/* Skill Chips (4 Sets for Squads 1-4) */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <strong style={{ fontSize: '13px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Layers size={14} color="#facc15" /> Skill Chips (Set {selectedChipSet})
          </strong>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>Tap ★ to set chip stars</span>
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
            const stars = activeSet[slot.key] || 0;
            return (
              <div
                key={slot.key}
                style={{
                  backgroundColor: '#0f172a',
                  border: `1px solid ${stars > 0 ? slot.color : '#334155'}`,
                  borderRadius: '8px',
                  padding: '8px',
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: slot.color, marginBottom: '5px' }}>
                  {slot.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {CHIP_STAR_LIST.map((s) => (
                    <Star
                      key={s}
                      size={14}
                      onClick={() => updateChipStars(slot.key, s)}
                      fill={s <= stars ? '#facc15' : 'none'}
                      color={s <= stars ? '#facc15' : '#475569'}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                  <span style={{ fontSize: '10px', color: '#cbd5e1', marginLeft: '4px', fontWeight: 'bold' }}>
                    {stars}★
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Drone Components */}
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

      {/* Resources Needed */}
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
        
