import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TaskCard } from './components/TaskCard';
import { AddKidTaskModal } from './components/modals/AddKidTaskModal';
import { RewardsModal } from './components/modals/RewardsModal';
import { SoundPickerModal } from './components/modals/SoundPickerModal';
import { ToonRosterModal } from './components/modals/ToonRosterModal';
import { GamesModal } from './components/modals/GamesModal';
import { StoreModal, StoreItem, DEFAULT_STORE_ITEMS } from './components/modals/StoreModal';

import { KidTask, KidReward, SoundType, VoiceStyle, BgmTrack, KidProfileId } from './types';
import { INITIAL_KID_TASKS, INITIAL_REWARDS, MORNING_ROUTINE_PRESETS } from './utils/sampleData';
import { ALL_DANDYS_WORLD_TOONS, KID_PROFILES } from './utils/toonsData';
import { speakCheer, startBgmLoop, stopBgmLoop } from './utils/audio';

const KID_STORAGE_KEY = 'kid_reminder_system_v1';

export function App() {
  const [activeProfileId, setActiveProfileId] = useState<KidProfileId>('althea');
  const [tasks, setTasks] = useState<KidTask[]>([]);
  const [rewards, setRewards] = useState<KidReward[]>([]);
  const [purchasedItemIds, setPurchasedItemIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [soundType, setSoundType] = useState<SoundType>('superstar');
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>('filipino');
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [activeToonId, setActiveToonId] = useState<string>('althea');
  const [currentBgm, setCurrentBgm] = useState<BgmTrack>('garden');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState<boolean>(false);
  const [isSoundPickerOpen, setIsSoundPickerOpen] = useState<boolean>(false);
  const [isToonRosterOpen, setIsToonRosterOpen] = useState<boolean>(false);
  const [isGamesModalOpen, setIsGamesModalOpen] = useState<boolean>(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const activeProfile = KID_PROFILES.find(p => p.id === activeProfileId) || KID_PROFILES[0];

  // Load stored kid data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KID_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTasks(parsed.tasks || INITIAL_KID_TASKS);
        setRewards(parsed.rewards || INITIAL_REWARDS);
        setPurchasedItemIds(parsed.purchasedItemIds || []);
        setSoundEnabled(parsed.soundEnabled ?? true);
        setSoundType(parsed.soundType || 'superstar');
        setVoiceStyle(parsed.voiceStyle || 'filipino');
        setSelectedVoiceName(parsed.selectedVoiceName || '');
        setActiveToonId(parsed.activeToonId || 'althea');
        setCurrentBgm(parsed.currentBgm || 'garden');
        setTheme(parsed.theme || 'light');
      } else {
        setTasks(INITIAL_KID_TASKS);
        setRewards(INITIAL_REWARDS);
      }
    } catch (e) {
      setTasks(INITIAL_KID_TASKS);
      setRewards(INITIAL_REWARDS);
    }
    setDataLoaded(true);
  }, []);

  // Save on change
  useEffect(() => {
    if (!dataLoaded) return;
    try {
      localStorage.setItem(KID_STORAGE_KEY, JSON.stringify({
        tasks, rewards, purchasedItemIds, soundEnabled, soundType, voiceStyle, selectedVoiceName, activeToonId, currentBgm, theme
      }));
    } catch (e) {}
  }, [tasks, rewards, purchasedItemIds, soundEnabled, soundType, voiceStyle, selectedVoiceName, activeToonId, currentBgm, theme, dataLoaded]);

  // Handle BGM background audio playback
  useEffect(() => {
    if (dataLoaded) {
      if (currentBgm !== 'off') {
        startBgmLoop(currentBgm);
      } else {
        stopBgmLoop();
      }
    }
    return () => {
      stopBgmLoop();
    };
  }, [currentBgm, dataLoaded]);

  // Set Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Compute total stars earned
  const totalStars = tasks.filter(t => t.completed).reduce((sum, t) => sum + (t.stars || 1), 0);

  // Filter tasks
  const filteredTasks = activeCategory === 'all'
    ? tasks
    : tasks.filter(t => t.category === activeCategory);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Task Handlers
  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleAddTask = (newTask: Omit<KidTask, 'id' | 'completed'>) => {
    const task: KidTask = {
      ...newTask,
      id: 'task-' + Date.now(),
      completed: false
    };
    setTasks(prev => [task, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleClaimReward = (rewardId: string) => {
    setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, unlocked: true } : r));
  };

  const handleAddCustomReward = (newReward: KidReward) => {
    setRewards(prev => [...prev, newReward]);
  };

  const handleDeleteReward = (rewardId: string) => {
    setRewards(prev => prev.filter(r => r.id !== rewardId));
  };

  // Store Handlers
  const handleBuyStoreItem = (item: StoreItem) => {
    if (!purchasedItemIds.includes(item.id)) {
      setPurchasedItemIds(prev => [...prev, item.id]);
    }

    // Add unlocked reward to prize chest
    const newReward: KidReward = {
      id: 'store-rew-' + Date.now(),
      name: item.name,
      starsNeeded: item.cost,
      unlocked: true,
      icon: item.icon,
      category: 'gift'
    };
    setRewards(prev => [...prev, newReward]);
  };

  const handleAddCustomStoreItem = (item: StoreItem) => {
    const customReward: KidReward = {
      id: item.id,
      name: item.name,
      starsNeeded: item.cost,
      unlocked: false,
      icon: item.icon,
      category: 'gift'
    };
    setRewards(prev => [...prev, customReward]);
  };

  // Quick Add Morning Routine Preset
  const handleAddMorningRoutine = () => {
    const newMorningTasks: KidTask[] = MORNING_ROUTINE_PRESETS.map((preset, idx) => ({
      ...preset,
      id: 'morn-' + Date.now() + '-' + idx,
      completed: false
    }));

    const otherTasks = tasks.filter(t => t.category !== 'morning');
    setTasks([...newMorningTasks, ...otherTasks]);
    
    if (soundEnabled) {
      const cheerMsg = voiceStyle === 'filipino'
        ? "Loaded na ang Morning Routine! Handa ka na ba para sa masayang araw! 🌅"
        : "Morning Routine loaded! Time for a fantastic start to your day! 🌅";
      speakCheer(cheerMsg, voiceStyle, selectedVoiceName);
    }
  };

  const activeToon = ALL_DANDYS_WORLD_TOONS.find(t => t.id === activeToonId) || ALL_DANDYS_WORLD_TOONS[0];

  const handleSwitchProfile = (pId: KidProfileId) => {
    setActiveProfileId(pId);
    const targetProf = KID_PROFILES.find(p => p.id === pId) || KID_PROFILES[0];
    setActiveToonId(targetProf.favoriteToonId);

    if (soundEnabled) {
      const cheerText = voiceStyle === 'filipino'
        ? targetProf.greetingMsgTagalog
        : targetProf.greetingMsgEnglish;
      speakCheer(cheerText, voiceStyle, selectedVoiceName);
    }
  };

  const handleAddBonusStars = (amount: number) => {
    const bonusTask: KidTask = {
      id: 'bonus-game-' + Date.now(),
      title: `🎮 Arcade Mini-Game Bonus Reward!`,
      icon: '🎰',
      category: 'afternoon',
      completed: true,
      stars: amount,
      notes: `Earned by ${activeProfile.name} in Toon Arcade!`
    };
    setTasks(prev => [bonusTask, ...prev]);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset to standard daily morning, school, and bedtime routine?')) {
      setTasks(INITIAL_KID_TASKS);
      setRewards(INITIAL_REWARDS);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Kid Navbar Header */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        totalStars={totalStars}
        openAddModal={() => setIsAddModalOpen(true)}
        soundEnabled={soundEnabled}
        toggleSound={() => setSoundEnabled(!soundEnabled)}
        soundType={soundType}
        openSoundPicker={() => setIsSoundPickerOpen(true)}
        theme={theme}
        toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        openRewardsModal={() => setIsRewardsModalOpen(true)}
        activeToon={activeToon}
        openToonRosterModal={() => setIsToonRosterOpen(true)}
        currentBgm={currentBgm}
        toggleBgm={() => setCurrentBgm(prev => prev === 'garden' ? 'elevator' : (prev === 'elevator' ? 'off' : 'garden'))}
        activeProfile={activeProfile}
        onSwitchProfile={handleSwitchProfile}
        openGamesModal={() => setIsGamesModalOpen(true)}
        openStoreModal={() => setIsStoreModalOpen(true)}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: '1.25rem 1rem' }}>
        
        {/* Active Toon Companion Cheer Card */}
        <div className="kid-card" style={{
          marginBottom: '1.25rem',
          background: `linear-gradient(135deg, ${activeToon.color}30 0%, ${activeToon.secondaryColor} 100%)`,
          borderColor: activeToon.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div className="animate-toon-jiggle" style={{
              width: '64px',
              height: '64px',
              borderRadius: '22px',
              backgroundColor: activeToon.color,
              border: 'var(--border-width) solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: 'var(--shadow-toon)'
            }}>
              {activeToon.avatar}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Active Toon Companion:
              </div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {activeToon.name} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>({activeToon.title})</span>
              </h2>
              <p style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                "{activeToon.quote}"
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsToonRosterOpen(true)}
            className="btn-kid btn-kid-gold"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
          >
            🎭 Change Toon ({ALL_DANDYS_WORLD_TOONS.length} Total)
          </button>
        </div>

        {/* Progress Bar & Cheer Widget */}
        <div className="kid-card" style={{ marginBottom: '1.25rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              🚀 Daily Star Progress
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-green)', fontWeight: 800 }}>
              {completedCount} of {tasks.length} Completed! ({progressPct}%)
            </span>
          </div>

          <div className="kid-progress-bg">
            <div className="kid-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>

          {progressPct === 100 && (
            <div style={{ marginTop: '0.75rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#10b981', color: '#fff', textAlign: 'center', fontWeight: 800, fontSize: '1rem' }}>
              🏆 SUPERSTAR ALERT! You completed ALL your daily routines & school work today! 🎉
            </div>
          )}
        </div>

        {/* Shortcut Banner for Morning Routine */}
        <div className="kid-card" style={{ 
          marginBottom: '1.25rem', 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
          borderColor: 'rgba(245, 158, 11, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🌅 Fresh Morning Routine Checklist!
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
              Wake up, make bed, take morning bath, brush teeth, eat breakfast, and get ready for school!
            </p>
          </div>
          <button
            onClick={handleAddMorningRoutine}
            className="btn-kid btn-kid-gold"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
          >
            🌅 Load Morning Routine
          </button>
        </div>

        {/* Task List Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>
            {activeCategory === 'all' && '🌈 All Daily Fun & School Reminders'}
            {activeCategory === 'morning' && '🌅 Morning Routine'}
            {activeCategory === 'school' && '🎒 School & Homework Reminders'}
            {activeCategory === 'afternoon' && '🧸 Play & Home Chores'}
            {activeCategory === 'bedtime' && '🌙 Bedtime Fun'}
          </h2>

          <button onClick={handleResetDefaults} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none' }}>
            Reset Routines
          </button>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="kid-card" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌟</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>No routine tasks in this category!</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>Click "+ Add Task" or load the Morning Routine checklist!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                soundEnabled={soundEnabled}
                soundType={soundType}
                voiceStyle={voiceStyle}
                selectedVoiceName={selectedVoiceName}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', marginTop: '2rem' }}>
        ⭐️ Kid Reminder System • Designed for 8-Year-Old Superstars!
      </footer>

      {/* Modals */}
      <AddKidTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTask}
      />

      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        totalStars={totalStars}
        rewards={rewards}
        onClaimReward={handleClaimReward}
        onAddCustomReward={handleAddCustomReward}
        onDeleteReward={handleDeleteReward}
        voiceStyle={voiceStyle}
        selectedVoiceName={selectedVoiceName}
      />

      <SoundPickerModal
        isOpen={isSoundPickerOpen}
        onClose={() => setIsSoundPickerOpen(false)}
        currentSound={soundType}
        onSelectSound={(newSound) => setSoundType(newSound)}
        currentVoice={voiceStyle}
        onSelectVoice={(newVoice) => setVoiceStyle(newVoice)}
        selectedVoiceName={selectedVoiceName}
        onSelectVoiceName={(newVoiceName) => setSelectedVoiceName(newVoiceName)}
        currentBgm={currentBgm}
        onSelectBgm={(newBgm) => setCurrentBgm(newBgm)}
      />

      <ToonRosterModal
        isOpen={isToonRosterOpen}
        onClose={() => setIsToonRosterOpen(false)}
        activeToonId={activeToonId}
        onSelectToon={(newToonId) => setActiveToonId(newToonId)}
        voiceStyle={voiceStyle}
        selectedVoiceName={selectedVoiceName}
      />

      <GamesModal
        isOpen={isGamesModalOpen}
        onClose={() => setIsGamesModalOpen(false)}
        activeToon={activeToon}
        kidName={activeProfile.name}
        onAddBonusStars={handleAddBonusStars}
        voiceStyle={voiceStyle}
        selectedVoiceName={selectedVoiceName}
      />

      <StoreModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        totalStars={totalStars}
        kidName={activeProfile.name}
        purchasedItemIds={purchasedItemIds}
        onBuyItem={handleBuyStoreItem}
        onAddCustomStoreItem={handleAddCustomStoreItem}
        voiceStyle={voiceStyle}
        selectedVoiceName={selectedVoiceName}
      />

    </div>
  );
}
