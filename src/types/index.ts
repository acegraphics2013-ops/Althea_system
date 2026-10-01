export type Category = 'morning' | 'school' | 'afternoon' | 'bedtime';
export type SoundType = 'superstar' | 'arcade' | 'trumpet' | 'magic' | 'party';
export type VoiceStyle = 'girl' | 'filipino' | 'boy' | 'robot' | 'fairy' | 'standard' | 'toon';
export type BgmTrack = 'garden' | 'elevator' | 'off';
export type KidProfileId = 'althea' | 'mary_grace';

export interface KidProfile {
  id: KidProfileId;
  name: string;
  avatar: string;
  color: string;
  secondaryColor: string;
  favoriteToonId: string;
  greetingMsgTagalog: string;
  greetingMsgEnglish: string;
}

export interface ToonCharacter {
  id: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  secondaryColor: string;
  quote: string;
  cheerMsgTagalog: string;
  cheerMsgEnglish: string;
  stat: string;
  role: string;
  favoriteTaskCategory: Category;
  pitch: number;
  rate: number;
  voiceIntroSound: SoundType;
}

export interface KidTask {
  id: string;
  title: string;
  icon: string;
  category: Category;
  time?: string; // e.g. "08:00 AM"
  completed: boolean;
  stars: number; // Star reward value (default 1)
  notes?: string;
  toonId?: string; // Optional associated Toon character
}

export interface KidSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface KidReward {
  id: string;
  name: string;
  starsNeeded: number;
  unlocked: boolean;
  icon: string;
  category?: 'treat' | 'play' | 'gift' | 'fun';
}

