import { SoundType, VoiceStyle, BgmTrack } from '../types';
import { ALL_DANDYS_WORLD_TOONS } from './toonsData';

let audioCtx: AudioContext | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Fetch installed system voices
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      return voices;
    }
  }
  return cachedVoices;
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  getAvailableVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      getAvailableVoices();
    };
  }
}

// Play selected sound effect
export const playKidSound = (soundType: SoundType = 'superstar') => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (soundType === 'arcade') {
      const notes = [493.88, 659.25, 830.61, 987.77];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.13);
      });
    } else if (soundType === 'trumpet') {
      const notes = [349.23, 440.00, 523.25, 698.46];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.55);
      });
    } else if (soundType === 'magic') {
      const freqs = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.2, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.35);
      });
    } else if (soundType === 'party') {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.25, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    } else {
      const notes = [659.25, 830.61, 987.77, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
};

// Play Victory Fanfare
export const playFanfare = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.3, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.65);
    });
  } catch (err) {
    console.warn('Fanfare error:', err);
  }
};

// Play a distinct vocal intro chime for each voice character
const playVoiceIntroChime = (voiceStyle: VoiceStyle) => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (voiceStyle === 'filipino' || voiceStyle === 'girl') {
      [783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.28);
      });
    } else if (voiceStyle === 'fairy') {
      [1318.51, 1567.98, 1975.53].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.35);
      });
    } else if (voiceStyle === 'robot') {
      [220.00, 440.00, 220.00].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.13);
      });
    } else if (voiceStyle === 'boy') {
      [261.63, 329.63, 392.00].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.25, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
      });
    }
  } catch (e) {}
};

// Speak with a specific Dandy's World Toon Character Voice
export const speakToonVoice = (toonId: string, message: string, selectedVoiceName?: string) => {
  const toon = ALL_DANDYS_WORLD_TOONS.find(t => t.id === toonId) || ALL_DANDYS_WORLD_TOONS[0];

  playKidSound(toon.voiceIntroSound || 'superstar');

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      const voices = getAvailableVoices();

      if (selectedVoiceName && voices.length > 0) {
        const exactMatch = voices.find(v => v.name === selectedVoiceName);
        if (exactMatch) utterance.voice = exactMatch;
      } else if (voices.length > 0) {
        if (toon.pitch > 1.3) {
          const femaleVoice = voices.find(v => {
            const name = v.name.toLowerCase();
            return name.includes('zira') || name.includes('samantha') || name.includes('victoria') || name.includes('female');
          });
          if (femaleVoice) utterance.voice = femaleVoice;
        } else if (toon.pitch < 0.9) {
          const maleVoice = voices.find(v => {
            const name = v.name.toLowerCase();
            return name.includes('david') || name.includes('mark') || name.includes('alex') || name.includes('male');
          });
          if (maleVoice) utterance.voice = maleVoice;
        }
      }

      utterance.pitch = toon.pitch;
      utterance.rate = toon.rate;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Toon speech synthesis error:', e);
    }
  }
};

// Text-To-Speech Narrator Cheer Engine
export const speakCheer = (message: string, voiceStyle: VoiceStyle = 'girl', selectedVoiceName?: string) => {
  playVoiceIntroChime(voiceStyle);

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel(); // Stop current speech
      
      const utterance = new SpeechSynthesisUtterance(message);
      const voices = getAvailableVoices();

      // 1. If user picked an exact specific system voice name
      if (selectedVoiceName && voices.length > 0) {
        const exactMatch = voices.find(v => v.name === selectedVoiceName);
        if (exactMatch) {
          utterance.voice = exactMatch;
          if (voiceStyle === 'filipino' || voiceStyle === 'girl') utterance.pitch = 1.6;
          else if (voiceStyle === 'fairy') utterance.pitch = 1.9;
          else if (voiceStyle === 'boy') utterance.pitch = 0.95;
          else if (voiceStyle === 'robot') utterance.pitch = 0.4;
          else utterance.pitch = 1.3;

          window.speechSynthesis.speak(utterance);
          return;
        }
      }

      // 2. Fallback voice style selection
      if (voiceStyle === 'filipino') {
        utterance.pitch = 1.55;
        utterance.rate = 1.05;
        // Find Filipino/Tagalog voice or clear female voice
        const filipinoVoice = voices.find(v => {
          const lang = v.lang.toLowerCase();
          const name = v.name.toLowerCase();
          return lang.includes('fil') || 
                 lang.includes('tl') || 
                 name.includes('filipino') || 
                 name.includes('tagalog') || 
                 name.includes('rosa') || 
                 name.includes('zira') || 
                 name.includes('samantha') || 
                 name.includes('google us english');
        });
        if (filipinoVoice) utterance.voice = filipinoVoice;
      } else if (voiceStyle === 'girl') {
        utterance.pitch = 1.7;
        utterance.rate = 1.05;
        const femaleVoice = voices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes('zira') || 
                 name.includes('samantha') || 
                 name.includes('victoria') || 
                 name.includes('karen') ||
                 name.includes('aria') ||
                 name.includes('jenny') ||
                 name.includes('catherine') ||
                 name.includes('female') ||
                 name.includes('google us english');
        });
        if (femaleVoice) utterance.voice = femaleVoice;
      } else if (voiceStyle === 'fairy') {
        utterance.pitch = 2.0;
        utterance.rate = 1.2;
        const fairyVoice = voices.find(v => v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha'));
        if (fairyVoice) utterance.voice = fairyVoice;
      } else if (voiceStyle === 'boy') {
        utterance.pitch = 0.9;
        utterance.rate = 1.1;
        const maleVoice = voices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes('david') || name.includes('mark') || name.includes('alex') || name.includes('george') || name.includes('male');
        });
        if (maleVoice) utterance.voice = maleVoice;
      } else if (voiceStyle === 'robot') {
        utterance.pitch = 0.4;
        utterance.rate = 0.85;
      } else {
        utterance.pitch = 1.35;
        utterance.rate = 1.0;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }
};

let currentBgmTrack: BgmTrack = 'off';
let bgmStepIndex = 0;
let bgmIntervalTimer: ReturnType<typeof setInterval> | null = null;

// Garden Center Ragtime Melody
const GARDEN_MELODY = [
  { note: 523.25, duration: 0.18 }, { note: 659.25, duration: 0.18 }, { note: 783.99, duration: 0.18 }, { note: 1046.50, duration: 0.35 },
  { note: 880.00, duration: 0.18 }, { note: 783.99, duration: 0.18 }, { note: 659.25, duration: 0.35 },
  { note: 587.33, duration: 0.18 }, { note: 698.46, duration: 0.18 }, { note: 880.00, duration: 0.18 }, { note: 1174.66, duration: 0.35 },
  { note: 987.77, duration: 0.18 }, { note: 880.00, duration: 0.18 }, { note: 698.46, duration: 0.35 },
  { note: 659.25, duration: 0.18 }, { note: 783.99, duration: 0.18 }, { note: 987.77, duration: 0.18 }, { note: 1318.51, duration: 0.35 },
  { note: 1046.50, duration: 0.18 }, { note: 987.77, duration: 0.18 }, { note: 783.99, duration: 0.35 }
];

// Elevator Night Lounge Melody
const ELEVATOR_MELODY = [
  { note: 349.23, duration: 0.4 }, { note: 440.00, duration: 0.4 }, { note: 523.25, duration: 0.4 }, { note: 659.25, duration: 0.6 },
  { note: 293.66, duration: 0.4 }, { note: 349.23, duration: 0.4 }, { note: 440.00, duration: 0.4 }, { note: 523.25, duration: 0.6 },
  { note: 392.00, duration: 0.4 }, { note: 493.88, duration: 0.4 }, { note: 587.33, duration: 0.4 }, { note: 698.46, duration: 0.6 },
  { note: 261.63, duration: 0.4 }, { note: 329.63, duration: 0.4 }, { note: 392.00, duration: 0.4 }, { note: 493.88, duration: 0.6 }
];

export const stopBgmLoop = () => {
  currentBgmTrack = 'off';
  if (bgmIntervalTimer) {
    clearInterval(bgmIntervalTimer);
    bgmIntervalTimer = null;
  }
};

export const startBgmLoop = (track: BgmTrack) => {
  stopBgmLoop();
  if (track === 'off') return;

  currentBgmTrack = track;
  bgmStepIndex = 0;

  const melody = track === 'elevator' ? ELEVATOR_MELODY : GARDEN_MELODY;
  const intervalMs = track === 'elevator' ? 450 : 230;

  bgmIntervalTimer = setInterval(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const item = melody[bgmStepIndex % melody.length];
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = track === 'elevator' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(item.note, now);

      const vol = track === 'elevator' ? 0.035 : 0.045;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + item.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + item.duration + 0.05);

      bgmStepIndex++;
    } catch (e) {}
  }, intervalMs);
};
