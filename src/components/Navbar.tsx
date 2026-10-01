import React from 'react';
import { Star, Plus, Volume2, VolumeX, Trophy, Music, Moon, Sun, Sparkles, Smile, Gamepad2, ShoppingBag } from 'lucide-react';
import { Category, SoundType, ToonCharacter, BgmTrack, KidProfile, KidProfileId } from '../types';
import { KID_PROFILES } from '../utils/toonsData';

interface NavbarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  totalStars: number;
  openAddModal: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  soundType: SoundType;
  openSoundPicker: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  openRewardsModal: () => void;
  activeToon: ToonCharacter;
  openToonRosterModal: () => void;
  currentBgm: BgmTrack;
  toggleBgm: () => void;
  activeProfile: KidProfile;
  onSwitchProfile: (profileId: KidProfileId) => void;
  openGamesModal: () => void;
  openStoreModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  setActiveCategory,
  totalStars,
  openAddModal,
  soundEnabled,
  toggleSound,
  soundType,
  openSoundPicker,
  theme,
  toggleTheme,
  openRewardsModal,
  activeToon,
  openToonRosterModal,
  currentBgm,
  toggleBgm,
  activeProfile,
  onSwitchProfile,
  openGamesModal,
  openStoreModal
}) => {
  const categories = [
    { id: 'all', label: '🌈 All Toon Routines', icon: '🌈' },
    { id: 'morning', label: 'Morning Toon', icon: '🌅' },
    { id: 'school', label: 'School & Homework', icon: '🎒' },
    { id: 'afternoon', label: 'Play & Chores', icon: '🧸' },
    { id: 'bedtime', label: 'Elevator Bedtime', icon: '🌙' },
  ];

  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: 'var(--border-width) solid var(--border-color)',
      padding: '0.9rem 1.25rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-toon)'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        
        {/* Top Header Line */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          {/* Dandy's World Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #ffca28 0%, #ff6090 100%)',
              border: 'var(--border-width) solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: 'var(--shadow-toon)'
            }} className="animate-toon-jiggle">
              🌻
            </div>
            <div>
              <h1 style={{ fontSize: '1.45rem', color: '#ffca28', lineHeight: 1.1, textShadow: '2px 2px 0px var(--border-color)' }}>
                {activeProfile.name}'s <span style={{ color: '#00e676' }}>Toon World</span> ⭐️
              </h1>
              {/* Profile Switcher Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                {KID_PROFILES.map(p => {
                  const isSelected = activeProfile.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSwitchProfile(p.id)}
                      style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem',
                        fontWeight: 900,
                        backgroundColor: isSelected ? p.color : 'rgba(0,0,0,0.06)',
                        color: isSelected ? '#000000' : 'var(--text-secondary)',
                        border: isSelected ? '2px solid var(--border-color)' : '1px solid transparent',
                        boxShadow: isSelected ? '0 2px 0 var(--border-color)' : 'none'
                      }}
                    >
                      {p.avatar} {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Star Ichor Counter & Reward Chest */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            
            {/* Toons Roster Companion Button */}
            <button
              onClick={openToonRosterModal}
              className="btn-kid"
              style={{ backgroundColor: activeToon.color, color: '#000000' }}
              title="All Toons Roster"
            >
              <span style={{ fontSize: '1.2rem' }}>{activeToon.avatar}</span>
              <span>Toons ({activeToon.name})</span>
            </button>

            {/* Star Ichor Score Badge */}
            <button
              onClick={openRewardsModal}
              className="btn-kid btn-kid-gold"
              style={{ padding: '0.55rem 1.1rem', fontSize: '1rem' }}
              title="View Prize Chest!"
            >
              <Star size={22} fill="#000000" color="#000000" className="animate-toon-jiggle" />
              <span>{totalStars} Ichor Stars! 🧪</span>
            </button>

            {/* Arcade Games Button */}
            <button
              onClick={openGamesModal}
              className="btn-kid"
              style={{ backgroundColor: '#00e676', color: '#000000' }}
              title="Play Mini-Games Arcade!"
            >
              <Gamepad2 size={20} className="animate-toon-jiggle" />
              <span>Games 🎮</span>
            </button>

            {/* Toon Store Button */}
            <button
              onClick={openStoreModal}
              className="btn-kid"
              style={{ backgroundColor: '#ff6090', color: '#ffffff' }}
              title="Visit Toon Reward Store!"
            >
              <ShoppingBag size={20} className="animate-toon-jiggle" />
              <span>Store 🛍️</span>
            </button>

            {/* Prize Chest Button */}
            <button
              onClick={openRewardsModal}
              className="btn-kid"
              style={{ backgroundColor: '#ab47bc', color: '#ffffff' }}
              title="Prizes & Toon Rewards"
            >
              <Trophy size={20} />
              <span>Prizes</span>
            </button>

            {/* Change Audio Button */}
            <button
              onClick={openSoundPicker}
              className="btn-kid"
              style={{ backgroundColor: '#ff6090', color: '#ffffff' }}
              title="Change Audio, Voice & BGM"
            >
              <Music size={18} />
              <span>Audio 🎵</span>
            </button>

            {/* Quick BGM Toggle Button */}
            <button
              onClick={toggleBgm}
              className="btn-kid"
              style={{
                backgroundColor: currentBgm !== 'off' ? '#ffca28' : 'var(--bg-surface)',
                color: '#000000',
                padding: '0.55rem 0.9rem'
              }}
              title="Toggle Dandy's World Background Music BGM"
            >
              <Music size={18} className={currentBgm !== 'off' ? 'animate-toon-jiggle' : ''} />
              <span>{currentBgm !== 'off' ? `BGM: ${currentBgm === 'garden' ? 'Day 🌻' : 'Night 🌙'}` : 'BGM Off 🔇'}</span>
            </button>

            {/* Quick Add Button */}
            <button
              onClick={openAddModal}
              className="btn-kid btn-kid-primary"
              style={{ padding: '0.55rem 1.1rem' }}
            >
              <Plus size={22} />
              <span>Add Task</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              style={{ padding: '0.55rem', borderRadius: '50%', backgroundColor: 'var(--bg-card)', color: soundEnabled ? 'var(--color-ichor-green)' : 'var(--text-muted)' }}
              title="Toggle Sound Cheer"
            >
              {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
            </button>

            {/* Theme Toggle (Dandy Day / Elevator Night) */}
            <button
              onClick={toggleTheme}
              style={{ padding: '0.55rem', borderRadius: '50%', backgroundColor: 'var(--bg-card)', color: 'var(--color-dandy-yellow)' }}
              title="Toggle Dandy Day / Elevator Night"
            >
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>

          </div>

        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  backgroundColor: isActive ? 'var(--color-dandy-yellow)' : 'var(--bg-surface)',
                  color: isActive ? '#000000' : 'var(--text-primary)',
                  boxShadow: isActive ? 'var(--shadow-toon)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
