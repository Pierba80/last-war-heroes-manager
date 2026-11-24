import React, { useState, useEffect } from 'react';
import { Download, Upload } from 'lucide-react';
import { INITIAL_HEROES, createDefaultProgress } from './data/heroesData';
import HeroCard from './components/HeroCard';
import { styles } from './styles';

const STORAGE_KEY = 'last_war_heroes_progress_v1';

export default function App() {
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

  const [filterType, setFilterType] = useState('All');
  const [filterSquad, setFilterSquad] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateHero = (id, changes) => {
    setProgress((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...changes },
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

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `last-war-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImport = (event) => {
    const file = event.target.files.item(0);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setProgress({ ...createDefaultProgress(), ...imported });
        alert('Backup imported successfully!');
      } catch (err) {
        alert('Invalid backup file.');
      }
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

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={{ fontSize: '20px', margin: 0, color: '#facc15' }}>Last War Manager</h1>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Heroes & Shards Tracker</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExport} title="Export Backup" style={styles.iconBtn}>
            <Download size={18} />
          </button>
          <label title="Import Backup" style={styles.iconBtn}>
            <Upload size={18} />
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </header>

      <input
        type="text"
        placeholder="Search hero (e.g. Kimberly, Murphy...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      <div style={styles.filterRow}>
        {['All', 'Tank', 'Aircraft', 'Missile'].map((type) => (
          <button key={type} onClick={() => setFilterType(type)} style={styles.filterBtn(filterType === type)}>
            {type}
          </button>
        ))}
      </div>

      <div style={{ ...styles.filterRow, marginBottom: '16px' }}>
        {[
          { label: 'All', val: 'All' },
          { label: 'Squad 1', val: '1' },
          { label: 'Squad 2', val: '2' },
          { label: 'Squad 3', val: '3' },
        ].map((sq) => (
          <button key={sq.val} onClick={() => setFilterSquad(sq.val)} style={styles.filterBtn(filterSquad === sq.val)}>
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
          />
        ))}
      </div>
    </div>
  );
      }
