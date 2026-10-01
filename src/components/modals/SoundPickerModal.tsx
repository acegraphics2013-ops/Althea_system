import React, { useState, useEffect } from 'react';
import { X, Volume2, Check, Music, Sparkles, Mic } from 'lucide-react';
import { SoundType, VoiceStyle, BgmTrack } from '../../types';
import { playKidSound, speakCheer, getAvailableVoices, startBgmLoop, stopBgmLoop } from '../../utils/audio';

interface SoundPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSound: SoundType;
  onSelectSound: (sound: SoundType) => void;
  currentVoice: VoiceStyle;
  onSelectVoice: (voice: VoiceStyle) => void;
  selectedVoiceName: string;
  onSelectVoiceName: (voiceName: string) => void;
  currentBgm: BgmTrack;
  onSelectBgm: (bgm: BgmTrack) => void;
}

const SOUND_OPTIONS: { id: SoundType; name: string; icon: string; description: string }[] = [
  { id: 'superstar', name: 'Superstar Chime ⭐️', icon: '🌟', description: 'High sparkling victory chord' },
  { id: 'arcade', name: '8-Bit Arcade Level Up 🕹️', icon: '👾', description: 'Retro video game coin pop' },
  { id: 'trumpet', name: 'Celebration Trumpet 🎺', icon: '🎺', description: 'Bright brass fanfare sound' },
  { id: 'magic', name: 'Magic Fairy Wand 🔔', icon: '🪄', description: 'Sparkling bell shimmer' },
  { id: 'party', name: 'Party Pop Beat 🥁', icon: '🎉', description: 'Fun energetic party beat' },
];

const VOICE_OPTIONS: { id: VoiceStyle; name: string; icon: string; description: string; previewText: string }[] = [
  { id: 'toon', name: 'Active Toon Companion Voice 🎭', icon: '🌟', description: 'Uses the pitch & speech tone of your selected Toon!', previewText: "Welcome to Toon World! Toon Companion voice activated!" },
  { id: 'filipino', name: 'Filipino Girl Voice 🇵🇭', icon: '🇵🇭', description: 'Masayang Tagalog cheerleader (Ang galing mo!)', previewText: "Ang galing mo! Filipino Narrator ready! Meron kang star!" },
  { id: 'girl', name: 'Cheerful Girl Voice 👧', icon: '👧', description: 'Sweet, bright, and encouraging girl cheerleader', previewText: "Yay! Cheerful Girl Voice selected! Super job!" },
  { id: 'fairy', name: 'Magic Fairy Voice 🧚‍♀️', icon: '🧚‍♀️', description: 'High-pitched magical fairy sparkle voice', previewText: "Sparkle time! Magic Fairy Voice ready!" },
  { id: 'boy', name: 'Playful Boy Voice 👦', icon: '👦', description: 'Energetic and awesome kid cheerleader', previewText: "Awesome! Playful Boy Voice ready for action!" },
  { id: 'robot', name: 'Funny Robot Voice 🤖', icon: '🤖', description: 'Beep boop! Fun robotic voice', previewText: "Beep Boop! Robot Narrator activated! Great job human!" },
  { id: 'standard', name: 'Standard Cheer 🗣️', icon: '🗣️', description: 'Clear bright default cheerleader voice', previewText: "Great job! Standard Cheer narrator set!" },
];

export const SoundPickerModal: React.FC<SoundPickerModalProps> = ({
  isOpen,
  onClose,
  currentSound,
  onSelectSound,
  currentVoice,
  onSelectVoice,
  selectedVoiceName,
  onSelectVoiceName,
  currentBgm,
  onSelectBgm
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'sound' | 'bgm'>('bgm');
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (isOpen) {
      const vList = getAvailableVoices();
      setSystemVoices(vList);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestSound = (soundId: SoundType) => {
    onSelectSound(soundId);
    playKidSound(soundId);
  };

  const handleTestVoiceStyle = (voiceId: VoiceStyle, text: string) => {
    onSelectVoice(voiceId);
    speakCheer(text, voiceId, selectedVoiceName);
  };

  const handleTestSpecificVoice = (vName: string) => {
    onSelectVoiceName(vName);
    speakCheer(`Hello! You selected ${vName.split(' ')[0]} as your narrator!`, currentVoice, vName);
  };

  const handleSelectBgmTrack = (track: BgmTrack) => {
    onSelectBgm(track);
    if (track === 'off') {
      stopBgmLoop();
    } else {
      startBgmLoop(track);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="kid-card" style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: 'var(--bg-surface)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={24} color="#ec4899" /> Audio, Voices & BGM Music! 🎵
          </h2>
          <button onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.3rem', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveTab('bgm')}
            style={{
              flex: 1,
              padding: '0.5rem 0.2rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: activeTab === 'bgm' ? 800 : 600,
              fontSize: '0.82rem',
              backgroundColor: activeTab === 'bgm' ? '#ffca28' : 'transparent',
              color: activeTab === 'bgm' ? '#000000' : 'var(--text-secondary)'
            }}
          >
            🎹 Toon BGM
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            style={{
              flex: 1,
              padding: '0.5rem 0.2rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: activeTab === 'voice' ? 800 : 600,
              fontSize: '0.82rem',
              backgroundColor: activeTab === 'voice' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'voice' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            👧 Narrator Voice
          </button>

          <button
            onClick={() => setActiveTab('sound')}
            style={{
              flex: 1,
              padding: '0.5rem 0.2rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: activeTab === 'sound' ? 800 : 600,
              fontSize: '0.82rem',
              backgroundColor: activeTab === 'sound' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'sound' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            🎵 Sound FX
          </button>
        </div>

        {/* BGM Tab Content */}
        {activeTab === 'bgm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Choose Background Music (BGM):
            </label>

            <button
              onClick={() => handleSelectBgmTrack('garden')}
              className="kid-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: currentBgm === 'garden' ? 'rgba(255, 202, 40, 0.2)' : 'rgba(0,0,0,0.02)',
                borderColor: currentBgm === 'garden' ? '#ffca28' : 'var(--border-color)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.8rem' }}>🌻</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Garden Center Theme (Day BGM)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Upbeat 1930s ragtime toon melody with bouncy chords & woodblock beats!
                  </div>
                </div>
              </div>
              {currentBgm === 'garden' && (
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ffca28', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </button>

            <button
              onClick={() => handleSelectBgmTrack('elevator')}
              className="kid-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: currentBgm === 'elevator' ? 'rgba(126, 87, 194, 0.2)' : 'rgba(0,0,0,0.02)',
                borderColor: currentBgm === 'elevator' ? '#7e57c2' : 'var(--border-color)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.8rem' }}>🌙</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Elevator Night Lounge Theme (Night BGM)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Relaxing nocturnal synth lounge melody for bedtime routines!
                  </div>
                </div>
              </div>
              {currentBgm === 'elevator' && (
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#7e57c2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </button>

            <button
              onClick={() => handleSelectBgmTrack('off')}
              className="kid-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: currentBgm === 'off' ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.02)',
                borderColor: currentBgm === 'off' ? 'var(--border-color)' : 'var(--border-color)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.8rem' }}>🔇</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Background Music Off
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Mute background music (sound effect cheers & voice will still work)
                  </div>
                </div>
              </div>
              {currentBgm === 'off' && (
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </button>
          </div>
        )}

        {/* Voice Tab Content */}
        {activeTab === 'voice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Character Style Selection */}
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                1. Pick Voice Personality:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {VOICE_OPTIONS.map(v => {
                  const isSelected = currentVoice === v.id;

                  return (
                    <button
                      key={v.id}
                      onClick={() => handleTestVoiceStyle(v.id, v.previewText)}
                      className="kid-card"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.9rem',
                        backgroundColor: isSelected ? 'rgba(236, 72, 153, 0.1)' : 'rgba(0,0,0,0.02)',
                        borderColor: isSelected ? '#ec4899' : 'var(--border-color)',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontSize: '1.5rem' }}>{v.icon}</div>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isSelected ? '#ec4899' : 'var(--text-primary)' }}>
                            {v.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {v.description}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Volume2 size={16} color="#ec4899" />
                        {isSelected && (
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#ec4899',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                          }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific Installed Computer Voice Selector */}
            {systemVoices.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  <Mic size={16} color="var(--color-primary)" /> Pick Specific Computer Voice (Optional):
                </label>

                <select
                  value={selectedVoiceName}
                  onChange={e => handleTestSpecificVoice(e.target.value)}
                  style={{ fontSize: '0.88rem', padding: '0.6rem 0.8rem' }}
                >
                  <option value="">-- Automatic Voice (Default) --</option>
                  {systemVoices.map(sysVoice => (
                    <option key={sysVoice.name} value={sysVoice.name}>
                      🗣️ {sysVoice.name} ({sysVoice.lang})
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  {systemVoices.length} voices detected on your computer!
                </p>
              </div>
            )}

          </div>
        )}

        {/* Sound Tab Content */}
        {activeTab === 'sound' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '300px', overflowY: 'auto' }}>
            {SOUND_OPTIONS.map(snd => {
              const isSelected = currentSound === snd.id;

              return (
                <button
                  key={snd.id}
                  onClick={() => handleTestSound(snd.id)}
                  className="kid-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.02)',
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.6rem' }}>{snd.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                        {snd.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {snd.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Volume2 size={18} color="var(--color-primary)" />
                    {isSelected && (
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                      }}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <button onClick={onClose} className="btn-kid btn-kid-primary" style={{ width: '100%', marginTop: '1.25rem' }}>
          Done & Saved! 👍
        </button>

      </div>
    </div>
  );
};
