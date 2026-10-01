import React, { useState } from 'react';
import { X, ShoppingBag, Star, Sparkles, CheckCircle2, Lock, Plus, Gift, Award, Zap, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VoiceStyle } from '../../types';
import { playFanfare, speakCheer, playKidSound } from '../../utils/audio';

export interface StoreItem {
  id: string;
  name: string;
  category: 'treat' | 'accessory' | 'powerup' | 'plushie';
  cost: number;
  icon: string;
  description: string;
  color: string;
}

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalStars: number;
  kidName: string;
  purchasedItemIds: string[];
  onBuyItem: (item: StoreItem) => void;
  onAddCustomStoreItem: (item: StoreItem) => void;
  voiceStyle: VoiceStyle;
  selectedVoiceName?: string;
}

export const DEFAULT_STORE_ITEMS: StoreItem[] = [
  // Treats & Passes
  { id: 'item-ice-cream', name: 'Ice Cream Treat Pass', category: 'treat', cost: 10, icon: '🍦', description: 'Delicious ice cream cone of your choice!', color: '#ff6090' },
  { id: 'item-ipad-time', name: '30-Min iPad / Game Pass', category: 'treat', cost: 12, icon: '📱', description: 'Extra 30 minutes of fun game or video time!', color: '#29b6f6' },
  { id: 'item-movie-night', name: 'Family Movie Night Pick', category: 'treat', cost: 15, icon: '🎬', description: 'You get to pick tonight\'s movie & snacks!', color: '#ab47bc' },
  { id: 'item-toy-pass', name: 'Surprise Toy Shop Pass', category: 'treat', cost: 30, icon: '🎁', description: 'Pick a small surprise toy at the store!', color: '#ffca28' },
  { id: 'item-playground', name: 'Park & Playground Trip', category: 'treat', cost: 14, icon: '🛝', description: 'Trip to the fun park or trampoline zone!', color: '#66bb6a' },

  // Toon Accessories & Skins
  { id: 'item-crown', name: 'Golden Toon Crown', category: 'accessory', cost: 8, icon: '👑', description: 'Wear a glowing golden crown on your profile!', color: '#ffd54f' },
  { id: 'item-wand', name: 'Superstar Magic Wand', category: 'accessory', cost: 10, icon: '🪄', description: 'Magical sparkling wand accessory!', color: '#e91e63' },
  { id: 'item-rainbow-halo', name: 'Rainbow Sparkle Halo', category: 'accessory', cost: 15, icon: '🌈', description: 'Glowing rainbow aura for your active toon!', color: '#00bcd4' },
  { id: 'item-cape', name: 'Superhero Red Cape', category: 'accessory', cost: 12, icon: '🦸', description: 'Fly high with a superhero cape!', color: '#f44336' },

  // Toon Power-Ups
  { id: 'item-double-ichor', name: 'Double Star Ichor Potion', category: 'powerup', cost: 20, icon: '🧪', description: 'Earn double stars on your next task!', color: '#00e676' },
  { id: 'item-lucky-charm', name: 'Lucky Clover Charm', category: 'powerup', cost: 10, icon: '🍀', description: 'Boosts your lucky prize wheel spins!', color: '#4caf50' },
  { id: 'item-trophy-badge', name: 'Golden Superstar Badge', category: 'powerup', cost: 25, icon: '🌟', description: 'Golden badge of routine mastery!', color: '#ff9800' },

  // Plushies & Collectibles
  { id: 'item-vee-plush', name: 'Vee TV Plushie', category: 'plushie', cost: 15, icon: '📺', description: 'Cute retro TV plushie companion!', color: '#00bcd4' },
  { id: 'item-goob-plush', name: 'Goob Hug Plushie', category: 'plushie', cost: 15, icon: '🫂', description: 'Soft huggable pink string plushie!', color: '#ff4081' },
  { id: 'item-pebble-pet', name: 'Pebble Rock Pet', category: 'plushie', cost: 18, icon: '🪨', description: 'Loyal pet rock toon buddy!', color: '#8d6e63' },
  { id: 'item-astro-ship', name: 'Astro Rocket Spaceship', category: 'plushie', cost: 22, icon: '🚀', description: 'Cosmic glowing spaceship toy!', color: '#3f51b5' }
];

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  totalStars,
  kidName,
  purchasedItemIds,
  onBuyItem,
  onAddCustomStoreItem,
  voiceStyle,
  selectedVoiceName
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'treat' | 'accessory' | 'powerup' | 'plushie'>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCost, setNewItemCost] = useState<number>(10);
  const [newItemIcon, setNewItemIcon] = useState<string>('🎁');
  const [newItemCategory, setNewItemCategory] = useState<'treat' | 'accessory' | 'powerup' | 'plushie'>('treat');

  if (!isOpen) return null;

  const filteredItems = activeCategory === 'all'
    ? DEFAULT_STORE_ITEMS
    : DEFAULT_STORE_ITEMS.filter(i => i.category === activeCategory);

  const handleBuy = (item: StoreItem) => {
    if (totalStars < item.cost) return;

    onBuyItem(item);
    playFanfare();

    try {
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}

    const msg = voiceStyle === 'filipino'
      ? `Yehey ${kidName}! Nabili mo ang ${item.name} sa Toon Shop! Ang galing!`
      : `Hooray ${kidName}! You bought the ${item.name} from the Toon Store!`;

    speakCheer(msg, voiceStyle, selectedVoiceName);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddCustomStoreItem({
      id: 'custom-store-' + Date.now(),
      name: newItemName.trim(),
      cost: newItemCost,
      icon: newItemIcon,
      category: newItemCategory,
      description: 'Custom reward item added by parent!',
      color: '#ffca28'
    });

    setNewItemName('');
    setNewItemCost(10);
    setShowAddForm(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="kid-card" style={{ width: '100%', maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto', backgroundColor: 'var(--bg-surface)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', color: '#ff6090', textShadow: '2px 2px 0px var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🛍️ Toon World Reward Store! 🧪
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Spend your earned Star Ichor 🧪 to buy real treats, toon costumes, and plushies for {kidName}!
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Current Star Balance Banner */}
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #ffca28 0%, #00e676 100%)',
          color: '#000000',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-toon)',
          border: 'var(--border-width) solid var(--border-color)'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
              {kidName}'s Star Ichor Wallet:
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem', textShadow: '1px 1px 0 #fff' }}>
              <Star size={32} fill="#000" color="#000" className="animate-toon-jiggle" />
              <span>{totalStars} Star Ichor 🧪</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-kid"
            style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> {showAddForm ? 'Close Form' : 'Add Custom Store Item'}
          </button>
        </div>

        {/* Custom Item Form */}
        {showAddForm && (
          <form onSubmit={handleCreateItem} className="kid-card" style={{ marginBottom: '1.25rem', backgroundColor: 'rgba(255, 202, 40, 0.1)', borderColor: '#ffca28', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#d97706' }}>🎁 Add Custom Store Reward Idea:</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '0.2rem' }}>Item Name / Treat *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🍨 Giant Sundae or 🚲 Bicycle Ride"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '0.2rem' }}>Cost (Stars 🧪)</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={newItemCost}
                  onChange={e => setNewItemCost(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '0.2rem' }}>Icon</label>
                <input
                  type="text"
                  value={newItemIcon}
                  onChange={e => setNewItemIcon(e.target.value)}
                  placeholder="e.g. 🍦 or 🎁"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '0.2rem' }}>Category</label>
                <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value as any)}>
                  <option value="treat">🍿 Real-Life Treat</option>
                  <option value="accessory">🎭 Toon Accessory</option>
                  <option value="powerup">🧪 Toon Power-Up</option>
                  <option value="plushie">🧸 Toon Plushie</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-kid btn-kid-gold" style={{ padding: '0.6rem', fontSize: '0.95rem' }}>
              <Sparkles size={16} /> Save New Store Item!
            </button>
          </form>
        )}

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveCategory('all')}
            className="btn-kid"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.82rem',
              backgroundColor: activeCategory === 'all' ? '#ff6090' : 'rgba(0,0,0,0.05)',
              color: activeCategory === 'all' ? '#ffffff' : 'var(--text-primary)'
            }}
          >
            🛍️ All Store Items
          </button>
          <button
            onClick={() => setActiveCategory('treat')}
            className="btn-kid"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.82rem',
              backgroundColor: activeCategory === 'treat' ? '#29b6f6' : 'rgba(0,0,0,0.05)',
              color: activeCategory === 'treat' ? '#ffffff' : 'var(--text-primary)'
            }}
          >
            🍿 Real Treats & Passes
          </button>
          <button
            onClick={() => setActiveCategory('accessory')}
            className="btn-kid"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.82rem',
              backgroundColor: activeCategory === 'accessory' ? '#ffd54f' : 'rgba(0,0,0,0.05)',
              color: activeCategory === 'accessory' ? '#000000' : 'var(--text-primary)'
            }}
          >
            🎭 Toon Accessories
          </button>
          <button
            onClick={() => setActiveCategory('powerup')}
            className="btn-kid"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.82rem',
              backgroundColor: activeCategory === 'powerup' ? '#00e676' : 'rgba(0,0,0,0.05)',
              color: activeCategory === 'powerup' ? '#000000' : 'var(--text-primary)'
            }}
          >
            🧪 Toon Power-Ups
          </button>
          <button
            onClick={() => setActiveCategory('plushie')}
            className="btn-kid"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.82rem',
              backgroundColor: activeCategory === 'plushie' ? '#ab47bc' : 'rgba(0,0,0,0.05)',
              color: activeCategory === 'plushie' ? '#ffffff' : 'var(--text-primary)'
            }}
          >
            🧸 Toon Plushies
          </button>
        </div>

        {/* Store Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {filteredItems.map(item => {
            const isPurchased = purchasedItemIds.includes(item.id);
            const canAfford = totalStars >= item.cost;

            return (
              <div
                key={item.id}
                className="kid-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderColor: isPurchased ? '#10b981' : item.color,
                  backgroundColor: isPurchased ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      backgroundColor: item.color,
                      border: 'var(--border-width) solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {item.icon}
                    </div>

                    <div style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#ffca28',
                      color: '#000000',
                      fontSize: '0.8rem',
                      fontWeight: 900,
                      border: '1px solid var(--border-color)'
                    }}>
                      {item.cost} 🧪
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '0.25rem' }}>
                    {item.name}
                  </h3>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                    {item.description}
                  </p>
                </div>

                {isPurchased ? (
                  <div style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}>
                    <CheckCircle2 size={18} /> OWNED! 🎉
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className="btn-kid btn-kid-gold"
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      fontSize: '0.9rem',
                      opacity: canAfford ? 1 : 0.5,
                      cursor: canAfford ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {canAfford ? `BUY ITEM (${item.cost} 🧪)` : `Need ${item.cost - totalStars} more 🧪`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className="btn-kid btn-kid-primary" style={{ width: '100%', marginTop: '1.25rem' }}>
          Back to Routines! 👍
        </button>

      </div>
    </div>
  );
};
