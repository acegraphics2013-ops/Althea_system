import React, { useState } from 'react';
import { X, Sparkles, Check, Heart, Volume2, Star, Shield, Zap } from 'lucide-react';
import { ToonCharacter, VoiceStyle } from '../../types';
import { ALL_DANDYS_WORLD_TOONS } from '../../utils/toonsData';
import { speakCheer, speakToonVoice, playKidSound } from '../../utils/audio';

interface ToonRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeToonId: string;
  onSelectToon: (toonId: string) => void;
  voiceStyle: VoiceStyle;
  selectedVoiceName?: string;
}

export const ToonRosterModal: React.FC<ToonRosterModalProps> = ({
  isOpen,
  onClose,
  activeToonId,
  onSelectToon,
  voiceStyle,
  selectedVoiceName
}) => {
  const [selectedToonPreview, setSelectedToonPreview] = useState<ToonCharacter>(
    ALL_DANDYS_WORLD_TOONS.find(t => t.id === activeToonId) || ALL_DANDYS_WORLD_TOONS[0]
  );

  if (!isOpen) return null;

  const handlePickToon = (toon: ToonCharacter) => {
    setSelectedToonPreview(toon);
    onSelectToon(toon.id);

    const speechText = voiceStyle === 'filipino'
      ? toon.cheerMsgTagalog
      : toon.cheerMsgEnglish;

    speakToonVoice(toon.id, speechText, selectedVoiceName);
  };

  const currentActive = ALL_DANDYS_WORLD_TOONS.find(t => t.id === activeToonId) || ALL_DANDYS_WORLD_TOONS[0];

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="kid-card" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: 'var(--bg-surface)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#ffca28', textShadow: '2px 2px 0px var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🎭 All Toons Roster! 🧪
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Choose your active Toon companion to cheer you on for every morning bath, routine, & homework!
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Selected Active Companion Showcase Box */}
        <div className="kid-card" style={{
          marginBottom: '1.25rem',
          background: `linear-gradient(135deg, ${selectedToonPreview.color}25 0%, ${selectedToonPreview.secondaryColor} 100%)`,
          borderColor: selectedToonPreview.color,
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          padding: '1.25rem'
        }}>
          {/* Avatar frame */}
          <div className="animate-toon-jiggle" style={{
            width: '90px',
            height: '90px',
            borderRadius: '28px',
            backgroundColor: selectedToonPreview.color,
            border: 'var(--border-width) solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
            boxShadow: 'var(--shadow-toon)',
            flexShrink: 0
          }}>
            {selectedToonPreview.avatar}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                {selectedToonPreview.name}
              </h3>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 900,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: selectedToonPreview.color,
                color: '#000000',
                border: '1.5px solid var(--border-color)'
              }}>
                {selectedToonPreview.role}
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 800, marginTop: '0.1rem' }}>
              {selectedToonPreview.title}
            </p>

            <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-primary)', marginTop: '0.35rem', background: 'rgba(255,255,255,0.7)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)' }}>
              "{selectedToonPreview.quote}"
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={14} color={selectedToonPreview.color} /> {selectedToonPreview.stat}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={() => {
                const speechText = voiceStyle === 'filipino'
                  ? selectedToonPreview.cheerMsgTagalog
                  : selectedToonPreview.cheerMsgEnglish;
                speakToonVoice(selectedToonPreview.id, speechText, selectedVoiceName);
              }}
              className="btn-kid"
              style={{ backgroundColor: '#ff6090', color: '#ffffff', padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
            >
              <Volume2 size={18} />
              <span>Hear Voice 🔊</span>
            </button>

            <button
              onClick={() => handlePickToon(selectedToonPreview)}
              className="btn-kid btn-kid-gold"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}
            >
              {activeToonId === selectedToonPreview.id ? (
                <>
                  <Check size={18} strokeWidth={3} />
                  <span>Active Companion!</span>
                </>
              ) : (
                <>
                  <Heart size={18} fill="#000000" color="#000000" />
                  <span>Choose {selectedToonPreview.name}!</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Toons Grid Roster */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={18} color="#00e676" /> Click any Toon to select & hear their voice! ({ALL_DANDYS_WORLD_TOONS.length} Toons):
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.75rem'
        }}>
          {ALL_DANDYS_WORLD_TOONS.map(toon => {
            const isSelected = activeToonId === toon.id;
            const isHovered = selectedToonPreview.id === toon.id;

            return (
              <button
                key={toon.id}
                onClick={() => handlePickToon(toon)}
                className="kid-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.75rem 0.5rem',
                  backgroundColor: isSelected ? 'rgba(255, 202, 40, 0.25)' : (isHovered ? 'rgba(0,0,0,0.04)' : 'var(--bg-card)'),
                  borderColor: isSelected ? '#ffca28' : (isHovered ? toon.color : 'var(--border-color)'),
                  position: 'relative',
                  textAlign: 'center'
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    backgroundColor: '#ffca28',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #000'
                  }}>
                    <Check size={12} strokeWidth={3} color="#000" />
                  </div>
                )}

                <div style={{
                  fontSize: '2.4rem',
                  marginBottom: '0.2rem',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.15s ease'
                }}>
                  {toon.avatar}
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  {toon.name}
                </div>

                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  {toon.role}
                </div>
              </button>
            );
          })}
        </div>

        <button onClick={onClose} className="btn-kid btn-kid-primary" style={{ width: '100%', marginTop: '1.25rem' }}>
          Ready to Play with {currentActive.name}! 🚀
        </button>

      </div>
    </div>
  );
};
