import React from 'react';
import { Crown, Lock, Unlock, RotateCcw, Plus, Minus, Shield, Sparkles, BookOpen, Award, FileCheck } from 'lucide-react';
import { OVERLORD_SKILLS, OVERLORD_STATS, createDefaultOverlord, calculateOverlordResources } from '../data/overlordData';
import HeroAvatar from './HeroAvatar';
import { styles } from '../styles';

const SQUAD_OPTIONS = Array.from({ length: 4 }, (_, i) => i + 1);
const SUB_STEPS = Array.from({ length: 5 }, (_, i) => i + 1);

export default function OverlordView({ overlord, onUpdateOverlord, onAssignOverlordSquad }) {
  const ov = overlord || createDefaultOverlord();
  const res = calculateOverlordResources(ov);

  const mockHeroForAvatar = { id: 'overlord', name: 'Overlord' };

  const handleReset = () => {
    if (!window.confirm('Reset all Overlord levels, training and skills?')) return;
    const preservedAvatar = ov.avatar;
    onUpdateOverlord({
      ...createDefaultOverlord(),
      avatar: preservedAvatar,
    });
  };

  const updateMainLevel = (rawVal) => {
    const parsed = Number(rawVal);
    const safe = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(60, safe));
    onUpdateOverlord({
      level: clamped,
      subLevel: clamped >= 60 ? 0 : ov.subLevel,
    });
  };

  const changeSubLevel = (delta) => {
    if (ov.level >= 60 && delta > 0) return;
    let totalSteps = (ov.level - 1) * 5 + (ov.subLevel || 0) + delta;
    if (totalSteps < 0) totalSteps = 0;
    if (totalSteps > 295) totalSteps = 295;
    const newLevel = Math.floor(totalSteps / 5) + 1;
    const newSub = newLevel >= 60 ? 0 : totalSteps % 5;
    onUpdateOverlord({ level: newLevel, subLevel: newSub });
  };

  const updateTraining = (statKey, rawVal) => {
    const parsed = Number(rawVal);
    const safe = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(200, safe));
    onUpdateOverlord({
      training: {
        ...(ov.training || { atk: 1, hp: 1, def: 1 }),
        [statKey]: clamped,
      },
    });
  };

  const updateSkill = (skillKey, rawVal) => {
    const parsed = Number(rawVal);
    const safe = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.max(1, Math.min(40, safe));
    onUpdateOverlord({
      skills: {
        ...(ov.skills || { strike: 1, roar: 1, armor: 1, instinct: 1 }),
        [skillKey]: clamped,
      },
    });
  };

  const numInputStyle = {
    width: '44px',
    textAlign: 'center',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    color: '#ffffff',
    borderRadius: '5px',
    padding: '3px 0',
    fontSize: '12px',
    fontWeight: 'bold',
  };
      return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Main Header Card with Avatar, Unlock, Reset & Squad Selector */}
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
              hero={mockHeroForAvatar}
              avatar={ov.avatar}
              borderColor="#ef4444"
              size={52}
              editable={true}
              onChangeAvatar={(imgData) => onUpdateOverlord({ avatar: imgData })}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Crown size={16} color="#facc15" />
                <strong style={{ fontSize: '17px', color: '#f8fafc' }}>Overlord (Gorilla)</strong>
              </div>
              <span style={{ fontSize: '11px', color: '#fca5a5' }}>
                {ov.unlocked ? `Active • Level ${ov.level} / 60` : 'Locked (Requires 100 Shards)'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={handleReset}
              title="Reset Overlord"
              style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              onClick={() => onUpdateOverlord({ unlocked: !ov.unlocked })}
              title={ov.unlocked ? 'Unlocked' : 'Locked'}
              style={{ background: 'none', border: 'none', color: ov.unlocked ? '#4ade80' : '#94a3b8', cursor: 'pointer', padding: '4px' }}
            >
              {ov.unlocked ? <Unlock size={17} /> : <Lock size={17} />}
            </button>
          </div>
        </div>

        {/* Squad Assignment (Squad 1 - 4) */}
        <div style={{ backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px', marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Shield size={13} color="#facc15" /> Assigned Squad:
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              type="button"
              onClick={() => onAssignOverlordSquad(null)}
              style={{ ...styles.filterBtn(ov.squad === null), flex: 1, textAlign: 'center', padding: '6px 4px', fontSize: '11px' }}
            >
              None
            </button>
            {SQUAD_OPTIONS.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onAssignOverlordSquad(num)}
                style={{ ...styles.filterBtn(ov.squad === num), flex: 1, textAlign: 'center', padding: '6px 4px', fontSize: '11px' }}
              >
                Squad {num}
              </button>
            ))}
          </div>
        </div>

        {/* Main Level (1-60) & Sub-Levels (0-5) */}
        <div style={{ backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Level:</span>
              <button type="button" onClick={() => updateMainLevel(ov.level - 1)} style={styles.smallBtn}>
                <Minus size={12} />
              </button>
              <input
                type="number"
                min="1"
                max="60"
                value={ov.level}
                onChange={(e) => updateMainLevel(e.target.value)}
                style={numInputStyle}
              />
              <button type="button" onClick={() => updateMainLevel(ov.level + 1)} style={styles.smallBtn}>
                <Plus size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {SUB_STEPS.map((step) => (
                <div
                  key={step}
                  style={{
                    width: '22px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: ov.level >= 60 || step <= (ov.subLevel || 0) ? '#facc15' : '#334155',
                  }}
                />
              ))}
              <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '4px' }}>
                {ov.level >= 60 ? 'MAX' : `${ov.subLevel || 0}/5 sub-lvl`}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '5px' }}>
            <button type="button" onClick={() => changeSubLevel(-1)} style={styles.smallBtn}>-1</button>
            <button type="button" onClick={() => changeSubLevel(1)} style={{ ...styles.smallBtn, backgroundColor: '#dc2626' }}>+1</button>
          </div>
        </div>
      </div>

      {/* Training Section (ATK, HP, DEF 1-200) */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <strong style={{ fontSize: '13px', color: '#f8fafc' }}>Combat Training</strong>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Max Lv. 200</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {OVERLORD_STATS.map((st) => {
            const val = (ov.training && ov.training[st.key]) || 1;
            return (
              <div key={st.key} style={{ backgroundColor: '#0f172a', padding: '8px 6px', borderRadius: '8px', textAlign: 'center', borderTop: `2px solid ${st.color}` }}>
                <div style={{ fontSize: '10px', color: st.color, fontWeight: 'bold', marginBottom: '5px' }}>
                  {st.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <button type="button" onClick={() => updateTraining(st.key, val - 1)} style={{ ...styles.smallBtn, padding: '4px 5px' }}>
                    <Minus size={11} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={val}
                    onChange={(e) => updateTraining(st.key, e.target.value)}
                    style={{ ...numInputStyle, width: '38px' }}
                  />
                  <button type="button" onClick={() => updateTraining(st.key, val + 1)} style={{ ...styles.smallBtn, padding: '4px 5px' }}>
                    <Plus size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      );
})}

      {/* 4 Overlord Skills (Unlocked at Lv. 1, 10, 20, 30) */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <strong style={{ fontSize: '13px', color: '#f8fafc' }}>Overlord Skills (4)</strong>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Max Lv. 40</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {OVERLORD_SKILLS.map((sk) => {
            const isUnlocked = ov.level >= sk.unlockLevel;
            const val = (ov.skills && ov.skills[sk.key]) || 1;
            return (
              <div
                key={sk.key}
                style={{
                  backgroundColor: '#0f172a',
                  padding: '8px',
                  borderRadius: '8px',
                  opacity: isUnlocked ? 1 : 0.5,
                  border: isUnlocked ? '1px solid #334155' : '1px dashed #334155',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: isUnlocked ? '#facc15' : '#94a3b8' }}>
                  {sk.name}
                </div>
                <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '6px' }}>
                  {isUnlocked ? sk.sub : `Unlocks at Overlord Lv.${sk.unlockLevel}`}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <button
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => updateSkill(sk.key, val - 1)}
                    style={{ ...styles.smallBtn, padding: '4px 6px' }}
                  >
                    <Minus size={11} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    disabled={!isUnlocked}
                    value={val}
                    onChange={(e) => updateSkill(sk.key, e.target.value)}
                    style={{ ...numInputStyle, width: '40px' }}
                  />
                  <button
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => updateSkill(sk.key, val + 1)}
                    style={{ ...styles.smallBtn, padding: '4px 6px' }}
                  >
                    <Plus size={11} />
                             {/* 4 Overlord Skills (Unlocked at Lv. 1, 10, 20, 30) */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <strong style={{ fontSize: '13px', color: '#f8fafc' }}>Overlord Skills (4)</strong>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Max Lv. 40</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {OVERLORD_SKILLS.map((sk) => {
            const isUnlocked = ov.level >= sk.unlockLevel;
            const val = (ov.skills && ov.skills[sk.key]) || 1;
            return (
              <div
                key={sk.key}
                style={{
                  backgroundColor: '#0f172a',
                  padding: '8px',
                  borderRadius: '8px',
                  opacity: isUnlocked ? 1 : 0.5,
                  border: isUnlocked ? '1px solid #334155' : '1px dashed #334155',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: isUnlocked ? '#facc15' : '#94a3b8' }}>
                  {sk.name}
                </div>
                <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '6px' }}>
                  {isUnlocked ? sk.sub : `Unlocks at Overlord Lv.${sk.unlockLevel}`}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <button
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => updateSkill(sk.key, val - 1)}
                    style={{ ...styles.smallBtn, padding: '4px 6px' }}
                  >
                    <Minus size={11} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    disabled={!isUnlocked}
                    value={val}
                    onChange={(e) => updateSkill(sk.key, e.target.value)}
                    style={{ ...numInputStyle, width: '40px' }}
                  />
                  <button
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => updateSkill(sk.key, val + 1)}
                    style={{ ...styles.smallBtn, padding: '4px 6px' }}
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Remaining Resources to Max Overlord */}
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
                  
