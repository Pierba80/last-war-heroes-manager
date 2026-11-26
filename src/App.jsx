import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, Users, Shield, Copy, Calculator, Volume2, VolumeX, Crown, Plane } from 'lucide-react';
import { INITIAL_HEROES, createDefaultProgress } from './data/heroesData';
import { createDefaultOverlord } from './data/overlordData';
import { createDefaultDrone } from './data/droneData';
import HeroCard from './components/HeroCard';
import SquadsView from './components/SquadsView';
import ResourcesView from './components/ResourcesView';
import OverlordView from './components/OverlordView';
import DroneView from './components/DroneView';
import { musicPlayer } from './utils/musicPlayer';
import { styles } from './styles';

const STORAGE_KEY = 'last_war_heroes_progress_v1';
const SQUADS_STORAGE_KEY = 'last_war_squads_v1';
const OVERLORD_STORAGE_KEY = 'last_war_overlord_v1';
const DRONE_STORAGE_KEY = 'last_war_drone_v1';
const SQUAD_NUMBERS = Array.from({ length: 4 }, (_, i) => i + 1);

const DEFAULT_SQUADS = {
  1: { front1: null, front2: null, back1: null, back2: null, back3: null },
  2: { front1: null, front2: null, back1: null, back2: null, back3: null },
  3: { front1: null, front2: null, back1: null, back2: null, back3: null },
  4: { front1: null, front2: null, back1: null, back2: null, back3: null },
};

export default function App() {
  const [activeView, setActiveView] = useState('heroes');
  const [musicOn, setMusicOn] = useState(false);
  const fileInputRef = useRef(null);

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...createDefaultProgress(), ...JSON.parse(saved) };
      } catch (e) {
        return createDefaultProgress();
      }
    }
    return createDefaultProgress();
  });

  const [squads, setSquads] = useState(() => {
    const saved = localStorage.getItem(SQUADS_STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_SQUADS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SQUADS;
      }
    }
    return DEFAULT_SQUADS;
  });

  const [overlord, setOverlord] = useState(() => {
    const saved = localStorage.getItem(OVERLORD_STORAGE_KEY);
    if (saved) {
      try {
        return { ...createDefaultOverlord(), ...JSON.parse(saved) };
      } catch (e) {
        return createDefaultOverlord();
      }
    }
    return createDefaultOverlord();
  });

  const [drone, setDrone] = useState(() => {
    const saved = localStorage.getItem(DRONE_STORAGE_KEY);
    if (saved) {
      try {
        return { ...createDefaultDrone(), ...JSON.parse(saved) };
      } catch (e) {
        return createDefaultDrone();
      }
    }
    return createDefaultDrone();
  });

  const [filterType, setFilterType] = useState('All');
  const [filterSquad, setFilterSquad] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(SQUADS_STORAGE_KEY, JSON.stringify(squads));
  }, [squads]);

  useEffect(() => {
    localStorage.setItem(OVERLORD_STORAGE_KEY, JSON.stringify(overlord));
  }, [overlord]);

  useEffect(() => {
    localStorage.setItem(DRONE_STORAGE_KEY, JSON.stringify(drone));
  }, [drone]);

  useEffect(() => {
    return () => {
      musicPlayer.stop();
    };
  }, []);
        const handleToggleMusic = async () => {
    if (musicOn) {
      musicPlayer.stop();
      setMusicOn(false);
    } else {
      const started = await musicPlayer.start();
      setMusicOn(started);
    }
  };

  const updateHero = (id, changes) => {
    setProgress((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...changes },
    }));
  };

  const updateOverlord = (changes) => {
    setOverlord((prev) => ({
      ...prev,
      ...changes,
    }));
  };

  const updateDrone = (changes) => {
    setDrone((prev) => ({
      ...prev,
      ...changes,
    }));
  };

  const handleAssignOverlordSquad = (squadNum) => {
    setOverlord((prev) => ({
      ...prev,
      squad: squadNum,
    }));
  };

  const changeTier = (id, delta) => {
    const hero = progress[id];
    let totalTiers = hero.stars * 5 + hero.tiers + delta;
    if (totalTiers < 0) totalTiers = 0;
    if (totalTiers > 25) totalTiers = 25;
    updateHero(id, {
      stars: Math.floor(totalTiers / 5),
      tiers: totalTiers % 5,
    });
  };

  const syncHeroSquadBadges = (nextSquads) => {
    setProgress((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = { ...updated[id], squad: null };
      });
      SQUAD_NUMBERS.forEach((sqNum) => {
        const slots = nextSquads[sqNum] || {};
        Object.values(slots).forEach((heroId) => {
          if (heroId && updated[heroId]) {
            updated[heroId] = { ...updated[heroId], squad: sqNum };
          }
        });
      });
      return updated;
    });
  };

  const handleAssignSlot = (squadNum, slotKey, heroId) => {
    setSquads((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      SQUAD_NUMBERS.forEach((num) => {
        Object.keys(next[num]).forEach((k) => {
          if (next[num][k] === heroId) {
            next[num][k] = null;
          }
        });
      });
      next[squadNum][slotKey] = heroId;
      syncHeroSquadBadges(next);
      return next;
    });
  };

  const handleClearSlot = (squadNum, slotKey) => {
    setSquads((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[squadNum][slotKey] = null;
      syncHeroSquadBadges(next);
      return next;
    });
  };

  const handleResetSquad = (squadNum) => {
    setSquads((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[squadNum] = { front1: null, front2: null, back1: null, back2: null, back3: null };
      syncHeroSquadBadges(next);
      return next;
    });
    if (overlord.squad === squadNum) {
      updateOverlord({ squad: null });
    }
  };

  const handleRemoveHeroFromSquad = (heroId) => {
    setSquads((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      SQUAD_NUMBERS.forEach((num) => {
        Object.keys(next[num]).forEach((k) => {
          if (next[num][k] === heroId) {
            next[num][k] = null;
          }
        });
      });
      syncHeroSquadBadges(next);
      return next;
    });
  };

  const handleExport = () => {
    try {
      const backupPayload = JSON.stringify({ progress, squads, overlord, drone }, null, 2);
      const blob = new Blob([backupPayload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `last-war-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      alert('Export failed on this browser.');
    }
  };

  const handleCopyBackup = async () => {
    try {
      const backupPayload = JSON.stringify({ progress, squads, overlord, drone });
      await navigator.clipboard.writeText(backupPayload);
      alert('Backup copied to clipboard! Paste it in your Notes app to keep it safe.');
    } catch (err) {
      alert('Could not copy automatically. Use the Download button instead.');
    }
  };

  const handleImport = (event) => {
    const file = event.target.files?.item(0);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.progress) {
          setProgress({ ...createDefaultProgress(), ...imported.progress });
          if (imported.squads) {
            setSquads({ ...DEFAULT_SQUADS, ...imported.squads });
          }
          if (imported.overlord) {
            setOverlord({ ...createDefaultOverlord(), ...imported.overlord });
          }
          if (imported.drone) {
            setDrone({ ...createDefaultDrone(), ...imported.drone });
          }
        } else {
          setProgress({ ...createDefaultProgress(), ...imported });
        }
        alert('Backup imported successfully!');
      } catch (err) {
        alert('Invalid backup file.');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };
                                  const filteredHeroes = INITIAL_HEROES.filter((hero) => {
    const p = progress[hero.id];
    if (filterType !== 'All' && hero.type !== filterType) return false;
    if (filterSquad !== 'All' && String(p.squad) !== filterSquad) return false;
    if (search && !hero.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const navTabStyle = (active) => ({
    flex: 1,
    padding: '8px 2px',
    borderRadius: '8px',
    border: active ? '1px solid #facc15' : '1px solid #334155',
    backgroundColor: active ? '#1e293b' : '#0f172a',
    color: active ? '#facc15' : '#94a3b8',
    fontWeight: 'bold',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    cursor: 'pointer',
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <img
            src="/Logo.png"
            alt="Logo"
            style={{ maxHeight: '40px', maxWidth: '130px', objectFit: 'contain' }}
          />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#facc15',
              whiteSpace: 'nowrap',
              letterSpacing: '0.3px',
            }}
          >
            © Pīərbâ
          </span>
        </div>

        <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleToggleMusic}
            title={musicOn ? 'Music ON (Tap to mute)' : 'Music OFF (Tap to play)'}
            style={{
              ...styles.iconBtn,
              borderColor: musicOn ? '#facc15' : '#334155',
              color: musicOn ? '#facc15' : '#94a3b8',
            }}
          >
            {musicOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button type="button" onClick={handleCopyBackup} title="Copy Backup Text" style={styles.iconBtn}>
            <Copy size={16} />
          </button>
          <button type="button" onClick={handleExport} title="Download Backup File" style={styles.iconBtn}>
            <Download size={16} />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Import Backup File"
            style={styles.iconBtn}
          >
            <Upload size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
          />
        </div>
      </header>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        <button type="button" onClick={() => setActiveView('heroes')} style={navTabStyle(activeView === 'heroes')}>
          <Shield size={13} /> Heroes
        </button>
        <button type="button" onClick={() => setActiveView('overlord')} style={navTabStyle(activeView === 'overlord')}>
          <Crown size={13} /> Overlord
        </button>
        <button type="button" onClick={() => setActiveView('drone')} style={navTabStyle(activeView === 'drone')}>
          <Plane size={13} /> Drone
        </button>
        <button type="button" onClick={() => setActiveView('squads')} style={navTabStyle(activeView === 'squads')}>
          <Users size={13} /> Squads
        </button>
        <button type="button" onClick={() => setActiveView('resources')} style={navTabStyle(activeView === 'resources')}>
          <Calculator size={13} /> Resources
        </button>
      </div>

      {activeView === 'heroes' && (
        <div>
          <input
            type="text"
            placeholder="Search hero (e.g. Kimberly, Murphy...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.filterRow}>
            {['All', 'Tank', 'Aircraft', 'Missile'].map((type) => (
              <button key={type} type="button" onClick={() => setFilterType(type)} style={styles.filterBtn(filterType === type)}>
                {type}
              </button>
            ))}
          </div>

          <div style={{ ...styles.filterRow, marginBottom: '16px' }}>
            {[
              { label: 'All', val: 'All' },
              { label: 'S1', val: '1' },
              { label: 'S2', val: '2' },
              { label: 'S3', val: '3' },
              { label: 'S4', val: '4' },
            ].map((sq) => (
              <button key={sq.val} type="button" onClick={() => setFilterSquad(sq.val)} style={styles.filterBtn(filterSquad === sq.val)}>
                {sq.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredHeroes.map((hero) => (
              <HeroCard
                key={hero.id}
                hero={hero}
                progress={progress[hero.id]}
                onUpdate={updateHero}
                onChangeTier={changeTier}
                onRemoveFromSquad={handleRemoveHeroFromSquad}
              />
            ))}
          </div>
        </div>
      )}

      {activeView === 'overlord' && (
        <OverlordView
          overlord={overlord}
          onUpdateOverlord={updateOverlord}
          onAssignOverlordSquad={handleAssignOverlordSquad}
        />
      )}

      {activeView === 'drone' && (
        <DroneView
          drone={drone}
          onUpdateDrone={updateDrone}
        />
      )}

      {activeView === 'squads' && (
        <SquadsView
          progress={progress}
          squads={squads}
          overlord={overlord}
          drone={drone}
          onAssignSlot={handleAssignSlot}
          onClearSlot={handleClearSlot}
          onResetSquad={handleResetSquad}
          onRemoveOverlord={() => updateOverlord({ squad: null })}
        />
      )}

      {activeView === 'resources' && (
        <ResourcesView progress={progress} squads={squads} />
      )}
    </div>
  );
              }
            
