import React, { useState, useRef } from 'react';
import { Shield, Plane, Rocket, Users, X, Sparkles, RotateCcw, Image as ImageIcon, Crown, Edit3 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { INITIAL_HEROES } from '../data/heroesData';
import HeroAvatar from './HeroAvatar';
import HeroPickerModal from './HeroPickerModal';
import SquadExportCard from './SquadExportCard';
import { calculateHeroPower, calculateOverlordPower, formatPower } from '../utils/powerCalculator';
import { calculateDronePower, getDroneModelInfo } from '../data/droneData';
import { styles } from '../styles';

const SQUAD_TABS = Array.from({ length: 4 }, (_, i) => i + 1);

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

  const sorted = Object.entries(counts).sort((a, b) => b.at(1) - a.at(1));
  const topType = sorted.at(0).at(0);
  const topCount = sorted.at(0).at(1);
  const secondCount = sorted.at(1).at(1);

  let bonus = 0;
  let label = 'No Type Synergy (<3 same type)';

  if (topCount === 5) {
    bonus = 20;
    label = `5 ${topType} Heroes (+20% HP, ATK & DEF)`;
  } else if (topCount === 4) {
    bonus = 15;
    label = `4 ${topType} + 1 Mix (+15% HP, ATK & DEF)`;
  } else if (topCount === 3 && secondCount === 2) {
    bonus = 10;
    label = `3 ${topType} + 2 Same Type (+10% HP, ATK & DEF)`;
  } else if (topCount === 3) {
    bonus = 5;
    label = `3 ${topType} + 2 Mix (+5% HP, ATK & DEF)`;
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
  export default function SquadsView({
  progress,
  squads,
  overlord,
  drone,
  squadPowers = {},
  onUpdateSquadPower,
  onAssignSlot,
  onClearSlot,
  onResetSquad,
  onRemoveOverlord,
}) {
  const [selectedSquad, setSelectedSquad] = useState(1);
  const [pickingSlot, setPickingSlot] = useState(null);
  const [editingPower, setEditingPower] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSingleSquad, setExportSingleSquad] = useState(null);
  const exportRef = useRef(null);

  const currentSquadSlots = squads[selectedSquad] || {};
  const assignedIds = Object.values(currentSquadSlots).filter(Boolean);
  const synergy = getSquadSynergy(assignedIds);
  const hasOverlord = overlord && overlord.squad === selectedSquad;

  const heroesBasePower = assignedIds.reduce((sum, id) => {
    const h = INITIAL_HEROES.find((item) => item.id === id);
    return h ? sum + calculateHeroPower(h, progress[id]) : sum;
  }, 0);
  const ovPower = hasOverlord ? calculateOverlordPower(overlord) : 0;
  const dronePower = drone ? calculateDronePower(drone) : 0;
  const droneModel = drone ? getDroneModelInfo(drone.level || 1).current : null;
  const droneAvatar = drone && droneModel
    ? (drone.stageAvatars && drone.stageAvatars[droneModel.stage]) || droneModel.defaultImg
    : '/drone/td1.png';

  const autoSquadPower = Math.round(heroesBasePower + ovPower + dronePower);
  const manualM = squadPowers[selectedSquad];
  const hasManualPower = manualM !== undefined && manualM !== null && manualM !== '' && Number(manualM) > 0;
  const totalSquadPower = hasManualPower ? Math.round(Number(manualM) * 1_000_000) : autoSquadPower;

  const handleResetCurrentSquad = () => {
    if (assignedIds.length === 0 && !hasOverlord) return;
    if (window.confirm(`Clear all heroes from Squad ${selectedSquad}?`)) {
      onResetSquad(selectedSquad);
      if (onUpdateSquadPower) onUpdateSquadPower(selectedSquad, '');
    }
  };

  const triggerPngDownload = (singleSquadNum) => {
    if (!exportRef.current || isExporting) return;
    setIsExporting(true);
    setExportSingleSquad(singleSquadNum);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(exportRef.current, {
          backgroundColor: '#0f172a',
          scale: 2,
          useCORS: true,
        });
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const fileSuffix = singleSquadNum ? `squad-${singleSquadNum}` : 'all-squads';
          link.download = `last-war-${fileSuffix}-${new Date().toISOString().slice(0, 10)}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
      } catch (err) {
        alert('Could not generate PNG image.');
      } finally {
        setIsExporting(false);
        setExportSingleSquad(null);
      }
    }, 120);
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

  const renderSlotCard = (slot) => {
    const heroId = currentSquadSlots[slot.key];
    const hero = INITIAL_HEROES.find((h) => h.id === heroId);
    const p = hero ? progress[hero.id] || {} : null;
    const slotPower = hero ? calculateHeroPower(hero, p) : 0;

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
          minHeight: '124px',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '9px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
          {slot.label}
        </span>

        {hero ? (
          <>
            <button
              type="button"
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

            <div style={{ fontSize: '10px', color: '#fb923c', fontWeight: 'bold', marginTop: '2px' }}>
              ⚡ {formatPower(slotPower)}
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
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {SQUAD_TABS.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => {
              setSelectedSquad(num);
              setPickingSlot(null);
              setEditingPower(false);
            }}
            style={{
              ...styles.filterBtn(selectedSquad === num),
              flex: 1,
              padding: '8px 4px',
              textAlign: 'center',
              fontSize: '12px',
            }}
          >
            Squad {num}
          </button>
        ))}
      </div>

      <div
        style={{
          backgroundColor: '#1e293b',
          border: `1px solid ${synergy.bonus > 0 ? '#eab308' : '#334155'}`,
          borderRadius: '10px',
          padding: '10px 12px',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: '900', color: '#fb923c' }}>
                ⚡ Total: {formatPower(totalSquadPower)}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={13} color={synergy.bonus > 0 ? '#facc15' : '#64748b'} />
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: synergy.bonus > 0 ? '#facc15' : '#cbd5e1' }}>
                {synergy.label}
              </span>
            </div>
            {synergy.counter && (
              <div style={{ fontSize: '10px', color: '#4ade80', marginLeft: '18px' }}>
                {synergy.counter}
              </div>
            )}
          </div>

          {(assignedIds.length > 0 || hasOverlord) && (
            <button
              type="button"
              onClick={handleResetCurrentSquad}
              title="Clear squad"
              style={{
                backgroundColor: '#7f1d1d',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                borderRadius: '6px',
                padding: '6px 8px',
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
                {editingPower && (
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid #fb923c',
              borderRadius: '8px',
              padding: '8px 10px',
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '11px', color: '#fed7aa', fontWeight: 'bold' }}>
              Real Squad Power (M):
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="text"
                inputMode="decimal"
                placeholder="e.g. 74.11"
                value={squadPowers[selectedSquad] ?? ''}
                onChange={(e) => onUpdateSquadPower && onUpdateSquadPower(selectedSquad, e.target.value.replace(',', '.'))}
                style={{
                  width: '75px',
                  textAlign: 'center',
                  backgroundColor: '#1e293b',
                  border: '1px solid #fb923c',
                  color: '#ffffff',
                  borderRadius: '5px',
                  padding: '4px 0',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <button
                type="button"
                onClick={() => onUpdateSquadPower && onUpdateSquadPower(selectedSquad, '')}
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
      </div>

      {drone && droneModel && (
        <div
          style={{
            backgroundColor: '#0f172a',
            border: `1px solid ${droneModel.color}`,
            borderRadius: '10px',
            padding: '8px 10px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <img
              src={droneAvatar}
              alt={droneModel.name}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '7px',
                border: `1px solid ${droneModel.color}`,
                objectFit: 'cover',
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plane size={13} color={droneModel.color} />
                <strong style={{ fontSize: '12px', color: droneModel.color }}>
                  Drone {droneModel.code} • Lv.{drone.level || 1} ({formatPower(dronePower)})
                </strong>
              </div>
              <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
                Active Chip Set {selectedSquad} • Combat Boost Lv.{drone.combatBoostLevel || 1}
              </div>
            </div>
          </div>
        </div>
      )}

      {hasOverlord && (
        <div
          style={{
            backgroundColor: '#1e1b2e',
            border: '1px solid #ef4444',
            borderRadius: '10px',
            padding: '8px 10px',
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeroAvatar
              hero={{ id: 'overlord', name: 'Overlord' }}
              avatar={overlord.avatar}
              borderColor="#ef4444"
              size={34}
              editable={false}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Crown size={13} color="#facc15" />
                <strong style={{ fontSize: '12px', color: '#fca5a5' }}>
                  Overlord • Lv.{overlord.level || 1} ({formatPower(ovPower)})
                </strong>
              </div>
              <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
                ATK/DEF/PS: {overlord.training?.atk || 1}/{overlord.training?.def || 1}/{overlord.training?.hp || 1}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveOverlord}
            title="Remove Overlord from squad"
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '5px 8px',
              color: '#94a3b8',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            <X size={13} />
          </button>
        </div>
      )}
                    <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Users size={14} /> Front Row (Defense / Tank)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {SLOTS.filter((s) => s.row === 'front').map(renderSlotCard)}
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Users size={14} /> Back Row (Attack / Support)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {SLOTS.filter((s) => s.row === 'back').map(renderSlotCard)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button
          type="button"
          onClick={() => triggerPngDownload(selectedSquad)}
          disabled={isExporting}
          style={{
            padding: '11px 6px',
            borderRadius: '10px',
            backgroundColor: '#0f766e',
            border: '1px solid #14b8a6',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
        >
          <ImageIcon size={15} />
          {isExporting && exportSingleSquad === selectedSquad ? 'Generating...' : `Export S${selectedSquad} PNG`}
        </button>

        <button
          type="button"
          onClick={() => triggerPngDownload(null)}
          disabled={isExporting}
          style={{
            padding: '11px 6px',
            borderRadius: '10px',
            backgroundColor: '#1d4ed8',
            border: '1px solid #3b82f6',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
        >
          <ImageIcon size={15} />
          {isExporting && exportSingleSquad === null ? 'Generating...' : 'Export All (1–4)'}
        </button>
      </div>

      <SquadExportCard
        exportRef={exportRef}
        squads={squads}
        progress={progress}
        overlord={overlord}
        drone={drone}
        squadPowers={squadPowers}
        exportSingleSquad={exportSingleSquad}
        getSynergyFn={getSquadSynergy}
      />

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
