import React, { useState } from 'react';
import { X, Sparkles, Star } from 'lucide-react';
import { Category, KidTask } from '../../types';

interface AddKidTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: KidTask) => void;
}

const EMOJI_OPTIONS = ['🎒', '✏️', '📖', '🔢', '🥣', '🍎', '🐶', '🐱', '⚽', '🪥', '🥛', '🎨', '🛌', '🧹', '🎹', '🚲', '🧼', '🍿', '🛍️', '🏆', '⭐', '🧪', '👾', '🚀', '🫂', '🌻'];

export const AddKidTaskModal: React.FC<AddKidTaskModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('🎒');
  const [category, setCategory] = useState<Category>('school');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: 'kt-' + Date.now(),
      title: title.trim(),
      icon,
      category,
      time: time || undefined,
      completed: false,
      stars: 1,
      notes: notes.trim() || undefined
    });

    setTitle('');
    setTime('');
    setNotes('');
    onClose();
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
      <div className="kid-card" style={{ width: '100%', maxWidth: '460px', backgroundColor: 'var(--bg-surface)' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={22} color="#f59e0b" /> Add New Fun Task!
          </h2>
          <button onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Task Name */}
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
              What do you need to do? ✏️
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Read 15 mins or Pack Backpack"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              Pick a Cute Icon! 🎨
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    fontSize: '1.4rem',
                    backgroundColor: icon === e ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.04)',
                    border: icon === e ? '2px solid var(--color-primary)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Category Routine Selection */}
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              When is it for? ⏰
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {[
                { id: 'morning', label: '🌅 Morning' },
                { id: 'school', label: '🎒 School & Homework' },
                { id: 'afternoon', label: '🧸 Play & Chores' },
                { id: 'bedtime', label: '🌙 Bedtime' },
              ].map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as Category)}
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: category === c.id ? 800 : 600,
                    backgroundColor: category === c.id ? 'var(--color-primary)' : 'rgba(0,0,0,0.04)',
                    color: category === c.id ? '#ffffff' : 'var(--text-primary)',
                    border: category === c.id ? 'none' : '1px solid var(--border-color)'
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time & Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Time (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 8:00 AM"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Details / Page #</label>
              <input
                type="text"
                placeholder="e.g. Page 5-8"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-kid btn-kid-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            <Star size={20} fill="#ffffff" />
            <span>Save My Task!</span>
          </button>

        </form>
      </div>
    </div>
  );
};
