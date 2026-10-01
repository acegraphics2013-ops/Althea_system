import React, { useState } from 'react';
import { X, Star, Trophy, Lock, CheckCircle2, Plus, Sparkles, Trash2, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KidReward, VoiceStyle } from '../../types';
import { playFanfare, speakCheer } from '../../utils/audio';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalStars: number;
  rewards: KidReward[];
  onClaimReward: (id: string) => void;
  onAddCustomReward: (reward: KidReward) => void;
  onDeleteReward: (id: string) => void;
  voiceStyle: VoiceStyle;
  selectedVoiceName?: string;
}

const PRIZE_ICONS = ['🍦', '🍕', '🍝', '🎮', '🍿', '🎬', '🎁', '🏆', '🛝', '🚲', '🎡', '🎨', '🍫', '🎠', '📚', '⚽'];

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  totalStars,
  rewards,
  onClaimReward,
  onAddCustomReward,
  onDeleteReward,
  voiceStyle,
  selectedVoiceName
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPrizeName, setNewPrizeName] = useState('');
  const [newPrizeStars, setNewPrizeStars] = useState(10);
  const [newPrizeIcon, setNewPrizeIcon] = useState('🎁');

  if (!isOpen) return null;

  const sortedRewards = [...rewards].sort((a, b) => a.starsNeeded - b.starsNeeded);

  // Find next unlockable prize
  const nextReward = sortedRewards.find(r => !r.unlocked && totalStars < r.starsNeeded);

  const handleClaim = (reward: KidReward) => {
    onClaimReward(reward.id);
    playFanfare();

    const cheerMsg = voiceStyle === 'filipino'
      ? `Ang galing! Nakuha mo na ang iyong reward: ${reward.name}! Mabuhay!`
      : `Congratulations! You unlocked your prize: ${reward.name}!`;

    speakCheer(cheerMsg, voiceStyle, selectedVoiceName);

    try {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrizeName.trim()) return;

    onAddCustomReward({
      id: 'rew-' + Date.now(),
      name: newPrizeName.trim(),
      starsNeeded: Number(newPrizeStars),
      unlocked: false,
      icon: newPrizeIcon,
      category: 'gift'
    });

    setNewPrizeName('');
    setNewPrizeStars(10);
    setShowAddForm(false);
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
      <div className="kid-card" style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: 'var(--bg-surface)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Trophy size={26} color="#f59e0b" /> Star Rewards & Prize Chest! 🏆
          </h2>
          <button onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Current Star Balance Banner */}
        <div style={{
          padding: '1.1rem',
          borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-gold)'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' }}>YOUR STAR BALANCE</span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
            <Star size={34} fill="#ffffff" color="#ffffff" className="animate-star-pop" />
            <span>{totalStars} Stars</span>
          </div>

          {nextReward && (
            <div style={{ marginTop: '0.6rem', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255,255,255,0.25)', fontSize: '0.82rem', fontWeight: 700 }}>
              🎯 Next Prize Goal: {nextReward.icon} {nextReward.name} (Need {nextReward.starsNeeded - totalStars} more ⭐️)
            </div>
          )}
        </div>

        {/* Action Row: Add Prize Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Gift size={20} color="var(--color-primary)" /> Available Prizes ({sortedRewards.length})
          </h3>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-kid"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-primary)', border: '1px solid rgba(59, 130, 246, 0.3)' }}
          >
            <Plus size={16} /> {showAddForm ? 'Close Form' : 'Add Custom Prize'}
          </button>
        </div>

        {/* Add Custom Prize Form */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="kid-card" style={{ marginBottom: '1.25rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>🎁 Create Your Own Custom Prize:</h4>
            
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Prize Name / Treat *</label>
              <input
                type="text"
                required
                placeholder="e.g. Go to Trampoline Park 🎡 or Buy Lego Set 🧱"
                value={newPrizeName}
                onChange={e => setNewPrizeName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Stars Needed ⭐️</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={newPrizeStars}
                  onChange={e => setNewPrizeStars(Number(e.target.value))}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Pick Icon</label>
                <select value={newPrizeIcon} onChange={e => setNewPrizeIcon(e.target.value)}>
                  {PRIZE_ICONS.map(i => (
                    <option key={i} value={i}>{i} Icon</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-kid btn-kid-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <Sparkles size={16} /> Save Prize Idea!
            </button>
          </form>
        )}

        {/* Rewards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto' }}>
          {sortedRewards.map(rew => {
            const canUnlock = totalStars >= rew.starsNeeded;

            return (
              <div
                key={rew.id}
                className="kid-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  backgroundColor: rew.unlocked ? 'rgba(16, 185, 129, 0.08)' : canUnlock ? 'rgba(245, 158, 11, 0.08)' : 'rgba(0,0,0,0.02)',
                  borderColor: rew.unlocked ? '#10b981' : canUnlock ? '#f59e0b' : 'var(--border-color)',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '2rem', flexShrink: 0 }}>{rew.icon}</div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: rew.unlocked ? '#10b981' : 'var(--text-primary)' }}>
                      {rew.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Costs <strong>{rew.starsNeeded} ⭐️ Stars</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  {rew.unlocked ? (
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                      <CheckCircle2 size={16} /> Claimed! 🎉
                    </span>
                  ) : canUnlock ? (
                    <button
                      onClick={() => handleClaim(rew)}
                      className="btn-kid btn-kid-gold"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                    >
                      Unlock Prize! 🎉
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: 'rgba(0,0,0,0.05)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-full)' }}>
                      <Lock size={14} /> {rew.starsNeeded - totalStars} more ⭐️
                    </span>
                  )}

                  {rewards.length > 3 && (
                    <button
                      onClick={() => onDeleteReward(rew.id)}
                      style={{ padding: '0.35rem', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)' }}
                      title="Delete Prize"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
