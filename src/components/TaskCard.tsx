import React from 'react';
import { Check, Star, Trash2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KidTask, SoundType, VoiceStyle } from '../types';
import { playKidSound, speakCheer, speakToonVoice } from '../utils/audio';
import { ALL_DANDYS_WORLD_TOONS } from '../utils/toonsData';

interface TaskCardProps {
  task: KidTask;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  soundEnabled: boolean;
  soundType: SoundType;
  voiceStyle: VoiceStyle;
  selectedVoiceName?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDeleteTask,
  soundEnabled,
  soundType,
  voiceStyle,
  selectedVoiceName
}) => {
  const toonObj = task.toonId ? ALL_DANDYS_WORLD_TOONS.find(t => t.id === task.toonId) : null;

  const handleCheck = () => {
    onToggleComplete(task.id);

    if (!task.completed) {
      if (soundEnabled) {
        const cheerMsg = voiceStyle === 'filipino'
          ? `Ang galing! Natapos mo ang ${task.title}! Meron kang star ichor!`
          : `Awesome job completing ${task.title}! You earned a star ichor!`;

        if (voiceStyle === 'toon' || task.toonId) {
          speakToonVoice(task.toonId || 'althea', cheerMsg, selectedVoiceName);
        } else {
          playKidSound(soundType);
          speakCheer(cheerMsg, voiceStyle, selectedVoiceName);
        }
      }
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      } catch (e) {}
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'morning': return '#ffca28';
      case 'school': return '#00bcd4';
      case 'afternoon': return '#00e676';
      case 'bedtime': return '#ab47bc';
      default: return '#00bcd4';
    }
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'morning': return '🌅 Morning Toon';
      case 'school': return '🎒 School';
      case 'afternoon': return '🧸 Play Chores';
      case 'bedtime': return '🌙 Elevator Bedtime';
      default: return cat;
    }
  };

  return (
    <div
      className="kid-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        backgroundColor: task.completed ? 'rgba(0, 230, 118, 0.12)' : 'var(--bg-card)',
        borderColor: task.completed ? '#00e676' : 'var(--border-color)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Left side: Cartoon Emoji Circle + Title + Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flex: 1, minWidth: 0 }}>
        
        {/* Dandy Cartoon Emoji Frame */}
        <div 
          className={task.completed ? 'animate-toon-jiggle' : ''}
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '20px',
            backgroundColor: task.completed ? '#00e676' : 'rgba(0,0,0,0.04)',
            border: 'var(--border-width) solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.9rem',
            flexShrink: 0,
            boxShadow: '0 4px 0 var(--border-color)'
          }}
        >
          {task.completed ? <Check size={36} color="#000000" strokeWidth={4} /> : task.icon}
        </div>

        <div style={{ overflow: 'hidden' }}>
          {/* Category, Toon Badge & Time Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 900,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: getCategoryColor(task.category),
              color: '#000000',
              border: '2px solid var(--border-color)'
            }}>
              {getCategoryName(task.category)}
            </span>

            {toonObj && (
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: toonObj.color + '40',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--border-color)'
              }}>
                {toonObj.avatar} {toonObj.name}
              </span>
            )}

            {task.time && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700 }}>
                <Clock size={13} /> {task.time}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: '1.15rem',
            marginTop: '0.25rem',
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {task.title}
          </h3>

          {/* Notes */}
          {task.notes && (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.1rem', fontWeight: 600 }}>
              📝 {task.notes}
            </p>
          )}
        </div>

      </div>

      {/* Right side: Big Completion Button + Star Reward + Delete */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
        
        {/* Completion Button */}
        <button
          onClick={handleCheck}
          className={`btn-kid ${task.completed ? 'btn-kid-success' : 'btn-kid-gold'}`}
          style={{ padding: '0.65rem 1.25rem', fontSize: '1rem' }}
        >
          {task.completed ? (
            <>
              <Check size={20} strokeWidth={3} />
              <span>DONE! 🎉</span>
            </>
          ) : (
            <>
              <Star size={20} fill="#000000" color="#000000" />
              <span>Get {task.stars} ⭐️</span>
            </>
          )}
        </button>

        {/* Delete */}
        <button
          onClick={() => onDeleteTask(task.id)}
          style={{
            padding: '0.55rem',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-muted)'
          }}
          title="Delete task"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
};
