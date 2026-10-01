import React, { useState, useEffect, useRef } from 'react';
import { X, Gamepad2, Sparkles, Trophy, RotateCcw, Volume2, ArrowLeft, ArrowRight, Play, Star, CheckCircle2, Brain, HelpCircle, BookOpen, Compass, HeartPulse, Stethoscope, Thermometer, Smile, Swords, Shield, Zap, Eye, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToonCharacter, VoiceStyle } from '../../types';
import { playKidSound, speakCheer } from '../../utils/audio';
import { ALL_DANDYS_WORLD_TOONS } from '../../utils/toonsData';

interface GamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeToon: ToonCharacter;
  kidName: string;
  onAddBonusStars: (amount: number) => void;
  voiceStyle: VoiceStyle;
  selectedVoiceName?: string;
}

export const GamesModal: React.FC<GamesModalProps> = ({
  isOpen,
  onClose,
  activeToon,
  kidName,
  onAddBonusStars,
  voiceStyle,
  selectedVoiceName
}) => {
  const [activeGame, setActiveGame] = useState<
    'catcher' | 'memory' | 'spinner' | 'whack' | 'balloon' | 'quiz' | 'rhythm' | 'runner' |
    'paint' | 'fossil' | 'stacker' | 'shrimpo' | 'math_detective' | 'spelling' | 'pattern_logic' | 'odd_one_out' |
    'animal_hospital' | 'toon_rivals' | 'coloring_studio' | 'target_archery' | 'music_piano'
  >('catcher');

  const [gameFilter, setGameFilter] = useState<'all' | 'art' | 'rivals' | 'care' | 'arcade' | 'brain'>('all');

  // --- GAME 1: STAR ICHOR CATCHER STATE ---
  const [catcherScore, setCatcherScore] = useState<number>(0);
  const [catcherTime, setCatcherTime] = useState<number>(30);
  const [catcherPlaying, setCatcherPlaying] = useState<boolean>(false);
  const [basketPos, setBasketPos] = useState<number>(50);
  const [fallingItems, setFallingItems] = useState<{ id: number; x: number; y: number; type: 'star' | 'ichor' | 'flower' | 'bad' }[]>([]);
  const fallingIdRef = useRef<number>(0);

  // --- GAME 2: MEMORY MATCH STATE ---
  const [cards, setCards] = useState<{ id: number; toon: ToonCharacter; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);
  const [memoryWon, setMemoryWon] = useState<boolean>(false);

  // --- GAME 3: PRIZE SPINNER STATE ---
  const [spinning, setSpinning] = useState<boolean>(false);
  const [spinDegree, setSpinDegree] = useState<number>(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // --- GAME 4: PEBBLE'S WHACK-A-TOON STATE ---
  const [whackScore, setWhackScore] = useState<number>(0);
  const [whackTime, setWhackTime] = useState<number>(20);
  const [whackPlaying, setWhackPlaying] = useState<boolean>(false);
  const [holes, setHoles] = useState<{ id: number; avatar: string; isMonster: boolean; active: boolean }[]>(
    Array.from({ length: 6 }, (_, i) => ({ id: i, avatar: '🪨', isMonster: false, active: false }))
  );

  // --- GAME 5: POPPY'S BALLOON RUSH STATE ---
  const [balloonScore, setBalloonScore] = useState<number>(0);
  const [balloonTime, setBalloonTime] = useState<number>(25);
  const [balloonPlaying, setBalloonPlaying] = useState<boolean>(false);
  const [balloons, setBalloons] = useState<{ id: number; x: number; y: number; icon: string; pts: number }[]>([]);
  const balloonIdRef = useRef<number>(0);

  // --- GAME 6: BRIGHTNEY'S QUIZ STATE ---
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // --- GAME 7: GOOB'S HUG RHYTHM STATE ---
  const [rhythmSequence, setRhythmSequence] = useState<number[]>([]);
  const [rhythmStep, setRhythmStep] = useState<number>(0);
  const [rhythmPlaying, setRhythmPlaying] = useState<boolean>(false);
  const [rhythmLitIndex, setRhythmLitIndex] = useState<number | null>(null);
  const [rhythmScore, setRhythmScore] = useState<number>(0);
  const [rhythmTurn, setRhythmTurn] = useState<'system' | 'player'>('system');
  const [rhythmGameOver, setRhythmGameOver] = useState<boolean>(false);

  // --- GAME 8: ASTRO'S RUNNER STATE ---
  const [runnerScore, setRunnerScore] = useState<number>(0);
  const [runnerTime, setRunnerTime] = useState<number>(25);
  const [runnerPlaying, setRunnerPlaying] = useState<boolean>(false);
  const [runnerJumping, setRunnerJumping] = useState<boolean>(false);
  const [runnerObstacles, setRunnerObstacles] = useState<{ id: number; x: number; type: 'rock' | 'star' }[]>([]);
  const runnerIdRef = useRef<number>(0);

  // --- GAME 9: FLUTTER'S PAINT MATCH STATE ---
  const [paintScore, setPaintScore] = useState<number>(0);
  const [paintTime, setPaintTime] = useState<number>(20);
  const [paintPlaying, setPaintPlaying] = useState<boolean>(false);
  const [targetPaintColor, setTargetPaintColor] = useState<{ name: string; hex: string } | null>(null);

  const PAINT_COLORS = [
    { name: 'Red 🔴', hex: '#ff4081' },
    { name: 'Blue 💙', hex: '#29b6f6' },
    { name: 'Green 🟢', hex: '#66bb6a' },
    { name: 'Yellow 💛', hex: '#ffee58' },
    { name: 'Purple 💜', hex: '#ab47bc' },
    { name: 'Orange 🧡', hex: '#ff9800' }
  ];

  // --- GAME 10: SHELLY'S FOSSIL DIG STATE ---
  const [fossilScore, setFossilScore] = useState<number>(0);
  const [fossilFound, setFossilFound] = useState<number>(0);
  const [fossilPlaying, setFossilPlaying] = useState<boolean>(false);
  const [fossilGrid, setFossilGrid] = useState<{ id: number; revealed: boolean; item: 'fossil' | 'star' | 'empty' }[]>([]);

  // --- GAME 11: BOXTEN'S BOX STACKER STATE ---
  const [stackerScore, setStackerScore] = useState<number>(0);
  const [stackerTower, setStackerTower] = useState<number>(0);
  const [stackerBoxPos, setStackerBoxPos] = useState<number>(10);
  const [stackerPlaying, setStackerPlaying] = useState<boolean>(false);

  // --- GAME 12: SHRIMPO'S BUBBLE POP STATE ---
  const [shrimpoScore, setShrimpoScore] = useState<number>(0);
  const [shrimpoTime, setShrimpoTime] = useState<number>(20);
  const [shrimpoPlaying, setShrimpoPlaying] = useState<boolean>(false);
  const [shrimpoBubbles, setShrimpoBubbles] = useState<{ id: number; x: number; y: number; popped: boolean }[]>([]);
  const shrimpoIdRef = useRef<number>(0);

  // --- GAME 13: RODGER'S MATH DETECTIVE STATE ---
  const [mathIndex, setMathIndex] = useState<number>(0);
  const [mathScore, setMathScore] = useState<number>(0);
  const [mathCompleted, setMathCompleted] = useState<boolean>(false);

  const MATH_QUESTIONS = [
    { question: "8 + 7 = ?", options: ["13", "15", "16", "14"], answer: 1 },
    { question: "4 × 3 = ?", options: ["12", "14", "10", "15"], answer: 0 },
    { question: "20 - 9 = ?", options: ["12", "10", "11", "9"], answer: 2 },
    { question: "5 × 5 = ?", options: ["20", "25", "30", "15"], answer: 1 },
    { question: "14 + 6 = ?", options: ["18", "20", "22", "19"], answer: 1 },
    { question: "18 ÷ 2 = ?", options: ["9", "8", "10", "7"], answer: 0 },
    { question: "7 × 3 = ?", options: ["24", "18", "20", "21"], answer: 3 },
    { question: "35 - 12 = ?", options: ["21", "23", "25", "20"], answer: 1 },
    { question: "9 + 9 = ?", options: ["18", "16", "20", "17"], answer: 0 },
    { question: "6 × 4 = ?", options: ["20", "22", "24", "26"], answer: 2 },
    { question: "50 - 15 = ?", options: ["30", "35", "40", "25"], answer: 1 },
    { question: "8 × 5 = ?", options: ["35", "45", "30", "40"], answer: 3 },
    { question: "16 + 14 = ?", options: ["30", "28", "32", "29"], answer: 0 },
    { question: "27 ÷ 3 = ?", options: ["8", "7", "9", "10"], answer: 2 },
    { question: "10 × 10 = ?", options: ["90", "100", "110", "80"], answer: 1 },
    { question: "45 - 20 = ?", options: ["25", "30", "20", "15"], answer: 0 },
    { question: "12 + 19 = ?", options: ["30", "29", "31", "32"], answer: 2 },
    { question: "7 × 6 = ?", options: ["40", "42", "44", "38"], answer: 1 },
    { question: "32 ÷ 4 = ?", options: ["8", "6", "9", "7"], answer: 0 },
    { question: "15 + 25 = ?", options: ["35", "45", "50", "40"], answer: 3 },
    { question: "9 × 4 = ?", options: ["32", "36", "40", "34"], answer: 1 },
    { question: "60 - 25 = ?", options: ["35", "40", "30", "45"], answer: 0 },
    { question: "8 × 8 = ?", options: ["56", "60", "64", "72"], answer: 2 },
    { question: "40 ÷ 5 = ?", options: ["7", "8", "9", "6"], answer: 1 },
    { question: "23 + 17 = ?", options: ["40", "38", "42", "45"], answer: 0 },
    { question: "7 × 7 = ?", options: ["42", "45", "48", "49"], answer: 3 },
    { question: "100 - 45 = ?", options: ["50", "55", "60", "45"], answer: 1 },
    { question: "36 ÷ 6 = ?", options: ["6", "7", "5", "8"], answer: 0 },
    { question: "12 × 3 = ?", options: ["32", "34", "36", "38"], answer: 2 },
    { question: "50 + 50 = ?", options: ["90", "100", "110", "120"], answer: 1 }
  ];

  // --- GAME 14: TISH'S SPELLING BEE STATE ---
  const [spellingIndex, setSpellingIndex] = useState<number>(0);
  const [spellingScore, setSpellingScore] = useState<number>(0);
  const [spellingCompleted, setSpellingCompleted] = useState<boolean>(false);

  const SPELLING_PUZZLES = [
    { display: "S T _ R", hint: "Glows in the night sky ⭐", options: ["A", "O", "E", "U"], answer: 0 },
    { display: "S C H _ O L", hint: "Where we learn with friends 🎒", options: ["O", "A", "I", "E"], answer: 0 },
    { display: "A L T H _ A", hint: "Superstar Girl Crown 👑", options: ["E", "A", "I", "U"], answer: 0 },
    { display: "F L O _ E R", hint: "Pretty Dandy garden blossom 🌻", options: ["W", "V", "R", "L"], answer: 0 },
    { display: "B _ O K", hint: "Something fun to read 📚", options: ["O", "U", "A", "I"], answer: 0 },
    { display: "P _ N C I L", hint: "Used to write & draw ✏️", options: ["E", "A", "I", "O"], answer: 0 },
    { display: "G A _ D E N", hint: "Where flowers grow 🌺", options: ["R", "L", "M", "N"], answer: 0 },
    { display: "H U _", hint: "Friendly warm embrace 🫂", options: ["G", "P", "T", "D"], answer: 0 },
    { display: "M _ U S E", hint: "Cute little creature 🐭", options: ["O", "A", "I", "E"], answer: 0 },
    { display: "A P P _ E", hint: "Yummy red fruit 🍎", options: ["L", "R", "N", "M"], answer: 0 },
    { display: "H _ A R T", hint: "Symbol of love 💖", options: ["E", "A", "I", "O"], answer: 0 },
    { display: "S U N S H _ N E", hint: "Bright morning light ☀️", options: ["I", "E", "A", "O"], answer: 0 },
    { display: "B _ L L O O N", hint: "Floats up high 🎈", options: ["A", "O", "E", "I"], answer: 0 },
    { display: "P _ T A L", hint: "Part of Dandy's flower 🌸", options: ["E", "A", "I", "O"], answer: 0 },
    { display: "F R _ E N D", hint: "Someone fun to play with 👭", options: ["I", "E", "A", "O"], answer: 0 },
    { display: "C _ K E", hint: "Sweet birthday treat 🎂", options: ["A", "O", "E", "U"], answer: 0 },
    { display: "M _ U S I C", hint: "Fun songs to dance to 🎵", options: ["U", "A", "O", "I"], answer: 0 },
    { display: "P _ R K", hint: "Where we play on slides 🛝", options: ["A", "O", "E", "U"], answer: 0 },
    { display: "W _ T E R", hint: "Fresh drink for health 🥛", options: ["A", "O", "E", "I"], answer: 0 },
    { display: "S M _ L E", hint: "Happy face expression 😄", options: ["I", "A", "E", "O"], answer: 0 },
    { display: "P _ U Z Z L E", hint: "Fun brain challenge 🧩", options: ["U", "A", "O", "I"], answer: 0 },
    { display: "R _ I N B O W", hint: "7 colorful sky arcs 🌈", options: ["A", "E", "I", "O"], answer: 0 },
    { display: "C R _ W N", hint: "Royal golden hat 👑", options: ["O", "A", "E", "U"], answer: 0 },
    { display: "T O O _", hint: "Friendly cartoon helper 🧸", options: ["N", "M", "L", "R"], answer: 0 },
    { display: "R O C K _ T", hint: "Flies up into space 🚀", options: ["E", "A", "I", "O"], answer: 0 },
    { display: "B _ S K E T", hint: "Holds Star Ichor 🧺", options: ["A", "O", "E", "I"], answer: 0 },
    { display: "C H _ E R", hint: "Voices encouraging you 🗣️", options: ["E", "A", "I", "O"], answer: 0 },
    { display: "S T O _ Y", hint: "Bedtime book tale 📖", options: ["R", "L", "N", "M"], answer: 0 },
    { display: "H _ P P Y", hint: "Feels full of joy 😊", options: ["A", "E", "I", "O"], answer: 0 },
    { display: "V _ C T O R Y", hint: "Winning the game 🏆", options: ["I", "E", "A", "O"], answer: 0 }
  ];

  // --- GAME 15: COSMO'S PATTERN LOGIC STATE ---
  const [patternIndex, setPatternIndex] = useState<number>(0);
  const [patternScore, setPatternScore] = useState<number>(0);
  const [patternCompleted, setPatternCompleted] = useState<boolean>(false);

  const PATTERN_PUZZLES = [
    { sequence: "🧁  🍪  🧁  🍪  ❓", hint: "What comes next in the bakery?", options: ["🧁", "🍪", "🎂", "🍩"], answer: 0 },
    { sequence: "⭐️  🌸  ⭐️  🌸  ❓", hint: "What comes next in the garden?", options: ["⭐️", "🌸", "🌻", "🌿"], answer: 0 },
    { sequence: "🔴  💙  🟢  🔴  💙  ❓", hint: "What color comes next?", options: ["🟢", "🔴", "💙", "🟡"], answer: 0 },
    { sequence: "📦  🪨  📦  🪨  ❓", hint: "Which toon item comes next?", options: ["📦", "🪨", "🎈", "🧪"], answer: 0 },
    { sequence: "🚀  🌙  🚀  🌙  ❓", hint: "What space icon comes next?", options: ["🚀", "🌙", "⭐", "☄️"], answer: 0 },
    { sequence: "🎈  🎉  🎈  🎉  ❓", hint: "What party icon comes next?", options: ["🎈", "🎉", "🎁", "🍰"], answer: 0 },
    { sequence: "🍎  🍌  🍎  🍌  ❓", hint: "Which fruit comes next?", options: ["🍎", "🍌", "🍇", "🍊"], answer: 0 },
    { sequence: "👑  💎  👑  💎  ❓", hint: "Which royal item comes next?", options: ["👑", "💎", "⭐", "🏆"], answer: 0 },
    { sequence: "🐶  🐱  🐶  🐱  ❓", hint: "Which cute pet comes next?", options: ["🐶", "🐱", "🐰", "🐹"], answer: 0 },
    { sequence: "☀️  🌙  ☀️  🌙  ❓", hint: "What sky symbol comes next?", options: ["☀️", "🌙", "⭐", "☁️"], answer: 0 },
    { sequence: "🟡  🟢  🟡  🟢  ❓", hint: "Which color comes next?", options: ["🟡", "🟢", "🔴", "💙"], answer: 0 },
    { sequence: "💖  💕  💖  💕  ❓", hint: "Which heart comes next?", options: ["💖", "💕", "💘", "💓"], answer: 0 },
    { sequence: "🎨  🖌️  🎨  🖌️  ❓", hint: "Which art tool comes next?", options: ["🎨", "🖌️", "✏️", "🖍️"], answer: 0 },
    { sequence: "🌻  🌱  🌻  🌱  ❓", hint: "Which garden plant comes next?", options: ["🌻", "🌱", "🌹", "🍀"], answer: 0 },
    { sequence: "🧪  ⭐️  🧪  ⭐️  ❓", hint: "Which item comes next?", options: ["🧪", "⭐️", "🌻", "🪨"], answer: 0 },
    { sequence: "🎒  ✏️  🎒  ✏️  ❓", hint: "Which school item comes next?", options: ["🎒", "✏️", "📚", "📐"], answer: 0 },
    { sequence: "🐝  🍯  🐝  🍯  ❓", hint: "What comes next in nature?", options: ["🐝", "🍯", "🌸", "🌻"], answer: 0 },
    { sequence: "🔔  🎵  🔔  🎵  ❓", hint: "Which music note comes next?", options: ["🔔", "🎵", "🎶", "🎷"], answer: 0 },
    { sequence: "⚽️  🏀  ⚽️  🏀  ❓", hint: "Which sports ball comes next?", options: ["⚽️", "🏀", "🏐", "🎾"], answer: 0 },
    { sequence: "🚗  🚌  🚗  🚌  ❓", hint: "Which vehicle comes next?", options: ["🚗", "🚌", "🚲", "🚒"], answer: 0 },
    { sequence: "🐟  🐠  🐟  🐠  ❓", hint: "Which ocean fish comes next?", options: ["🐟", "🐠", "🐡", "🐙"], answer: 0 },
    { sequence: "🍦  🍧  🍦  🍧  ❓", hint: "Which sweet treat comes next?", options: ["🍦", "🍧", "🧁", "🍩"], answer: 0 },
    { sequence: "📺  📻  📺  📻  ❓", hint: "Which electronic item comes next?", options: ["📺", "📻", "📱", "💻"], answer: 0 },
    { sequence: "🧸  🪀  🧸  🪀  ❓", hint: "Which toy comes next?", options: ["🧸", "🪀", "🎈", "🎨"], answer: 0 },
    { sequence: "🎁  🎀  🎁  🎀  ❓", hint: "Which gift item comes next?", options: ["🎁", "🎀", "🎉", "🍰"], answer: 0 },
    { sequence: "🍇  🍓  🍇  🍓  ❓", hint: "Which fruit comes next?", options: ["🍇", "🍓", "🍎", "🍐"], answer: 0 },
    { sequence: "🧹  🧼  🧹  🧼  ❓", hint: "Which chore tool comes next?", options: ["🧹", "🧼", "🧽", "🚿"], answer: 0 },
    { sequence: "🧩  🎲  🧩  🎲  ❓", hint: "Which game item comes next?", options: ["🧩", "🎲", "🎯", "🃏"], answer: 0 },
    { sequence: "🎺  🥁  🎺  🥁  ❓", hint: "Which instrument comes next?", options: ["🎺", "🥁", "🎸", "🎹"], answer: 0 },
    { sequence: "👑  ⭐️  🏆  👑  ⭐️  ❓", hint: "Which victory reward comes next?", options: ["🏆", "👑", "⭐️", "🧪"], answer: 0 }
  ];

  // --- GAME 16: FINN'S ODD-ONE-OUT STATE ---
  const [oddIndex, setOddIndex] = useState<number>(0);
  const [oddScore, setOddScore] = useState<number>(0);
  const [oddCompleted, setOddCompleted] = useState<boolean>(false);
  const [oddExplanation, setOddExplanation] = useState<string | null>(null);

  const ODD_PUZZLES = [
    { items: ["🍎 Apple", "🍌 Banana", "🥕 Carrot", "🍇 Grapes"], answer: 2, reason: "Carrot 🥕 is a vegetable, others are delicious fruits!" },
    { items: ["🐶 Puppy", "🐱 Kitty", "🐰 Bunny", "🚗 Car"], answer: 3, reason: "Car 🚗 is a vehicle, others are cute animal pets!" },
    { items: ["📕 Book", "✏️ Pencil", "📐 Ruler", "🍦 Ice Cream"], answer: 3, reason: "Ice Cream 🍦 is a treat, others are school supplies!" },
    { items: ["⚽ Football", "🏀 Basketball", "🏐 Volleyball", "🎸 Guitar"], answer: 3, reason: "Guitar 🎸 is a musical instrument, others are sports balls!" },
    { items: ["☀️ Sun", "🌙 Moon", "⭐️ Star", "👟 Shoe"], answer: 3, reason: "Shoe 👟 is footwear, others are sky objects!" },
    { items: ["🥛 Milk", "🧃 Juice", "💧 Water", "🍕 Pizza"], answer: 3, reason: "Pizza 🍕 is a food, others are healthy drinks!" },
    { items: ["🦁 Lion", "🐯 Tiger", "🐻 Bear", "✈️ Airplane"], answer: 3, reason: "Airplane ✈️ is a vehicle, others are wild animals!" },
    { items: ["🟥 Square", "🔵 Circle", "🔺 Triangle", "🍎 Apple"], answer: 3, reason: "Apple 🍎 is a fruit, others are geometric shapes!" },
    { items: ["🪥 Toothbrush", "🧼 Soap", "🧴 Shampoo", "🛹 Skateboard"], answer: 3, reason: "Skateboard 🛹 is a ride, others are bath supplies!" },
    { items: ["🎺 Trumpet", "🎻 Violin", "🥁 Drum", "🍔 Hamburger"], answer: 3, reason: "Hamburger 🍔 is food, others are musical instruments!" },
    { items: ["🚗 Car", "🚌 Bus", "🚲 Bicycle", "🥦 Broccoli"], answer: 3, reason: "Broccoli 🥦 is a vegetable, others are transport vehicles!" },
    { items: ["👕 Shirt", "👖 Pants", "🧦 Socks", "⏰ Clock"], answer: 3, reason: "Clock ⏰ tells time, others are clothes to wear!" },
    { items: ["🌧️ Rain", "❄️ Snow", "🌬️ Wind", "🛋️ Sofa"], answer: 3, reason: "Sofa 🛋️ is furniture, others are weather conditions!" },
    { items: ["🍓 Strawberry", "🍒 Cherry", "🍉 Watermelon", "🥔 Potato"], answer: 3, reason: "Potato 🥔 is a root veggie, others are sweet red fruits!" },
    { items: ["🦅 Eagle", "🦜 Parrot", "🦉 Owl", "🐬 Dolphin"], answer: 3, reason: "Dolphin 🐬 swims in water, others are flying birds!" },
    { items: ["🛌 Bed", "🪑 Chair", "🛋️ Sofa", "🍉 Watermelon"], answer: 3, reason: "Watermelon 🍉 is a fruit, others are room furniture!" },
    { items: ["🎒 Backpack", "📓 Notebook", "🖊️ Pen", "🍰 Cake"], answer: 3, reason: "Cake 🍰 is a dessert, others are school materials!" },
    { items: ["🥐 Croissant", "🍞 Bread", "🥨 Pretzels", "🚲 Bicycle"], answer: 3, reason: "Bicycle 🚲 is a ride, others are baked goods!" },
    { items: ["🚑 Ambulance", "🚒 Fire Truck", "🚓 Police Car", "🎸 Guitar"], answer: 3, reason: "Guitar 🎸 plays music, others are rescue vehicles!" },
    { items: ["🐸 Frog", "🐢 Turtle", "🐊 Alligator", "🚁 Helicopter"], answer: 3, reason: "Helicopter 🚁 flies in sky, others are reptiles/amphibians!" },
    { items: ["🔨 Hammer", "🪛 Screwdriver", "🔧 Wrench", "🍦 Ice Cream"], answer: 3, reason: "Ice Cream 🍦 is food, others are hardware tools!" },
    { items: ["🔑 Key", "🔒 Lock", "🚪 Door", "🍉 Watermelon"], answer: 3, reason: "Watermelon 🍉 is food, others are house hardware items!" },
    { items: ["👁️ Eye", "👂 Ear", "👃 Nose", "🎒 Backpack"], answer: 3, reason: "Backpack 🎒 is a bag, others are human body senses!" },
    { items: ["🌲 Pine Tree", "🌿 Fern", "🌵 Cactus", "📱 Smartphone"], answer: 3, reason: "Smartphone 📱 is technology, others are green plants!" },
    { items: ["🐝 Bee", "🦋 Butterfly", "🐞 Ladybug", "🛥️ Boat"], answer: 3, reason: "Boat 🛥️ floats on water, others are flying insects!" },
    { items: ["🍫 Chocolate", "🍬 Candy", "🍩 Donut", "🥕 Carrot"], answer: 3, reason: "Carrot 🥕 is a healthy veggie, others are sweet treats!" },
    { items: ["👟 Sneakers", "🥾 Boots", "👡 Sandals", "⚽ Soccer Ball"], answer: 3, reason: "Soccer Ball ⚽ is a sport ball, others are footwear!" },
    { items: ["🌅 Morning", "☀️ Afternoon", "🌙 Night", "🍕 Pizza"], answer: 3, reason: "Pizza 🍕 is food, others are times of the day!" },
    { items: ["🐋 Whale", "🐬 Dolphin", "🦈 Shark", "🦅 Eagle"], answer: 3, reason: "Eagle 🦅 flies in sky, others are sea sea creatures!" },
    { items: ["⭐ Star", "🧪 Ichor", "🌻 Dandy", "🚜 Tractor"], answer: 3, reason: "Tractor 🚜 is farm machinery, others are Dandy's World items!" }
  ];

  // --- GAME 17: ANIMAL HOSPITAL VET CLINIC STATE ---
  const [hospitalPatientIndex, setHospitalPatientIndex] = useState<number>(0);
  const [hospitalScore, setHospitalScore] = useState<number>(0);
  const [hospitalPatientsHealed, setHospitalPatientsHealed] = useState<number>(0);
  const [hospitalCompleted, setHospitalCompleted] = useState<boolean>(false);
  const [hospitalFeedbackMsg, setHospitalFeedbackMsg] = useState<string | null>(null);

  const ANIMAL_PATIENTS = [
    {
      name: "Spot the Puppy",
      avatar: "🐶",
      condition: "Scratched Paw & Boo-boo 🤕",
      symptom: "Ow! Spot scratched his paw playing in the garden!",
      neededTool: "bandage",
      successMsg: "Woof woof! Spot's paw is bandaged up nicely!"
    },
    {
      name: "Whiskers the Kitty",
      avatar: "🐱",
      condition: "High Fever & Hot Head 🤒",
      symptom: "Meow... Whiskers feels warm and has a high fever!",
      neededTool: "thermometer",
      successMsg: "Purrr! Whiskers' fever is gone thanks to your checkup!"
    },
    {
      name: "Fluffy the Bunny",
      avatar: "🐰",
      condition: "Muddy Fur & Dirty Ears 🛁",
      symptom: "Fluffy got muddy hopping around the Toon garden!",
      neededTool: "soap",
      successMsg: "Splish splash! Fluffy is squeaky clean and fluffy again!"
    },
    {
      name: "Chirpy the Parrot",
      avatar: "🦜",
      condition: "Hungry & Tummy Rumbles 🦴",
      symptom: "Squawk! Chirpy hasn't eaten his morning healthy snack!",
      neededTool: "treat",
      successMsg: "Chirp chirp! Chirpy enjoyed the yummy healthy treat!"
    },
    {
      name: "Pebble Pet",
      avatar: "🪨",
      condition: "Sad & Needs Love 🫂",
      symptom: "Pebble pet is feeling lonely and needs a warm toon hug!",
      neededTool: "hug",
      successMsg: "Yay! Pebble Pet is glowing with happiness from your hug!"
    }
  ];

  const HOSPITAL_TOOLS = [
    { id: "stethoscope", label: "Stethoscope", icon: "🩺" },
    { id: "thermometer", label: "Thermometer & Ice", icon: "🌡️" },
    { id: "bandage", label: "Bandage 🩹", icon: "🩹" },
    { id: "soap", label: "Soap & Bath", icon: "🧼" },
    { id: "treat", label: "Carrot Snack", icon: "🥕" },
    { id: "hug", label: "Warm Toon Hug", icon: "🫂" }
  ];

  // --- GAME 18: TOON RIVALS ARENA STATE ---
  const [rivalBossIndex, setRivalBossIndex] = useState<number>(0);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [rivalHp, setRivalHp] = useState<number>(100);
  const [rivalPlaying, setRivalPlaying] = useState<boolean>(false);
  const [rivalBattleLog, setRivalBattleLog] = useState<string>("Select Start to battle Rival Twisteds!");
  const [rivalVictory, setRivalVictory] = useState<boolean>(false);

  const RIVAL_BOSSES = [
    {
      id: "shrimpo",
      name: "Twisted Shrimpo 🦐",
      title: "The Angry Rival",
      avatar: "🦐",
      hp: 100,
      bg: "#ffebee",
      counterType: "shield",
      counterBtnLabel: "🛡️ Power Shield",
      taunt: "GRRR! Shrimpo is super angry and ready to brawl!"
    },
    {
      id: "vee",
      name: "Twisted Vee 📺",
      title: "The Electric TV Rival",
      avatar: "📺",
      hp: 120,
      bg: "#e0f7fa",
      counterType: "zap",
      counterBtnLabel: "⚡ Deflect Laser",
      taunt: "BZZZT! Vee is broadcasting static shockwaves!"
    },
    {
      id: "pebble",
      name: "Twisted Pebble 🪨",
      title: "The Rock Monster Rival",
      avatar: "🪨",
      hp: 140,
      bg: "#efebe9",
      counterType: "jump",
      counterBtnLabel: "🦘 High Jump Dodge",
      taunt: "RUMBLE! Twisted Pebble is rolling down rocks!"
    },
    {
      id: "dandy",
      name: "Twisted Dandy 🌻",
      title: "The Ultimate Garden Boss",
      avatar: "🌻",
      hp: 160,
      bg: "#fff8e1",
      counterType: "blaster",
      counterBtnLabel: "🧪 Star Ichor Blaster",
      taunt: "FLOURISH! Dandy unleashes the ultimate Ichor storm!"
    }
  ];

  // --- GAME 19: COLORING STUDIO 2 STATE ---
  const [coloringCanvasIndex, setColoringCanvasIndex] = useState<number>(0);
  const [selectedCrayonColor, setSelectedCrayonColor] = useState<string>('#ff4081');
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [canvasStickers, setCanvasStickers] = useState<{ id: number; x: number; y: number; icon: string }[]>([]);
  const [coloringCompleted, setColoringCompleted] = useState<boolean>(false);
  const [regionColors, setRegionColors] = useState<{ [key: string]: string }>({
    bg: '#ffffff',
    body: '#fff8e1',
    accent1: '#ffca28',
    accent2: '#66bb6a',
    frame: '#ff4081'
  });

  const COLORING_CANVASES = [
    {
      id: 'dandy_garden',
      title: "Dandy's Sun Flower Garden 🌻",
      icon: "🌻",
      defaultBg: "#ffffff",
      regions: [
        { id: "bg", name: "Sky & Ground 🌤️", defaultColor: "#e0f7fa" },
        { id: "body", name: "Dandy's Flower Face 🌻", defaultColor: "#fff8e1" },
        { id: "accent1", name: "Flower Petals ⭐", defaultColor: "#ffca28" },
        { id: "accent2", name: "Garden Grass & Leaves 🌱", defaultColor: "#66bb6a" },
        { id: "frame", name: "Picture Frame 🖼️", defaultColor: "#ff4081" }
      ]
    },
    {
      id: 'goob_hugland',
      title: "Goob's Heart Hugland 🫂",
      icon: "🫂",
      defaultBg: "#ffffff",
      regions: [
        { id: "bg", name: "Heart Background 💖", defaultColor: "#fce4ec" },
        { id: "body", name: "Goob's Plush Body 🫂", defaultColor: "#e53935" },
        { id: "accent1", name: "Bowtie & Ribbon 🎀", defaultColor: "#ffca28" },
        { id: "accent2", name: "Heart Sparkles 💕", defaultColor: "#ff4081" },
        { id: "frame", name: "Picture Frame 🖼️", defaultColor: "#ab47bc" }
      ]
    },
    {
      id: 'vee_tv',
      title: "Vee's Retro TV Show 📺",
      icon: "📺",
      defaultBg: "#ffffff",
      regions: [
        { id: "bg", name: "Studio Backdrop 🎬", defaultColor: "#e0f7fa" },
        { id: "body", name: "Vee TV Casing 📺", defaultColor: "#00bcd4" },
        { id: "accent1", name: "TV Screen Display ⚡", defaultColor: "#ffee58" },
        { id: "accent2", name: "Antenna & Knobs 📻", defaultColor: "#212121" },
        { id: "frame", name: "Picture Frame 🖼️", defaultColor: "#3f51b5" }
      ]
    },
    {
      id: 'astro_space',
      title: "Astro's Star Rocket 🚀",
      icon: "🚀",
      defaultBg: "#ffffff",
      regions: [
        { id: "bg", name: "Cosmic Galaxy 🌌", defaultColor: "#1a237e" },
        { id: "body", name: "Rocket Ship Hull 🚀", defaultColor: "#ffffff" },
        { id: "accent1", name: "Star Thruster Flame 🔥", defaultColor: "#ff7043" },
        { id: "accent2", name: "Orbit Stars & Moon 🌙", defaultColor: "#ffca28" },
        { id: "frame", name: "Picture Frame 🖼️", defaultColor: "#00e676" }
      ]
    }
  ];

  const CRAYON_SWATCHES = [
    { name: 'Poppy Pink', hex: '#ff4081' },
    { name: 'Star Gold', hex: '#ffca28' },
    { name: 'Ocean Blue', hex: '#29b6f6' },
    { name: 'Leaf Green', hex: '#66bb6a' },
    { name: 'Berry Purple', hex: '#ab47bc' },
    { name: 'Sunset Orange', hex: '#ff7043' },
    { name: 'Goob Red', hex: '#e53935' },
    { name: 'Turquoise', hex: '#00bcd4' },
    { name: 'Bright Yellow', hex: '#ffee58' },
    { name: 'Bubblegum', hex: '#f48fb1' },
    { name: 'Cloud White', hex: '#ffffff' },
    { name: 'Ink Black', hex: '#212121' }
  ];

  const ART_STICKERS = ["⭐", "🌸", "💖", "🎈", "🦋", "🎀", "🍪", "👑"];

  const QUIZ_QUESTIONS = [
    { question: "What is 5 + 4?", options: ["8", "9", "10", "7"], answer: 1 },
    { question: "Spell the word for ⭐!", options: ["S-T-A-R", "S-T-O-R", "S-T-A-N", "S-T-E-R"], answer: 0 },
    { question: "Which Toon loves big hugs?", options: ["Shrimpo 🦐", "Goob 🫂", "Rodger 🔍", "Boxten 📦"], answer: 1 },
    { question: "What time is morning bath time?", options: ["7:10 AM 🧼", "12:00 PM 🕛", "9:00 PM 🌙", "4:00 PM 🎒"], answer: 0 },
    { question: "How many days are in a week?", options: ["5 Days", "6 Days", "7 Days 🗓️", "8 Days"], answer: 2 },
    { question: "What color is the bright sun?", options: ["Blue", "Yellow 💛", "Green", "Purple"], answer: 1 },
    { question: "Which animal says Woof Woof?", options: ["Puppy 🐶", "Kitty 🐱", "Duck 🦆", "Cow 🐮"], answer: 0 },
    { question: "What is 10 + 10?", options: ["15", "18", "20 ⭐️", "25"], answer: 2 },
    { question: "Which shape has 3 sides?", options: ["Square", "Triangle 🔺", "Circle", "Rectangle"], answer: 1 },
    { question: "What do honey bees make?", options: ["Honey 🍯", "Milk", "Juice", "Water"], answer: 0 },
    { question: "Which Toon is a bright TV?", options: ["Poppy", "Astro", "Dandy", "Vee 📺"], answer: 3 },
    { question: "What fruit is red and crunchy?", options: ["Banana", "Apple 🍎", "Orange", "Grape"], answer: 1 },
    { question: "How many legs does a spider have?", options: ["6 Legs", "4 Legs", "8 Legs 🕷️", "10 Legs"], answer: 2 },
    { question: "What season comes after Winter?", options: ["Spring 🌸", "Summer", "Fall", "Winter"], answer: 0 },
    { question: "What color is grass in the garden?", options: ["Red", "Green 🟢", "Blue", "Yellow"], answer: 1 },
    { question: "Which Toon has flower petals?", options: ["Dandy 🌻", "Shrimpo", "Rodger", "Finn"], answer: 0 },
    { question: "What is 12 - 4?", options: ["6", "7", "8 🔢", "9"], answer: 2 },
    { question: "Which cute pet says Meow?", options: ["Puppy", "Kitty 🐱", "Bunny", "Parrot"], answer: 1 },
    { question: "What do we wear on our feet?", options: ["Hats", "Gloves", "Shirts", "Shoes 👟"], answer: 3 },
    { question: "What subject uses numbers & plus signs?", options: ["Math 🔢", "Art", "Music", "Gym"], answer: 0 },
    { question: "Which planet is our home planet?", options: ["Mars", "Earth 🌍", "Jupiter", "Venus"], answer: 1 },
    { question: "What color is the sky on a sunny day?", options: ["Red", "Green", "Blue 💙", "Black"], answer: 2 },
    { question: "How many fingers on one hand?", options: ["5 Fingers 🖐️", "4 Fingers", "6 Fingers", "10 Fingers"], answer: 0 },
    { question: "What is 3 × 4?", options: ["10", "12 🔢", "14", "16"], answer: 1 },
    { question: "Which Toon loves shiny tape ribbon?", options: ["Shrimpo", "Gigi", "Poppy 🌸", "Boxten"], answer: 2 },
    { question: "What is frozen ice water?", options: ["Ice 🧊", "Steam", "Rain", "Cloud"], answer: 0 },
    { question: "What vegetable is orange & good for eyes?", options: ["Potato", "Carrot 🥕", "Corn", "Peas"], answer: 1 },
    { question: "What month is Christmas?", options: ["October", "November", "January", "December 🎄"], answer: 3 },
    { question: "What is 100 minus 50?", options: ["40", "50 ⭐️", "60", "70"], answer: 1 },
  ];

  // --- GAME 20: DANDY'S TARGET ARCHERY BLITZ STATE ---
  const [archeryScore, setArcheryScore] = useState<number>(0);
  const [archeryTime, setArcheryTime] = useState<number>(25);
  const [archeryPlaying, setArcheryPlaying] = useState<boolean>(false);
  const archeryIdRef = useRef<number>(0);
  const [archeryTargets, setArcheryTargets] = useState<{ id: number; x: number; y: number; icon: string; pts: number }[]>([]);

  // --- GAME 21: SPROUT'S MUSIC PIANO HERO STATE ---
  const [pianoScore, setPianoScore] = useState<number>(0);
  const [pianoTime, setPianoTime] = useState<number>(25);
  const [pianoPlaying, setPianoPlaying] = useState<boolean>(false);
  const pianoIdRef = useRef<number>(0);
  const [pianoNotes, setPianoNotes] = useState<{ id: number; lane: number; y: number; noteName: string; color: string }[]>([]);

  const PIANO_LANES = [
    { lane: 0, keyName: "DO 🎹", color: "#ff4081" },
    { lane: 1, keyName: "RE 🎵", color: "#ffca28" },
    { lane: 2, keyName: "MI 🎼", color: "#66bb6a" },
    { lane: 3, keyName: "FA 🎶", color: "#29b6f6" }
  ];

  // --- GAME 1 LOGIC: CATCHER ---
  const startCatcherGame = () => {
    setCatcherScore(0);
    setCatcherTime(30);
    setBasketPos(50);
    setFallingItems([]);
    setCatcherPlaying(true);
    playKidSound('arcade');
    speakCheer(`${kidName}, get ready to catch the Star Ichor!`, voiceStyle, selectedVoiceName);
  };

  useEffect(() => {
    if (!catcherPlaying) return;

    const timer = setInterval(() => {
      setCatcherTime(prev => {
        if (prev <= 1) {
          setCatcherPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      fallingIdRef.current += 1;
      const types: ('star' | 'ichor' | 'flower' | 'bad')[] = ['star', 'ichor', 'flower', 'star', 'bad'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const newX = Math.floor(Math.random() * 85) + 5;

      setFallingItems(prev => [
        ...prev.slice(-12),
        { id: fallingIdRef.current, x: newX, y: 0, type: randomType }
      ]);
    }, 600);

    const physics = setInterval(() => {
      setFallingItems(prev => {
        return prev
          .map(item => ({ ...item, y: item.y + 6 }))
          .filter(item => {
            if (item.y >= 75 && item.y <= 90) {
              if (Math.abs(item.x - basketPos) < 15) {
                let pts = 10;
                if (item.type === 'star') pts = 20;
                if (item.type === 'flower') pts = 30;
                if (item.type === 'bad') pts = -15;

                setCatcherScore(s => Math.max(0, s + pts));
                playKidSound(item.type === 'bad' ? 'arcade' : 'superstar');
                return false;
              }
            }
            return item.y < 100;
          });
      });
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      clearInterval(physics);
    };
  }, [catcherPlaying, basketPos]);

  useEffect(() => {
    if (catcherTime === 0 && !catcherPlaying && catcherScore > 0) {
      const bonusStars = Math.max(1, Math.floor(catcherScore / 40));
      onAddBonusStars(bonusStars);
      try { confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }); } catch (e) {}
      speakCheer(`Great game ${kidName}! You earned ${bonusStars} bonus star ichor!`, voiceStyle, selectedVoiceName);
    }
  }, [catcherTime, catcherPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!catcherPlaying) return;
      if (e.key === 'ArrowLeft') setBasketPos(p => Math.max(5, p - 8));
      if (e.key === 'ArrowRight') setBasketPos(p => Math.min(85, p + 8));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [catcherPlaying]);

  // --- GAME 2 LOGIC: MEMORY MATCH ---
  const initMemoryGame = () => {
    const toonsPool = ALL_DANDYS_WORLD_TOONS.slice(0, 6);
    const deck: { id: number; toon: ToonCharacter; flipped: boolean; matched: boolean }[] = [];

    toonsPool.forEach((toon, idx) => {
      deck.push({ id: idx * 2, toon, flipped: false, matched: false });
      deck.push({ id: idx * 2 + 1, toon, flipped: false, matched: false });
    });

    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedCards([]);
    setMemoryMoves(0);
    setMemoryWon(false);
  };

  useEffect(() => {
    if (activeGame === 'memory' && cards.length === 0) {
      initMemoryGame();
    }
  }, [activeGame]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length >= 2 || cards[index].flipped || cards[index].matched) return;

    playKidSound('superstar');
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (newCards[firstIdx].toon.id === newCards[secondIdx].toon.id) {
        newCards[firstIdx].matched = true;
        newCards[secondIdx].matched = true;
        setCards(newCards);
        setFlippedCards([]);
        playKidSound('trumpet');

        if (newCards.every(c => c.matched)) {
          setMemoryWon(true);
          onAddBonusStars(3);
          try { confetti({ particleCount: 120, spread: 90 }); } catch (e) {}
          speakCheer(`Bingo! ${kidName}, you matched all the Toon pairs! 3 Bonus Stars!`, voiceStyle, selectedVoiceName);
        }
      } else {
        setTimeout(() => {
          newCards[firstIdx].flipped = false;
          newCards[secondIdx].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  // --- GAME 3 LOGIC: SPINNER ---
  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);
    playKidSound('party');

    const extraRounds = 5 * 360;
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = spinDegree + extraRounds + randomAngle;

    setSpinDegree(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      const prizes = [
        { label: '🧪 +2 Star Ichor!', stars: 2 },
        { label: '🍦 Ice Cream Reward Pass!', stars: 3 },
        { label: '⭐️ +5 SUPER BONUS STARS!', stars: 5 },
        { label: '🎁 Surprise Toy Pass!', stars: 2 },
        { label: '🏆 Golden Trophy Award!', stars: 4 },
        { label: '🌟 +1 Lucky Star!', stars: 1 }
      ];
      const winIndex = Math.floor((360 - (randomAngle % 360)) / 60) % 6;
      const prize = prizes[winIndex];

      setSpinResult(prize.label);
      onAddBonusStars(prize.stars);
      try { confetti({ particleCount: 100, spread: 70 }); } catch (e) {}
      speakCheer(`Jackpot ${kidName}! You won ${prize.label}!`, voiceStyle, selectedVoiceName);
    }, 3000);
  };

  // --- GAME 4 LOGIC: PEBBLE'S WHACK-A-TOON ---
  const startWhackGame = () => {
    setWhackScore(0);
    setWhackTime(20);
    setWhackPlaying(true);
    playKidSound('arcade');
    speakCheer(`${kidName}, tap the friendly Toons! Avoid the monsters!`, voiceStyle, selectedVoiceName);
  };

  useEffect(() => {
    if (!whackPlaying) return;

    const timer = setInterval(() => {
      setWhackTime(t => {
        if (t <= 1) {
          setWhackPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const holeInterval = setInterval(() => {
      const holeIndex = Math.floor(Math.random() * 6);
      const toonAvatars = ['🫂', '🎈', '📦', '🐚', '🪨', '🦠'];
      const randomAv = toonAvatars[Math.floor(Math.random() * toonAvatars.length)];
      const isMonster = randomAv === '🦠';

      setHoles(prev => prev.map((h, i) => i === holeIndex ? { ...h, avatar: randomAv, isMonster, active: true } : h));

      setTimeout(() => {
        setHoles(prev => prev.map((h, i) => i === holeIndex ? { ...h, active: false } : h));
      }, 900);
    }, 650);

    return () => {
      clearInterval(timer);
      clearInterval(holeInterval);
    };
  }, [whackPlaying]);

  useEffect(() => {
    if (whackTime === 0 && !whackPlaying && whackScore > 0) {
      const bonusStars = Math.max(1, Math.floor(whackScore / 30));
      onAddBonusStars(bonusStars);
      try { confetti({ particleCount: 100, spread: 70 }); } catch (e) {}
      speakCheer(`Awesome Whack-A-Toon game ${kidName}! You won ${bonusStars} bonus stars!`, voiceStyle, selectedVoiceName);
    }
  }, [whackTime, whackPlaying]);

  const handleWhackHole = (id: number) => {
    if (!whackPlaying) return;
    const hole = holes[id];
    if (!hole.active) return;

    if (hole.isMonster) {
      setWhackScore(s => Math.max(0, s - 10));
      playKidSound('arcade');
    } else {
      setWhackScore(s => s + 10);
      playKidSound('superstar');
    }

    setHoles(prev => prev.map((h, i) => i === id ? { ...h, active: false } : h));
  };

  // --- GAME 5 LOGIC: POPPY'S BALLOON RUSH ---
  const startBalloonGame = () => {
    setBalloonScore(0);
    setBalloonTime(25);
    setBalloons([]);
    setBalloonPlaying(true);
    playKidSound('party');
    speakCheer(`${kidName}, pop all the colorful floating balloons!`, voiceStyle, selectedVoiceName);
  };

  useEffect(() => {
    if (!balloonPlaying) return;

    const timer = setInterval(() => {
      setBalloonTime(t => {
        if (t <= 1) {
          setBalloonPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      balloonIdRef.current += 1;
      const icons = ['🎈', '🌸', '👑', '⭐️', '🌟', '🎈'];
      const rndIcon = icons[Math.floor(Math.random() * icons.length)];
      const pts = rndIcon === '🌟' ? 30 : 10;

      setBalloons(prev => [
        ...prev.slice(-10),
        { id: balloonIdRef.current, x: Math.floor(Math.random() * 80) + 10, y: 90, icon: rndIcon, pts }
      ]);
    }, 550);

    const floatPhysics = setInterval(() => {
      setBalloons(prev => prev.map(b => ({ ...b, y: b.y - 7 })).filter(b => b.y > -10));
    }, 60);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      clearInterval(floatPhysics);
    };
  }, [balloonPlaying]);

  useEffect(() => {
    if (balloonTime === 0 && !balloonPlaying && balloonScore > 0) {
      const bonusStars = Math.max(1, Math.floor(balloonScore / 40));
      onAddBonusStars(bonusStars);
      try { confetti({ particleCount: 110, spread: 80 }); } catch (e) {}
      speakCheer(`Pop pop hooray ${kidName}! You earned ${bonusStars} bonus stars!`, voiceStyle, selectedVoiceName);
    }
  }, [balloonTime, balloonPlaying]);

  const handlePopBalloon = (id: number, pts: number) => {
    if (!balloonPlaying) return;
    setBalloonScore(s => s + pts);
    setBalloons(prev => prev.filter(b => b.id !== id));
    playKidSound('party');
  };

  // --- GAME 6 LOGIC: BRIGHTNEY'S QUIZ ---
  const handleAnswerQuiz = (selectedOption: number) => {
    if (quizCompleted) return;
    const currentQ = QUIZ_QUESTIONS[quizIndex];

    if (selectedOption === currentQ.answer) {
      setQuizScore(s => s + 1);
      playKidSound('superstar');
    } else {
      playKidSound('arcade');
    }

    if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
      setQuizIndex(q => q + 1);
    } else {
      setQuizCompleted(true);
      const totalBonus = quizScore + (selectedOption === currentQ.answer ? 1 : 0);
      onAddBonusStars(totalBonus);
      try { confetti({ particleCount: 120, spread: 90 }); } catch (e) {}
      speakCheer(`Smart brain ${kidName}! You got ${totalBonus} questions right and earned bonus stars!`, voiceStyle, selectedVoiceName);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  // --- GAME 7 LOGIC: GOOB'S HUG RHYTHM ---
  const RHYTHM_PADS = [
    { color: '#ff4081', label: '💖 Hug Red' },
    { color: '#29b6f6', label: '💙 Hug Blue' },
    { color: '#66bb6a', label: '🟢 Hug Green' },
    { color: '#ffee58', label: '💛 Hug Yellow' }
  ];

  const startRhythmGame = () => {
    setRhythmScore(0);
    setRhythmSequence([]);
    setRhythmStep(0);
    setRhythmGameOver(false);
    setRhythmPlaying(true);
    playKidSound('party');
    speakCheer(`Goob Hug Rhythm! ${kidName}, copy the pattern!`, voiceStyle, selectedVoiceName);
    nextRhythmRound([]);
  };

  const nextRhythmRound = (currSeq: number[]) => {
    setRhythmTurn('system');
    const nextPad = Math.floor(Math.random() * 4);
    const newSeq = [...currSeq, nextPad];
    setRhythmSequence(newSeq);
    setRhythmStep(0);

    let idx = 0;
    const seqTimer = setInterval(() => {
      if (idx < newSeq.length) {
        setRhythmLitIndex(newSeq[idx]);
        playKidSound('superstar');
        setTimeout(() => setRhythmLitIndex(null), 400);
        idx++;
      } else {
        clearInterval(seqTimer);
        setRhythmTurn('player');
      }
    }, 700);
  };

  const handleRhythmPadClick = (padIdx: number) => {
    if (!rhythmPlaying || rhythmTurn !== 'player' || rhythmGameOver) return;

    setRhythmLitIndex(padIdx);
    playKidSound('superstar');
    setTimeout(() => setRhythmLitIndex(null), 250);

    if (rhythmSequence[rhythmStep] === padIdx) {
      const nextStep = rhythmStep + 1;
      setRhythmStep(nextStep);

      if (nextStep === rhythmSequence.length) {
        setRhythmScore(s => s + 1);
        playKidSound('trumpet');

        if (rhythmSequence.length >= 6) {
          setRhythmPlaying(false);
          setRhythmGameOver(true);
          onAddBonusStars(4);
          try { confetti({ particleCount: 130, spread: 90 }); } catch (e) {}
          speakCheer(`Master Rhythm Champion ${kidName}! You won 4 Bonus Stars!`, voiceStyle, selectedVoiceName);
        } else {
          setTimeout(() => nextRhythmRound(rhythmSequence), 900);
        }
      }
    } else {
      setRhythmGameOver(true);
      setRhythmPlaying(false);
      playKidSound('arcade');
      const bonusStars = Math.max(1, rhythmScore);
      onAddBonusStars(bonusStars);
      speakCheer(`Nice try ${kidName}! Goob loved your Hug Rhythm! You won ${bonusStars} Bonus Stars!`, voiceStyle, selectedVoiceName);
    }
  };

  // --- GAME 8 LOGIC: ASTRO'S RUNNER ---
  const startRunnerGame = () => {
    setRunnerScore(0);
    setRunnerTime(25);
    setRunnerObstacles([]);
    setRunnerJumping(false);
    setRunnerPlaying(true);
    playKidSound('arcade');
    speakCheer(`${kidName}, tap or jump to catch stars and dodge asteroids!`, voiceStyle, selectedVoiceName);
  };

  const triggerRunnerJump = () => {
    if (!runnerPlaying || runnerJumping) return;
    setRunnerJumping(true);
    playKidSound('superstar');
    setTimeout(() => {
      setRunnerJumping(false);
    }, 600);
  };

  useEffect(() => {
    if (!runnerPlaying) return;

    const timer = setInterval(() => {
      setRunnerTime(t => {
        if (t <= 1) {
          setRunnerPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      runnerIdRef.current += 1;
      const isStar = Math.random() > 0.4;
      setRunnerObstacles(prev => [
        ...prev.slice(-8),
        { id: runnerIdRef.current, x: 100, type: isStar ? 'star' : 'rock' }
      ]);
    }, 850);

    const runnerPhysics = setInterval(() => {
      setRunnerObstacles(prev => {
        return prev
          .map(obs => ({ ...obs, x: obs.x - 7 }))
          .filter(obs => {
            if (obs.x >= 12 && obs.x <= 28) {
              if (obs.type === 'star') {
                if (runnerJumping) {
                  setRunnerScore(s => s + 20);
                  playKidSound('trumpet');
                  return false;
                }
              } else if (obs.type === 'rock') {
                if (!runnerJumping) {
                  setRunnerScore(s => Math.max(0, s - 10));
                  playKidSound('arcade');
                  return false;
                }
              }
            }
            return obs.x > -15;
          });
      });
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      clearInterval(runnerPhysics);
    };
  }, [runnerPlaying, runnerJumping]);

  useEffect(() => {
    if (runnerTime === 0 && !runnerPlaying && runnerScore > 0) {
      const bonusStars = Math.max(1, Math.floor(runnerScore / 35));
      onAddBonusStars(bonusStars);
      try { confetti({ particleCount: 110, spread: 80 }); } catch (e) {}
      speakCheer(`Out of this world ${kidName}! Astro gave you ${bonusStars} Bonus Stars!`, voiceStyle, selectedVoiceName);
    }
  }, [runnerTime, runnerPlaying]);

  // --- GAME 9 LOGIC: FLUTTER'S PAINT MATCH ---
  const startPaintGame = () => {
    setPaintScore(0);
    setPaintTime(20);
    setPaintPlaying(true);
    const firstColor = PAINT_COLORS[Math.floor(Math.random() * PAINT_COLORS.length)];
    setTargetPaintColor(firstColor);
    playKidSound('party');
    speakCheer(`${kidName}, tap the matching paint color!`, voiceStyle, selectedVoiceName);
  };

  useEffect(() => {
    if (!paintPlaying) return;

    const timer = setInterval(() => {
      setPaintTime(t => {
        if (t <= 1) {
          setPaintPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paintPlaying]);

  useEffect(() => {
    if (paintTime === 0 && !paintPlaying && paintScore > 0) {
      const bonusStars = Math.max(1, Math.floor(paintScore / 30));
      onAddBonusStars(bonusStars);
      try { confetti({ particleCount: 110, spread: 80 }); } catch (e) {}
      speakCheer(`Beautiful painting ${kidName}! You won ${bonusStars} Bonus Stars!`, voiceStyle, selectedVoiceName);
    }
  }, [paintTime, paintPlaying]);

  const handleSelectPaintBucket = (hex: string) => {
    if (!paintPlaying || !targetPaintColor) return;

    if (hex === targetPaintColor.hex) {
      setPaintScore(s => s + 10);
      playKidSound('superstar');
      const nextColor = PAINT_COLORS[Math.floor(Math.random() * PAINT_COLORS.length)];
      setTargetPaintColor(nextColor);
    } else {
      playKidSound('arcade');
    }
  };

  // --- GAME 10 LOGIC: SHELLY'S FOSSIL DIG ---
  const startFossilGame = () => {
    setFossilScore(0);
    setFossilFound(0);
    setFossilPlaying(true);

    const itemsPool: ('fossil' | 'star' | 'empty')[] = ['fossil', 'fossil', 'fossil', 'fossil', 'fossil', 'star', 'star', 'empty', 'empty'];
    itemsPool.sort(() => Math.random() - 0.5);

    const newGrid = itemsPool.map((item, idx) => ({ id: idx, revealed: false, item }));
    setFossilGrid(newGrid);
    playKidSound('arcade');
    speakCheer(`${kidName}, tap the dirt mounds to excavate ancient fossils!`, voiceStyle, selectedVoiceName);
  };

  const handleDigMound = (id: number) => {
    if (!fossilPlaying) return;
    const tile = fossilGrid[id];
    if (tile.revealed) return;

    const updated = fossilGrid.map(t => t.id === id ? { ...t, revealed: true } : t);
    setFossilGrid(updated);

    if (tile.item === 'fossil') {
      setFossilFound(f => f + 1);
      setFossilScore(s => s + 20);
      playKidSound('trumpet');
    } else if (tile.item === 'star') {
      setFossilScore(s => s + 10);
      playKidSound('superstar');
    } else {
      playKidSound('arcade');
    }

    if (updated.filter(t => t.item === 'fossil').every(t => t.revealed)) {
      setFossilPlaying(false);
      onAddBonusStars(3);
      try { confetti({ particleCount: 120, spread: 90 }); } catch (e) {}
      speakCheer(`Excavation Complete! ${kidName}, you discovered all the fossils! 3 Bonus Stars!`, voiceStyle, selectedVoiceName);
    }
  };

  // --- GAME 11 LOGIC: BOXTEN'S BOX STACKER ---
  const startStackerGame = () => {
    setStackerScore(0);
    setStackerTower(0);
    setStackerBoxPos(10);
    setStackerPlaying(true);
    playKidSound('party');
    speakCheer(`${kidName}, tap Drop Box to stack the boxes up high!`, voiceStyle, selectedVoiceName);
  };

  useEffect(() => {
    if (!stackerPlaying) return;

    let dir = 1;
    const interval = setInterval(() => {
      setStackerBoxPos(pos => {
        if (pos >= 80) dir = -1;
        if (pos <= 10) dir = 1;
        return pos + dir * 5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [stackerPlaying]);

  const handleDropBox = () => {
    if (!stackerPlaying) return;
    playKidSound('superstar');

    setStackerTower(h => h + 1);
    setStackerScore(s => s + 15);

    if (stackerTower + 1 >= 6) {
      setStackerPlaying(false);
      onAddBonusStars(4);
      try { confetti({ particleCount: 130, spread: 90 }); } catch (e) {}
      speakCheer(`Tower Master ${kidName}! You built a giant box tower and won 4 Bonus Stars!`, voiceStyle, selectedVoiceName);
    }
  };

  // --- GAME 12 LOGIC: SHRIMPO'S BUBBLE POP ---
  const startShrimpoGame = () => {
    setShrimpoScore(0);
    setShrimpoTime(20);
    setShrimpoBubbles([]);
    setShrimpoPlaying(true);
    playKidSound('arcade');
    speakCheer(`${kidName}, quick! Pop Shrimpo's angry red bubbles to calm Shrimpo down!`, voiceStyle, selectedVoiceName);
  };

  useEffect(() => {
    if (!shrimpoPlaying) return;

    const timer = setInterval(() => {
      setShrimpoTime(t => {
        if (t <= 1) {
          setShrimpoPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      shrimpoIdRef.current += 1;
      setShrimpoBubbles(prev => [
        ...prev.slice(-10),
        { id: shrimpoIdRef.current, x: Math.floor(Math.random() * 80) + 10, y: 90, popped: false }
      ]);
    }, 450);

    const floatUp = setInterval(() => {
      setShrimpoBubbles(prev => prev.map(b => ({ ...b, y: b.y - 8 })).filter(b => b.y > -10));
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      clearInterval(floatUp);
    };
  }, [shrimpoPlaying]);

  useEffect(() => {
    if (shrimpoTime === 0 && !shrimpoPlaying && shrimpoScore > 0) {
      const bonusStars = Math.max(1, Math.floor(shrimpoScore / 30));
      onAddBonusStars(bonusStars);
      try { confetti({ particleCount: 110, spread: 80 }); } catch (e) {}
      speakCheer(`Yay ${kidName}! You popped all Shrimpo's bubbles and earned ${bonusStars} Bonus Stars!`, voiceStyle, selectedVoiceName);
    }
  }, [shrimpoTime, shrimpoPlaying]);

  const handlePopShrimpoBubble = (id: number) => {
    if (!shrimpoPlaying) return;
    setShrimpoScore(s => s + 10);
    setShrimpoBubbles(prev => prev.filter(b => b.id !== id));
    playKidSound('party');
  };

  // --- GAME 13 LOGIC: RODGER'S MATH DETECTIVE ---
  const handleAnswerMath = (optionIdx: number) => {
    if (mathCompleted) return;
    const currentQ = MATH_QUESTIONS[mathIndex];

    if (optionIdx === currentQ.answer) {
      setMathScore(s => s + 1);
      playKidSound('superstar');
    } else {
      playKidSound('arcade');
    }

    if (mathIndex + 1 < MATH_QUESTIONS.length) {
      setMathIndex(m => m + 1);
    } else {
      setMathCompleted(true);
      const totalBonus = mathScore + (optionIdx === currentQ.answer ? 1 : 0);
      onAddBonusStars(totalBonus);
      try { confetti({ particleCount: 130, spread: 90 }); } catch (e) {}
      speakCheer(`Math Detective ${kidName}! You solved the clues and won ${totalBonus} Bonus Stars!`, voiceStyle, selectedVoiceName);
    }
  };

  const resetMathGame = () => {
    setMathIndex(0);
    setMathScore(0);
    setMathCompleted(false);
  };

  // --- GAME 14 LOGIC: TISH'S SPELLING BEE ---
  const handleAnswerSpelling = (optionIdx: number) => {
    if (spellingCompleted) return;
    const currentP = SPELLING_PUZZLES[spellingIndex];

    if (optionIdx === currentP.answer) {
      setSpellingScore(s => s + 1);
      playKidSound('superstar');
    } else {
      playKidSound('arcade');
    }

    if (spellingIndex + 1 < SPELLING_PUZZLES.length) {
      setSpellingIndex(s => s + 1);
    } else {
      setSpellingCompleted(true);
      const totalBonus = spellingScore + (optionIdx === currentP.answer ? 1 : 0);
      onAddBonusStars(totalBonus);
      try { confetti({ particleCount: 130, spread: 90 }); } catch (e) {}
      speakCheer(`Spelling Bee Champion ${kidName}! You earned ${totalBonus} Bonus Stars!`, voiceStyle, selectedVoiceName);
    }
  };

  const resetSpellingGame = () => {
    setSpellingIndex(0);
    setSpellingScore(0);
    setSpellingCompleted(false);
  };

  // --- GAME 15 LOGIC: COSMO'S PATTERN LOGIC ---
  const handleAnswerPattern = (optionIdx: number) => {
    if (patternCompleted) return;
    const currentP = PATTERN_PUZZLES[patternIndex];

    if (optionIdx === currentP.answer) {
      setPatternScore(s => s + 1);
      playKidSound('superstar');
    } else {
      playKidSound('arcade');
    }

    if (patternIndex + 1 < PATTERN_PUZZLES.length) {
      setPatternIndex(p => p + 1);
    } else {
      setPatternCompleted(true);
      const totalBonus = patternScore + (optionIdx === currentP.answer ? 1 : 0);
      onAddBonusStars(totalBonus);
      try { confetti({ particleCount: 130, spread: 90 }); } catch (e) {}
      speakCheer(`Pattern Master ${kidName}! You solved Cosmo's bakery logic puzzles! ${totalBonus} Bonus Stars!`, voiceStyle, selectedVoiceName);
    }
  };

  const resetPatternGame = () => {
    setPatternIndex(0);
    setPatternScore(0);
    setPatternCompleted(false);
  };

  // --- GAME 16 LOGIC: FINN'S ODD-ONE-OUT ---
  const handleAnswerOdd = (itemIdx: number) => {
    if (oddCompleted) return;
    const currentP = ODD_PUZZLES[oddIndex];

    if (itemIdx === currentP.answer) {
      setOddScore(s => s + 1);
      setOddExplanation(currentP.reason);
      playKidSound('trumpet');
    } else {
      setOddExplanation("Not quite! Try another one!");
      playKidSound('arcade');
    }

    setTimeout(() => {
      setOddExplanation(null);
      if (oddIndex + 1 < ODD_PUZZLES.length) {
        setOddIndex(o => o + 1);
      } else {
        setOddCompleted(true);
        const totalBonus = oddScore + (itemIdx === currentP.answer ? 1 : 0);
        onAddBonusStars(totalBonus);
        try { confetti({ particleCount: 130, spread: 90 }); } catch (e) {}
        speakCheer(`Sharp Logic ${kidName}! You completed Finn's Odd-One-Out challenge and earned ${totalBonus} Bonus Stars!`, voiceStyle, selectedVoiceName);
      }
    }, 1500);
  };

  const resetOddGame = () => {
    setOddIndex(0);
    setOddScore(0);
    setOddCompleted(false);
    setOddExplanation(null);
  };

  // --- GAME 17 LOGIC: ANIMAL HOSPITAL VET CLINIC ---
  const handleTreatPatient = (toolId: string) => {
    if (hospitalCompleted) return;
    const currentPatient = ANIMAL_PATIENTS[hospitalPatientIndex];

    if (toolId === currentPatient.neededTool) {
      setHospitalScore(s => s + 20);
      setHospitalPatientsHealed(h => h + 1);
      playKidSound('party');
      setHospitalFeedbackMsg(currentPatient.successMsg);

      setTimeout(() => {
        setHospitalFeedbackMsg(null);
        if (hospitalPatientIndex + 1 < ANIMAL_PATIENTS.length) {
          setHospitalPatientIndex(p => p + 1);
        } else {
          setHospitalCompleted(true);
          onAddBonusStars(4);
          try { confetti({ particleCount: 140, spread: 95 }); } catch (e) {}
          speakCheer(`Doctor ${kidName}! You healed all the cute pets at the Toon Animal Hospital and won 4 Bonus Stars!`, voiceStyle, selectedVoiceName);
        }
      }, 1400);
    } else {
      setHospitalFeedbackMsg("Not the right tool for this symptom! Try another medical tool!");
      playKidSound('arcade');
      setTimeout(() => setHospitalFeedbackMsg(null), 1200);
    }
  };

  const resetHospitalGame = () => {
    setHospitalPatientIndex(0);
    setHospitalScore(0);
    setHospitalPatientsHealed(0);
    setHospitalCompleted(false);
    setHospitalFeedbackMsg(null);
  };

  // --- GAME 18 LOGIC: TOON RIVALS ARENA ---
  const startRivalBattle = () => {
    setRivalBossIndex(0);
    setPlayerHp(100);
    setRivalHp(RIVAL_BOSSES[0].hp);
    setRivalPlaying(true);
    setRivalVictory(false);
    setRivalBattleLog(`${kidName} enters the Rivals Arena to fight ${RIVAL_BOSSES[0].name}!`);
    playKidSound('arcade');
    speakCheer(`${kidName}, get ready to battle Rival Twisteds in the Arena!`, voiceStyle, selectedVoiceName);
  };

  const handleRivalCounter = (counterType: string) => {
    if (!rivalPlaying || rivalVictory) return;
    const currentBoss = RIVAL_BOSSES[rivalBossIndex];

    if (counterType === currentBoss.counterType) {
      playKidSound('superstar');
      const nextHp = Math.max(0, rivalHp - 40);
      setRivalHp(nextHp);
      setRivalBattleLog(`CRITICAL HIT! 💥 You countered ${currentBoss.name}!`);

      if (nextHp <= 0) {
        playKidSound('trumpet');
        if (rivalBossIndex + 1 < RIVAL_BOSSES.length) {
          const nextIdx = rivalBossIndex + 1;
          setRivalBossIndex(nextIdx);
          setRivalHp(RIVAL_BOSSES[nextIdx].hp);
          setRivalBattleLog(`VICTORY! Defeated ${currentBoss.name}! Next Boss: ${RIVAL_BOSSES[nextIdx].name}!`);
        } else {
          setRivalVictory(true);
          setRivalPlaying(false);
          onAddBonusStars(5);
          try { confetti({ particleCount: 160, spread: 100 }); } catch (e) {}
          speakCheer(`ARENA CHAMPION! ${kidName}, you defeated all Twisted Rivals and won 5 Super Bonus Stars!`, voiceStyle, selectedVoiceName);
        }
      }
    } else {
      playKidSound('arcade');
      setPlayerHp(hp => Math.max(0, hp - 20));
      setRivalBattleLog(`OUCH! Wrong counter! ${currentBoss.name} hit you!`);
    }
  };

  // --- GAME 19 LOGIC: COLORING STUDIO 2 ---
  const handleColorRegion = (regionId: string) => {
    setRegionColors(prev => ({
      ...prev,
      [regionId]: selectedCrayonColor
    }));
    playKidSound('party');
  };

  const handleAddStickerToCanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedSticker) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCanvasStickers(prev => [
      ...prev,
      { id: Date.now() + Math.random(), x, y, icon: selectedSticker }
    ]);
    playKidSound('superstar');
  };

  const handleCompleteColoring = () => {
    setColoringCompleted(true);
    onAddBonusStars(4);
    try { confetti({ particleCount: 160, spread: 100 }); } catch (e) {}
    speakCheer(`Master Artist ${kidName}! Your Dandy's World artwork is so beautiful! You earned 4 Bonus Stars!`, voiceStyle, selectedVoiceName);
  };

  const resetColoringStudio = () => {
    setColoringCompleted(false);
    setCanvasStickers([]);
    const currCanvas = COLORING_CANVASES[coloringCanvasIndex];
    const initialRegions: { [key: string]: string } = {};
    currCanvas.regions.forEach(r => {
      initialRegions[r.id] = r.defaultColor;
    });
    setRegionColors(initialRegions);
  };

  // --- GAME 20 LOGIC: DANDY'S TARGET ARCHERY BLITZ ---
  const startArcheryGame = () => {
    setArcheryScore(0);
    setArcheryTime(25);
    setArcheryTargets([]);
    setArcheryPlaying(true);
    playKidSound('arcade');
    speakCheer(`${kidName}, tap the moving targets to shoot plunger arrows!`, voiceStyle, selectedVoiceName);
  };

  useEffect(() => {
    if (!archeryPlaying) return;

    const timer = setInterval(() => {
      setArcheryTime(t => {
        if (t <= 1) {
          setArcheryPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      archeryIdRef.current += 1;
      const icons = ['🎯', '⭐️', '🎯', '🎈', '🌻'];
      const pts = [20, 30, 20, 25, 35];
      const randIdx = Math.floor(Math.random() * icons.length);
      const newX = Math.floor(Math.random() * 80) + 10;
      const newY = Math.floor(Math.random() * 60) + 15;

      setArcheryTargets(prev => [
        ...prev.slice(-8),
        { id: archeryIdRef.current, x: newX, y: newY, icon: icons[randIdx], pts: pts[randIdx] }
      ]);
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [archeryPlaying]);

  useEffect(() => {
    if (archeryTime === 0 && !archeryPlaying && archeryScore > 0) {
      const bonusStars = Math.max(1, Math.floor(archeryScore / 40));
      onAddBonusStars(bonusStars);
      try { confetti({ particleCount: 120, spread: 85 }); } catch (e) {}
      speakCheer(`Bullseye ${kidName}! You won ${bonusStars} Bonus Stars in Target Archery!`, voiceStyle, selectedVoiceName);
    }
  }, [archeryTime, archeryPlaying]);

  const handleShootTarget = (id: number, pts: number) => {
    if (!archeryPlaying) return;
    setArcheryScore(s => s + pts);
    setArcheryTargets(prev => prev.filter(t => t.id !== id));
    playKidSound('superstar');
  };

  // --- GAME 21 LOGIC: SPROUT'S MUSIC PIANO HERO ---
  const startPianoGame = () => {
    setPianoScore(0);
    setPianoTime(25);
    setPianoNotes([]);
    setPianoPlaying(true);
    playKidSound('party');
    speakCheer(`${kidName}, tap the falling piano keys in rhythm to play catchy cartoon music!`, voiceStyle, selectedVoiceName);
  };

  useEffect(() => {
    if (!pianoPlaying) return;

    const timer = setInterval(() => {
      setPianoTime(t => {
        if (t <= 1) {
          setPianoPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      pianoIdRef.current += 1;
      const randLane = Math.floor(Math.random() * 4);
      const laneInfo = PIANO_LANES[randLane];
      setPianoNotes(prev => [
        ...prev.slice(-10),
        { id: pianoIdRef.current, lane: randLane, y: 0, noteName: laneInfo.keyName, color: laneInfo.color }
      ]);
    }, 550);

    const floatDown = setInterval(() => {
      setPianoNotes(prev => prev.map(n => ({ ...n, y: n.y + 7 })).filter(n => n.y < 100));
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      clearInterval(floatDown);
    };
  }, [pianoPlaying]);

  useEffect(() => {
    if (pianoTime === 0 && !pianoPlaying && pianoScore > 0) {
      const bonusStars = Math.max(1, Math.floor(pianoScore / 35));
      onAddBonusStars(bonusStars);
      try { confetti({ particleCount: 130, spread: 90 }); } catch (e) {}
      speakCheer(`Piano Maestro ${kidName}! You played wonderful music and won ${bonusStars} Bonus Stars!`, voiceStyle, selectedVoiceName);
    }
  }, [pianoTime, pianoPlaying]);

  const handleTapPianoKey = (laneIdx: number) => {
    if (!pianoPlaying) return;
    const hitNote = pianoNotes.find(n => n.lane === laneIdx && n.y >= 50 && n.y <= 95);

    if (hitNote) {
      setPianoScore(s => s + 15);
      setPianoNotes(prev => prev.filter(n => n.id !== hitNote.id));
      playKidSound('trumpet');
    } else {
      playKidSound('arcade');
    }
  };



  if (!isOpen) return null;

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
      <div className="kid-card" style={{ width: '100%', maxWidth: '880px', maxHeight: '94vh', overflowY: 'auto', backgroundColor: 'var(--bg-surface)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#ffca28', textShadow: '2px 2px 0px var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🎮 Toon Arcade, Rivals & Color Studio 2! (19 Games) 🎨
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Play 19 games, paint color art & battle Rivals for {kidName}!
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem' }}>
          <button
            onClick={() => setGameFilter('all')}
            className="btn-kid"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              backgroundColor: gameFilter === 'all' ? '#ffca28' : 'rgba(0,0,0,0.05)',
              color: gameFilter === 'all' ? '#000000' : 'var(--text-primary)'
            }}
          >
            🌈 All 19 Games
          </button>

          <button
            onClick={() => setGameFilter('art')}
            className="btn-kid"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              backgroundColor: gameFilter === 'art' ? '#ff4081' : 'rgba(0,0,0,0.05)',
              color: gameFilter === 'art' ? '#ffffff' : 'var(--text-primary)'
            }}
          >
            🎨 Color & Art (1)
          </button>

          <button
            onClick={() => setGameFilter('rivals')}
            className="btn-kid"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              backgroundColor: gameFilter === 'rivals' ? '#d32f2f' : 'rgba(0,0,0,0.05)',
              color: gameFilter === 'rivals' ? '#ffffff' : 'var(--text-primary)'
            }}
          >
            ⚔️ Rivals Arena (1)
          </button>

          <button
            onClick={() => setGameFilter('care')}
            className="btn-kid"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              backgroundColor: gameFilter === 'care' ? '#ff6090' : 'rgba(0,0,0,0.05)',
              color: gameFilter === 'care' ? '#ffffff' : 'var(--text-primary)'
            }}
          >
            🏥 Pet Hospital (1)
          </button>

          <button
            onClick={() => setGameFilter('arcade')}
            className="btn-kid"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              backgroundColor: gameFilter === 'arcade' ? '#00e676' : 'rgba(0,0,0,0.05)',
              color: gameFilter === 'arcade' ? '#000000' : 'var(--text-primary)'
            }}
          >
            🕹️ Arcade & Reflex (10)
          </button>

          <button
            onClick={() => setGameFilter('brain')}
            className="btn-kid"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              backgroundColor: gameFilter === 'brain' ? '#ab47bc' : 'rgba(0,0,0,0.05)',
              color: gameFilter === 'brain' ? '#ffffff' : 'var(--text-primary)'
            }}
          >
            🧠 Brain Puzzles (6)
          </button>
        </div>

        {/* Mini Game Selector Tabs (19 Games Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.35rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          
          {/* Color & Art Studio Games */}
          {(gameFilter === 'all' || gameFilter === 'art') && (
            <button
              onClick={() => setActiveGame('coloring_studio')}
              style={{
                padding: '0.5rem 0.2rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: activeGame === 'coloring_studio' ? 900 : 700,
                fontSize: '0.78rem',
                backgroundColor: activeGame === 'coloring_studio' ? '#ff4081' : 'transparent',
                color: activeGame === 'coloring_studio' ? '#ffffff' : 'var(--text-primary)'
              }}
            >
              🎨 Coloring Studio 2
            </button>
          )}

          {/* Rivals Arena Games */}
          {(gameFilter === 'all' || gameFilter === 'rivals') && (
            <button
              onClick={() => setActiveGame('toon_rivals')}
              style={{
                padding: '0.5rem 0.2rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: activeGame === 'toon_rivals' ? 900 : 700,
                fontSize: '0.78rem',
                backgroundColor: activeGame === 'toon_rivals' ? '#d32f2f' : 'transparent',
                color: activeGame === 'toon_rivals' ? '#ffffff' : 'var(--text-primary)'
              }}
            >
              ⚔️ Toon Rivals Arena
            </button>
          )}

          {/* Care & Hospital Games */}
          {(gameFilter === 'all' || gameFilter === 'care') && (
            <button
              onClick={() => setActiveGame('animal_hospital')}
              style={{
                padding: '0.5rem 0.2rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: activeGame === 'animal_hospital' ? 900 : 700,
                fontSize: '0.78rem',
                backgroundColor: activeGame === 'animal_hospital' ? '#ff6090' : 'transparent',
                color: activeGame === 'animal_hospital' ? '#ffffff' : 'var(--text-primary)'
              }}
            >
              🏥 Animal Hospital
            </button>
          )}

          {/* Arcade Games */}
          {(gameFilter === 'all' || gameFilter === 'arcade') && (
            <>
              <button
                onClick={() => setActiveGame('catcher')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'catcher' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'catcher' ? '#ffca28' : 'transparent',
                  color: activeGame === 'catcher' ? '#000000' : 'var(--text-primary)'
                }}
              >
                🧪 Star Catcher
              </button>

              <button
                onClick={() => setActiveGame('memory')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'memory' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'memory' ? '#00bcd4' : 'transparent',
                  color: activeGame === 'memory' ? '#000000' : 'var(--text-primary)'
                }}
              >
                🃏 Toon Memory
              </button>

              <button
                onClick={() => setActiveGame('spinner')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'spinner' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'spinner' ? '#ff6090' : 'transparent',
                  color: activeGame === 'spinner' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                🎰 Gigi's Wheel
              </button>

              <button
                onClick={() => setActiveGame('whack')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'whack' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'whack' ? '#8d6e63' : 'transparent',
                  color: activeGame === 'whack' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                🪨 Whack-A-Toon
              </button>

              <button
                onClick={() => setActiveGame('balloon')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'balloon' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'balloon' ? '#ab47bc' : 'transparent',
                  color: activeGame === 'balloon' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                🎈 Balloon Rush
              </button>

              <button
                onClick={() => setActiveGame('rhythm')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'rhythm' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'rhythm' ? '#e91e63' : 'transparent',
                  color: activeGame === 'rhythm' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                🫂 Goob Rhythm
              </button>

              <button
                onClick={() => setActiveGame('runner')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'runner' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'runner' ? '#3f51b5' : 'transparent',
                  color: activeGame === 'runner' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                🚀 Star Runner
              </button>

              <button
                onClick={() => setActiveGame('fossil')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'fossil' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'fossil' ? '#795548' : 'transparent',
                  color: activeGame === 'fossil' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                🐚 Fossil Dig
              </button>

              <button
                onClick={() => setActiveGame('stacker')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'stacker' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'stacker' ? '#ff9800' : 'transparent',
                  color: activeGame === 'stacker' ? '#000000' : 'var(--text-primary)'
                }}
              >
                📦 Box Stacker
              </button>

              <button
                onClick={() => setActiveGame('shrimpo')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'shrimpo' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'shrimpo' ? '#f44336' : 'transparent',
                  color: activeGame === 'shrimpo' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                🦐 Bubble Pop
              </button>
            </>
          )}

          {/* Brain & Logic Games */}
          {(gameFilter === 'all' || gameFilter === 'brain') && (
            <>
              <button
                onClick={() => setActiveGame('quiz')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'quiz' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'quiz' ? '#ffee58' : 'transparent',
                  color: activeGame === 'quiz' ? '#000000' : 'var(--text-primary)'
                }}
              >
                💡 Brain Quiz
              </button>

              <button
                onClick={() => setActiveGame('math_detective')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'math_detective' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'math_detective' ? '#00bcd4' : 'transparent',
                  color: activeGame === 'math_detective' ? '#000000' : 'var(--text-primary)'
                }}
              >
                🔍 Math Detective
              </button>

              <button
                onClick={() => setActiveGame('spelling')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'spelling' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'spelling' ? '#9c27b0' : 'transparent',
                  color: activeGame === 'spelling' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                🔤 Spelling Bee
              </button>

              <button
                onClick={() => setActiveGame('pattern_logic')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'pattern_logic' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'pattern_logic' ? '#ff9800' : 'transparent',
                  color: activeGame === 'pattern_logic' ? '#000000' : 'var(--text-primary)'
                }}
              >
                🧩 Pattern Logic
              </button>

              <button
                onClick={() => setActiveGame('odd_one_out')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'odd_one_out' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'odd_one_out' ? '#4caf50' : 'transparent',
                  color: activeGame === 'odd_one_out' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                🐟 Odd One Out
              </button>

              <button
                onClick={() => setActiveGame('paint')}
                style={{
                  padding: '0.5rem 0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: activeGame === 'paint' ? 900 : 700,
                  fontSize: '0.78rem',
                  backgroundColor: activeGame === 'paint' ? '#ff4081' : 'transparent',
                  color: activeGame === 'paint' ? '#ffffff' : 'var(--text-primary)'
                }}
              >
                🎨 Color Paint
              </button>
            </>
          )}

        </div>



        {/* GAME 19: COLORING STUDIO 2 */}
        {activeGame === 'coloring_studio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {coloringCompleted ? (
              <div className="kid-card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#ff4081', color: '#fff' }}>
                <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>🎨✨🖼️🌟</div>
                <h3 style={{ fontSize: '1.6rem' }}>MASTERPIECE COMPLETED!</h3>
                <p style={{ fontSize: '1.15rem', marginTop: '0.4rem' }}>
                  Artist {kidName} painted a gorgeous Dandy's World masterpiece and earned 4 Bonus Star Ichor! 🧪
                </p>
                <button onClick={resetColoringStudio} className="btn-kid btn-kid-gold" style={{ marginTop: '1.5rem', padding: '0.8rem 2.2rem', fontSize: '1.1rem' }}>
                  🎨 Paint Another Canvas!
                </button>
              </div>
            ) : (
              <div className="kid-card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
                {/* Canvas Selector */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ff4081', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    🎨 {COLORING_CANVASES[coloringCanvasIndex].title}
                  </div>
                  <button onClick={resetColoringStudio} className="btn-kid" style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}>
                    <RotateCcw size={15} /> Clear Art
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
                  {COLORING_CANVASES.map((canvas, idx) => (
                    <button
                      key={canvas.id}
                      onClick={() => {
                        setColoringCanvasIndex(idx);
                        const initial: { [key: string]: string } = {};
                        canvas.regions.forEach(r => { initial[r.id] = r.defaultColor; });
                        setRegionColors(initial);
                        setCanvasStickers([]);
                      }}
                      className="btn-kid"
                      style={{
                        flex: 1,
                        padding: '0.45rem 0.2rem',
                        fontSize: '0.8rem',
                        fontWeight: coloringCanvasIndex === idx ? 900 : 700,
                        backgroundColor: coloringCanvasIndex === idx ? '#ff4081' : 'rgba(0,0,0,0.05)',
                        color: coloringCanvasIndex === idx ? '#ffffff' : 'var(--text-primary)'
                      }}
                    >
                      {canvas.icon} Canvas {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Main Interactive Canvas Area */}
                <div
                  onClick={handleAddStickerToCanvas}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '280px',
                    borderRadius: 'var(--radius-md)',
                    border: `12px solid ${regionColors['frame'] || '#ff4081'}`,
                    backgroundColor: regionColors['bg'] || '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: selectedSticker ? 'crosshair' : 'default',
                    boxShadow: 'var(--shadow-md)',
                    marginBottom: '1rem',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '6rem', position: 'relative', userSelect: 'none' }} className="animate-toon-jiggle">
                    {COLORING_CANVASES[coloringCanvasIndex].icon}
                  </div>

                  {/* Region Tap-to-Color Buttons */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {COLORING_CANVASES[coloringCanvasIndex].regions.map(r => (
                      <button
                        key={r.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleColorRegion(r.id);
                        }}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: regionColors[r.id] || r.defaultColor,
                          color: '#000000',
                          border: '2px solid var(--border-color)',
                          fontSize: '0.78rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                      >
                        🎨 Paint {r.name}
                      </button>
                    ))}
                  </div>

                  {/* Placed Stickers */}
                  {canvasStickers.map(st => (
                    <div
                      key={st.id}
                      style={{
                        position: 'absolute',
                        left: `${st.x}%`,
                        top: `${st.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: '2rem',
                        pointerEvents: 'none'
                      }}
                    >
                      {st.icon}
                    </div>
                  ))}
                </div>

                {/* Crayon Color Palette */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    🖍️ Select Crayon Color:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.4rem' }}>
                    {CRAYON_SWATCHES.map((swatch, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedCrayonColor(swatch.hex);
                          setSelectedSticker(null);
                        }}
                        style={{
                          height: '42px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: swatch.hex,
                          border: selectedCrayonColor === swatch.hex && !selectedSticker ? '4px solid #000' : '2px solid var(--border-color)',
                          cursor: 'pointer',
                          transform: selectedCrayonColor === swatch.hex && !selectedSticker ? 'scale(1.08)' : 'scale(1)',
                          transition: 'all 0.15s ease'
                        }}
                        title={swatch.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Sticker Palette */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    ✨ Select Sparkle Sticker (Tap canvas to place):
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
                    {ART_STICKERS.map((st, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSticker(st)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: selectedSticker === st ? '#ff4081' : 'var(--bg-main)',
                          color: selectedSticker === st ? '#fff' : 'var(--text-primary)',
                          border: '2px solid var(--border-color)',
                          fontSize: '1.4rem',
                          cursor: 'pointer'
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleCompleteColoring} className="btn-kid btn-kid-gold" style={{ width: '100%', padding: '0.85rem', fontSize: '1.15rem' }}>
                  🎨 Finish Coloring Masterpiece! ⭐️
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 18: TOON RIVALS ARENA */}
        {activeGame === 'toon_rivals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!rivalPlaying && !rivalVictory ? (
              <div className="kid-card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#ffebee', borderColor: '#d32f2f' }}>
                <div style={{ fontSize: '4rem', marginBottom: '0.4rem' }}>⚔️🦐📺🪨</div>
                <h3 style={{ fontSize: '1.4rem', color: '#d32f2f' }}>Toon Rivals Arena!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Choose your Toon Hero ({activeToon.name} {activeToon.avatar}) to battle Twisted Rivals! Tap the counter buttons to deflect boss attacks!
                </p>
                <button onClick={startRivalBattle} className="btn-kid btn-kid-gold" style={{ marginTop: '1.25rem', padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                  <Swords size={22} /> Enter Rivals Battle Arena!
                </button>
              </div>
            ) : rivalVictory ? (
              <div className="kid-card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#d32f2f', color: '#fff' }}>
                <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>🏆⚔️⭐️</div>
                <h3 style={{ fontSize: '1.6rem' }}>TOON RIVALS ARENA CHAMPION!</h3>
                <p style={{ fontSize: '1.15rem', marginTop: '0.4rem' }}>
                  Hero {kidName} ({activeToon.avatar}) defeated all Twisted Rivals and earned 5 Super Bonus Stars! 🧪
                </p>
                <button onClick={startRivalBattle} className="btn-kid btn-kid-gold" style={{ marginTop: '1.5rem', padding: '0.8rem 2.2rem', fontSize: '1.1rem' }}>
                  Battle Rivals Again! ⚔️
                </button>
              </div>
            ) : (
              <div className="kid-card" style={{ padding: '1.25rem', backgroundColor: RIVAL_BOSSES[rivalBossIndex].bg, borderColor: '#d32f2f' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 900, fontSize: '1rem', color: '#d32f2f' }}>
                    ⚔️ Rivals Boss Battle {rivalBossIndex + 1} of {RIVAL_BOSSES.length}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                    Hero: {activeToon.name} {activeToon.avatar}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  
                  <div className="kid-card" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#fff' }}>
                    <div style={{ fontSize: '3.5rem' }}>{activeToon.avatar}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{kidName} ({activeToon.name})</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4caf50', marginTop: '0.2rem' }}>
                      HP: {playerHp} / 100 ❤️
                    </div>
                  </div>

                  <div className="kid-card" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#fff', borderColor: '#d32f2f' }}>
                    <div style={{ fontSize: '3.5rem' }}>{RIVAL_BOSSES[rivalBossIndex].avatar}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d32f2f' }}>
                      {RIVAL_BOSSES[rivalBossIndex].name}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f44336', marginTop: '0.2rem' }}>
                      Boss HP: {rivalHp} / {RIVAL_BOSSES[rivalBossIndex].hp} 👿
                    </div>
                  </div>

                </div>

                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#fff', border: '2px solid var(--border-color)', fontWeight: 800, fontSize: '0.95rem', textAlign: 'center', marginBottom: '1rem' }}>
                  {rivalBattleLog}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleRivalCounter('shield')}
                    className="btn-kid"
                    style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 900, backgroundColor: '#29b6f6', color: '#fff' }}
                  >
                    🛡️ Power Shield
                  </button>

                  <button
                    onClick={() => handleRivalCounter('zap')}
                    className="btn-kid"
                    style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 900, backgroundColor: '#ab47bc', color: '#fff' }}
                  >
                    ⚡ Deflect Laser
                  </button>

                  <button
                    onClick={() => handleRivalCounter('jump')}
                    className="btn-kid"
                    style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 900, backgroundColor: '#8d6e63', color: '#fff' }}
                  >
                    🦘 High Jump Dodge
                  </button>

                  <button
                    onClick={() => handleRivalCounter('blaster')}
                    className="btn-kid"
                    style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 900, backgroundColor: '#ffca28', color: '#000' }}
                  >
                    🧪 Star Ichor Blaster
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* GAME 17: ANIMAL HOSPITAL VET CLINIC */}
        {activeGame === 'animal_hospital' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!hospitalCompleted ? (
              <div className="kid-card" style={{ padding: '1.25rem', backgroundColor: '#fff5f8', borderColor: '#ff6090' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ff6090' }}>
                    🏥 Patient {hospitalPatientIndex + 1} of {ANIMAL_PATIENTS.length} • Dr. {kidName}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#00e676' }}>
                    Score: {hospitalScore} pts 🧪
                  </div>
                </div>

                <div style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  border: '3px dashed #ff6090',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ fontSize: '4.5rem', marginBottom: '0.3rem' }} className="animate-toon-jiggle">
                    {ANIMAL_PATIENTS[hospitalPatientIndex].avatar}
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    {ANIMAL_PATIENTS[hospitalPatientIndex].name}
                  </h3>

                  <div style={{
                    display: 'inline-block',
                    padding: '0.3rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#ffe0b2',
                    color: '#e65100',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    marginBottom: '0.6rem'
                  }}>
                    {ANIMAL_PATIENTS[hospitalPatientIndex].condition}
                  </div>

                  <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                    "{ANIMAL_PATIENTS[hospitalPatientIndex].symptom}"
                  </p>
                </div>

                {hospitalFeedbackMsg && (
                  <div style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 900, textAlign: 'center', marginBottom: '1rem', fontSize: '0.95rem' }}>
                    💖 {hospitalFeedbackMsg}
                  </div>
                )}

                <div style={{ fontSize: '0.9rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                  👇 Choose the Right Vet Tool to Heal the Pet:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  {HOSPITAL_TOOLS.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => handleTreatPatient(tool.id)}
                      className="btn-kid"
                      style={{
                        padding: '0.85rem 0.4rem',
                        fontSize: '0.95rem',
                        fontWeight: 900,
                        backgroundColor: '#ffffff',
                        border: '2px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <span style={{ fontSize: '1.8rem' }}>{tool.icon}</span>
                      <span>{tool.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="kid-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ff6090', color: '#fff' }}>
                <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🏥🐶🐱🐰</div>
                <h3 style={{ fontSize: '1.5rem' }}>Doctor {kidName}'s Pet Hospital Victory!</h3>
                <p style={{ fontSize: '1.15rem', marginTop: '0.3rem' }}>
                  You cured all 5 cute animal patients and earned 4 Bonus Star Ichor! 🧪
                </p>
                <button onClick={resetHospitalGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1.25rem', padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                  🏥 Open Pet Hospital Again!
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 1: STAR ICHOR CATCHER */}
        {activeGame === 'catcher' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Score: <span style={{ color: '#00e676', fontSize: '1.2rem' }}>{catcherScore} pts</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Time Left: <span style={{ color: '#ff6090', fontSize: '1.2rem' }}>{catcherTime}s</span>
              </div>
            </div>

            <div style={{
              height: '280px',
              backgroundColor: 'var(--bg-main)',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              overflow: 'hidden',
              userSelect: 'none'
            }}>
              {!catcherPlaying ? (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.85)', padding: '1rem', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.3rem' }}>🧪⭐️</div>
                  <h3 style={{ fontSize: '1.25rem' }}>
                    {catcherTime === 0 ? `Game Over! Score: ${catcherScore} pts` : `Star Ichor Catcher!`}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', maxWidth: '380px' }}>
                    Catch falling Star Ichor 🧪, Stars ⭐️, and Flowers 🌻! Avoid poisonous bacteria 🦠!
                  </p>
                  <button onClick={startCatcherGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1rem', padding: '0.65rem 1.5rem', fontSize: '1.05rem' }}>
                    <Play size={20} fill="#000" /> {catcherTime === 0 ? 'Play Again!' : 'Start Catcher Game!'}
                  </button>
                </div>
              ) : (
                <>
                  {fallingItems.map(item => (
                    <div key={item.id} style={{
                      position: 'absolute',
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      fontSize: '1.8rem',
                      transform: 'translate(-50%, -50%)',
                      transition: 'top 0.05s linear'
                    }}>
                      {item.type === 'star' && '⭐️'}
                      {item.type === 'ichor' && '🧪'}
                      {item.type === 'flower' && '🌻'}
                      {item.type === 'bad' && '🦠'}
                    </div>
                  ))}

                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: `${basketPos}%`,
                    transform: 'translateX(-50%)',
                    fontSize: '2.5rem',
                    transition: 'left 0.05s ease-out'
                  }}>
                    {activeToon.avatar}
                  </div>
                </>
              )}
            </div>

            {catcherPlaying && (
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setBasketPos(p => Math.max(5, p - 12))}
                  className="btn-kid"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '1.1rem' }}
                >
                  <ArrowLeft size={20} /> Move Left
                </button>
                <button
                  onClick={() => setBasketPos(p => Math.min(85, p + 12))}
                  className="btn-kid"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '1.1rem' }}
                >
                  Move Right <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 2: MEMORY MATCH */}
        {activeGame === 'memory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Moves: <span style={{ color: '#00bcd4', fontSize: '1.2rem' }}>{memoryMoves}</span>
              </div>
              <button onClick={initMemoryGame} className="btn-kid" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>
                <RotateCcw size={16} /> Reset Game
              </button>
            </div>

            {memoryWon ? (
              <div className="kid-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#00bcd4', color: '#fff' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆🃏</div>
                <h3 style={{ fontSize: '1.4rem' }}>Memory Match Champion!</h3>
                <p style={{ fontSize: '1rem', marginTop: '0.3rem' }}>
                  You matched all the Toon pairs in only {memoryMoves} moves! You won 3 Bonus Stars!
                </p>
                <button onClick={initMemoryGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1rem', padding: '0.7rem 1.5rem', fontSize: '1rem' }}>
                  Play Memory Again!
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.6rem'
              }}>
                {cards.map((card, idx) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    style={{
                      height: '90px',
                      borderRadius: 'var(--radius-md)',
                      border: 'var(--border-width) solid var(--border-color)',
                      backgroundColor: card.flipped || card.matched ? 'var(--bg-surface)' : card.toon.color,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transform: card.flipped ? 'scale(1.03)' : 'scale(1)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    {card.flipped || card.matched ? (
                      <>
                        <div style={{ fontSize: '2rem' }}>{card.toon.avatar}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>{card.toon.name}</div>
                      </>
                    ) : (
                      <div style={{ fontSize: '2rem', opacity: 0.7 }}>❓</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GAME 3: PRIZE SPINNER */}
        {activeGame === 'spinner' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
            <div style={{ position: 'relative', width: '240px', height: '240px' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '8px solid var(--border-color)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  background: 'conic-gradient(#ff6090 0deg 60deg, #ffca28 60deg 120deg, #00bcd4 120deg 180deg, #ab47bc 180deg 240deg, #66bb6a 240deg 300deg, #ff7043 300deg 360deg)',
                  transform: `rotate(${spinDegree}deg)`,
                  transition: spinning ? 'transform 3s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '14px solid transparent',
                borderRight: '14px solid transparent',
                borderTop: '24px solid #d32f2f',
                zIndex: 10
              }} />
              <div style={{
                position: 'absolute',
                inset: '35%',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '4px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 900
              }}>
                🎰
              </div>
            </div>

            {spinResult && (
              <div className="kid-card" style={{ backgroundColor: '#ffca28', color: '#000', padding: '0.8rem 1.5rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 900 }}>
                🎉 You won: {spinResult}!
              </div>
            )}

            <button
              onClick={spinWheel}
              disabled={spinning}
              className="btn-kid btn-kid-gold"
              style={{ padding: '0.8rem 2.2rem', fontSize: '1.2rem' }}
            >
              {spinning ? 'Spinning...' : 'Spin the Wheel! 🎰'}
            </button>
          </div>
        )}

        {/* GAME 4: WHACK-A-TOON */}
        {activeGame === 'whack' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Score: <span style={{ color: '#00e676', fontSize: '1.2rem' }}>{whackScore} pts</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Time: <span style={{ color: '#ff6090', fontSize: '1.2rem' }}>{whackTime}s</span>
              </div>
            </div>

            {!whackPlaying ? (
              <div className="kid-card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem' }}>🪨🫂</div>
                <h3 style={{ fontSize: '1.25rem' }}>Pebble's Whack-A-Toon!</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Tap the friendly Toons popping out of the holes! Don't tap the poisonous bacteria 🦠!
                </p>
                <button onClick={startWhackGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1rem', padding: '0.7rem 1.8rem', fontSize: '1.05rem' }}>
                  <Play size={20} fill="#000" /> Start Whack-A-Toon!
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {holes.map(hole => (
                  <button
                    key={hole.id}
                    onClick={() => handleWhackHole(hole.id)}
                    style={{
                      height: '110px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: hole.active ? '#fff9c4' : '#8d6e63',
                      border: 'var(--border-width) solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      cursor: 'pointer',
                      transform: hole.active ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    {hole.active ? hole.avatar : '🕳️'}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GAME 5: POPPY'S BALLOON RUSH */}
        {activeGame === 'balloon' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Score: <span style={{ color: '#00e676', fontSize: '1.2rem' }}>{balloonScore} pts</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Time: <span style={{ color: '#ff6090', fontSize: '1.2rem' }}>{balloonTime}s</span>
              </div>
            </div>

            <div style={{
              height: '280px',
              backgroundColor: 'var(--bg-main)',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              overflow: 'hidden',
              userSelect: 'none'
            }}>
              {!balloonPlaying ? (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.85)', padding: '1rem', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem' }}>🎈🌸</div>
                  <h3 style={{ fontSize: '1.25rem' }}>Poppy's Balloon Pop Rush!</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Tap/pop floating balloons before they fly away! Catch golden stars 🌟 for extra points!
                  </p>
                  <button onClick={startBalloonGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1rem', padding: '0.7rem 1.8rem', fontSize: '1.05rem' }}>
                    <Play size={20} fill="#000" /> Start Balloon Pop!
                  </button>
                </div>
              ) : (
                <>
                  {balloons.map(b => (
                    <button
                      key={b.id}
                      onClick={() => handlePopBalloon(b.id, b.pts)}
                      style={{
                        position: 'absolute',
                        left: `${b.x}%`,
                        top: `${b.y}%`,
                        fontSize: '2.5rem',
                        transform: 'translate(-50%, -50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {b.icon}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* GAME 6: BRIGHTNEY'S QUIZ */}
        {activeGame === 'quiz' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!quizCompleted ? (
              <div className="kid-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
                </div>

                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  💡 {QUIZ_QUESTIONS[quizIndex].question}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {QUIZ_QUESTIONS[quizIndex].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerQuiz(optIdx)}
                      className="btn-kid"
                      style={{ padding: '0.9rem', fontSize: '1.1rem', backgroundColor: 'var(--bg-surface)' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="kid-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#10b981', color: '#fff' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆💡</div>
                <h3 style={{ fontSize: '1.4rem' }}>Quiz Completed!</h3>
                <p style={{ fontSize: '1.1rem', marginTop: '0.3rem' }}>
                  You got {quizScore} out of {QUIZ_QUESTIONS.length} correct and won {quizScore} Bonus Stars!
                </p>
                <button onClick={resetQuiz} className="btn-kid btn-kid-gold" style={{ marginTop: '1.25rem', padding: '0.7rem 1.8rem', fontSize: '1rem' }}>
                  Play Quiz Again!
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 7: GOOB'S HUG RHYTHM */}
        {activeGame === 'rhythm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Rhythm Score: <span style={{ color: '#e91e63', fontSize: '1.2rem' }}>{rhythmScore} rounds</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: rhythmTurn === 'system' ? '#ff9800' : '#4caf50' }}>
                {rhythmTurn === 'system' ? '👀 Watch Goob...' : '👉 Your Turn to Tap!'}
              </div>
            </div>

            {!rhythmPlaying ? (
              <div className="kid-card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem' }}>🫂🎵</div>
                <h3 style={{ fontSize: '1.25rem' }}>Goob's Hug Rhythm Match!</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Watch the colorful hug pad sequence carefully, then repeat the pattern to win Star Ichor!
                </p>
                <button onClick={startRhythmGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1rem', padding: '0.7rem 1.8rem', fontSize: '1.05rem' }}>
                  <Play size={20} fill="#000" /> Start Rhythm Game!
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {RHYTHM_PADS.map((pad, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRhythmPadClick(idx)}
                    disabled={rhythmTurn === 'system'}
                    style={{
                      height: '110px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: rhythmLitIndex === idx ? '#ffffff' : pad.color,
                      color: rhythmLitIndex === idx ? '#000000' : '#ffffff',
                      border: 'var(--border-width) solid var(--border-color)',
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      cursor: rhythmTurn === 'system' ? 'not-allowed' : 'pointer',
                      transform: rhythmLitIndex === idx ? 'scale(1.06)' : 'scale(1)',
                      boxShadow: rhythmLitIndex === idx ? '0 0 20px #ffffff' : 'var(--shadow-sm)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {pad.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GAME 8: ASTRO'S RUNNER */}
        {activeGame === 'runner' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Runner Score: <span style={{ color: '#00e676', fontSize: '1.2rem' }}>{runnerScore} pts</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Time: <span style={{ color: '#3f51b5', fontSize: '1.2rem' }}>{runnerTime}s</span>
              </div>
            </div>

            <div style={{
              height: '280px',
              backgroundColor: '#1a1c23',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              overflow: 'hidden',
              userSelect: 'none'
            }}>
              {!runnerPlaying ? (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.85)', color: '#fff', padding: '1rem', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem' }}>🚀🌟</div>
                  <h3 style={{ fontSize: '1.25rem' }}>Astro's Cosmic Star Runner!</h3>
                  <p style={{ fontSize: '0.85rem', color: '#b0bec5', marginTop: '0.2rem' }}>
                    Tap the screen to JUMP! Jump up high to grab airborne stars ⭐️ and jump over space rocks 🪨!
                  </p>
                  <button onClick={startRunnerGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1rem', padding: '0.7rem 1.8rem', fontSize: '1.05rem' }}>
                    <Play size={20} fill="#000" /> Launch Star Runner!
                  </button>
                </div>
              ) : (
                <div onClick={triggerRunnerJump} style={{ width: '100%', height: '100%', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '20px', left: '10%', fontSize: '1rem', opacity: 0.5 }}>✨</div>
                  <div style={{ position: 'absolute', top: '50px', left: '60%', fontSize: '1rem', opacity: 0.5 }}>✨</div>
                  <div style={{ position: 'absolute', top: '30px', left: '85%', fontSize: '1rem', opacity: 0.5 }}>✨</div>

                  <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, height: '4px', backgroundColor: '#3f51b5' }} />

                  <div style={{
                    position: 'absolute',
                    left: '20%',
                    bottom: runnerJumping ? '120px' : '20px',
                    fontSize: '3rem',
                    transition: 'bottom 0.25s ease-out'
                  }}>
                    {activeToon.avatar}
                  </div>

                  {runnerObstacles.map(obs => (
                    <div key={obs.id} style={{
                      position: 'absolute',
                      left: `${obs.x}%`,
                      bottom: obs.type === 'star' ? '120px' : '20px',
                      fontSize: '2.5rem'
                    }}>
                      {obs.type === 'star' ? '⭐️' : '🪨'}
                    </div>
                  ))}

                  <div style={{ position: 'absolute', top: '10px', right: '15px', color: '#fff', fontSize: '0.8rem', opacity: 0.7 }}>
                    👇 TAP TO JUMP!
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GAME 9: FLUTTER'S PAINT MATCH */}
        {activeGame === 'paint' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Paint Score: <span style={{ color: '#ff4081', fontSize: '1.2rem' }}>{paintScore} pts</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Time: <span style={{ color: '#ff4081', fontSize: '1.2rem' }}>{paintTime}s</span>
              </div>
            </div>

            {!paintPlaying ? (
              <div className="kid-card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem' }}>🎨🦋</div>
                <h3 style={{ fontSize: '1.25rem' }}>Flutter's Color Paint Match!</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Tap the matching paint bucket requested by Flutter before time runs out!
                </p>
                <button onClick={startPaintGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1rem', padding: '0.7rem 1.8rem', fontSize: '1.05rem' }}>
                  <Play size={20} fill="#000" /> Start Paint Match!
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1rem 0' }}>
                <div className="kid-card" style={{ padding: '1rem 2rem', textAlign: 'center', backgroundColor: targetPaintColor?.hex, color: '#fff', fontSize: '1.3rem', fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                  Tap: {targetPaintColor?.name}!
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', width: '100%' }}>
                  {PAINT_COLORS.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectPaintBucket(c.hex)}
                      style={{
                        height: '90px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: c.hex,
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        border: 'var(--border-width) solid var(--border-color)',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      🎨 {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* GAME 10: SHELLY'S FOSSIL DIG */}
        {activeGame === 'fossil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Fossils Uncovered: <span style={{ color: '#795548', fontSize: '1.2rem' }}>{fossilFound} / 5</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Score: <span style={{ color: '#00e676', fontSize: '1.2rem' }}>{fossilScore} pts</span>
              </div>
            </div>

            {!fossilPlaying ? (
              <div className="kid-card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem' }}>🐚🦴</div>
                <h3 style={{ fontSize: '1.25rem' }}>Shelly's Fossil Excavator!</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Tap the dirt mounds to dig up hidden ancient fossils 🦴 and glowing stars ⭐️!
                </p>
                <button onClick={startFossilGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1rem', padding: '0.7rem 1.8rem', fontSize: '1.05rem' }}>
                  <Play size={20} fill="#000" /> Start Fossil Dig!
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {fossilGrid.map(tile => (
                  <button
                    key={tile.id}
                    onClick={() => handleDigMound(tile.id)}
                    style={{
                      height: '100px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: tile.revealed ? '#d7ccc8' : '#795548',
                      border: 'var(--border-width) solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      cursor: tile.revealed ? 'default' : 'pointer'
                    }}
                  >
                    {!tile.revealed ? (
                      '🪨'
                    ) : (
                      tile.item === 'fossil' ? '🦴' : tile.item === 'star' ? '⭐️' : '🌱'
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GAME 11: BOXTEN'S BOX STACKER */}
        {activeGame === 'stacker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Tower Height: <span style={{ color: '#ff9800', fontSize: '1.2rem' }}>{stackerTower} boxes</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Score: <span style={{ color: '#00e676', fontSize: '1.2rem' }}>{stackerScore} pts</span>
              </div>
            </div>

            <div style={{
              height: '280px',
              backgroundColor: 'var(--bg-main)',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              overflow: 'hidden',
              userSelect: 'none'
            }}>
              {!stackerPlaying ? (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.85)', padding: '1rem', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem' }}>📦🎁</div>
                  <h3 style={{ fontSize: '1.25rem' }}>Boxten's Mystery Box Stacker!</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Tap "Drop Box!" to stack moving mystery boxes up high! Stack 6 boxes to win!
                  </p>
                  <button onClick={startStackerGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1rem', padding: '0.7rem 1.8rem', fontSize: '1.05rem' }}>
                    <Play size={20} fill="#000" /> Start Box Stacker!
                  </button>
                </div>
              ) : (
                <>
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: `${stackerBoxPos}%`,
                    fontSize: '2.5rem',
                    transition: 'left 0.05s linear'
                  }}>
                    📦
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    {Array.from({ length: stackerTower }).map((_, i) => (
                      <div key={i} style={{ fontSize: '2.5rem' }}>🎁</div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {stackerPlaying && (
              <button onClick={handleDropBox} className="btn-kid btn-kid-gold" style={{ width: '100%', padding: '0.85rem', fontSize: '1.2rem' }}>
                👇 DROP BOX! 📦
              </button>
            )}
          </div>
        )}

        {/* GAME 12: SHRIMPO'S BUBBLE POP */}
        {activeGame === 'shrimpo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Score: <span style={{ color: '#f44336', fontSize: '1.2rem' }}>{shrimpoScore} pts</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                Time: <span style={{ color: '#ff6090', fontSize: '1.2rem' }}>{shrimpoTime}s</span>
              </div>
            </div>

            <div style={{
              height: '280px',
              backgroundColor: '#ffebee',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              overflow: 'hidden',
              userSelect: 'none'
            }}>
              {!shrimpoPlaying ? (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.85)', padding: '1rem', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem' }}>🦐🫧</div>
                  <h3 style={{ fontSize: '1.25rem' }}>Shrimpo's Angry Bubble Pop!</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Quick! Rapid-tap on Shrimpo's angry red bubbles 🦐 to pop them into happy smiling stars ⭐️!
                  </p>
                  <button onClick={startShrimpoGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1rem', padding: '0.7rem 1.8rem', fontSize: '1.05rem' }}>
                    <Play size={20} fill="#000" /> Start Bubble Pop!
                  </button>
                </div>
              ) : (
                <>
                  {shrimpoBubbles.map(b => (
                    <button
                      key={b.id}
                      onClick={() => handlePopShrimpoBubble(b.id)}
                      style={{
                        position: 'absolute',
                        left: `${b.x}%`,
                        top: `${b.y}%`,
                        fontSize: '2.5rem',
                        transform: 'translate(-50%, -50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      🦐
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* GAME 13: RODGER'S MATH DETECTIVE */}
        {activeGame === 'math_detective' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!mathCompleted ? (
              <div className="kid-card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#00bcd4', marginBottom: '0.4rem' }}>
                  🔍 Math Case {mathIndex + 1} of {MATH_QUESTIONS.length}
                </div>

                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  🔍 Rodger asks: <span style={{ color: '#00e676', fontWeight: 900 }}>{MATH_QUESTIONS[mathIndex].question}</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {MATH_QUESTIONS[mathIndex].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerMath(optIdx)}
                      className="btn-kid"
                      style={{ padding: '1rem', fontSize: '1.25rem', fontWeight: 900, backgroundColor: 'var(--bg-main)' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="kid-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#00bcd4', color: '#fff' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🔍🏆</div>
                <h3 style={{ fontSize: '1.4rem' }}>Math Detective Case Solved!</h3>
                <p style={{ fontSize: '1.1rem', marginTop: '0.3rem' }}>
                  You solved {mathScore} out of {MATH_QUESTIONS.length} math clues and earned {mathScore} Bonus Stars!
                </p>
                <button onClick={resetMathGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1.25rem', padding: '0.7rem 1.8rem', fontSize: '1rem' }}>
                  Solve More Math Cases!
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 14: TISH'S SPELLING BEE */}
        {activeGame === 'spelling' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!spellingCompleted ? (
              <div className="kid-card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9c27b0', marginBottom: '0.4rem' }}>
                  🔤 Word Puzzle {spellingIndex + 1} of {SPELLING_PUZZLES.length}
                </div>

                <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.3em', textAlign: 'center', color: '#ab47bc', marginBottom: '0.4rem' }}>
                  {SPELLING_PUZZLES[spellingIndex].display}
                </div>

                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Hint: {SPELLING_PUZZLES[spellingIndex].hint}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {SPELLING_PUZZLES[spellingIndex].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerSpelling(optIdx)}
                      className="btn-kid btn-kid-gold"
                      style={{ padding: '1rem', fontSize: '1.4rem', fontWeight: 900 }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="kid-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#9c27b0', color: '#fff' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🔤📚</div>
                <h3 style={{ fontSize: '1.4rem' }}>Spelling Bee Master!</h3>
                <p style={{ fontSize: '1.1rem', marginTop: '0.3rem' }}>
                  You spelled {spellingScore} words correctly and earned {spellingScore} Bonus Stars!
                </p>
                <button onClick={resetSpellingGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1.25rem', padding: '0.7rem 1.8rem', fontSize: '1rem' }}>
                  Play Spelling Bee Again!
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 15: COSMO'S PATTERN LOGIC */}
        {activeGame === 'pattern_logic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!patternCompleted ? (
              <div className="kid-card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ff9800', marginBottom: '0.4rem' }}>
                  🧩 Pattern Matrix {patternIndex + 1} of {PATTERN_PUZZLES.length}
                </div>

                <div style={{ fontSize: '2.2rem', fontWeight: 900, textAlign: 'center', margin: '1rem 0' }}>
                  {PATTERN_PUZZLES[patternIndex].sequence}
                </div>

                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Cosmo's Bakery Hint: {PATTERN_PUZZLES[patternIndex].hint}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {PATTERN_PUZZLES[patternIndex].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerPattern(optIdx)}
                      className="btn-kid"
                      style={{ padding: '1rem', fontSize: '1.8rem', backgroundColor: '#fff8e1' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="kid-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ff9800', color: '#fff' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🧩🧁</div>
                <h3 style={{ fontSize: '1.4rem' }}>Cosmo's Pattern Logic Master!</h3>
                <p style={{ fontSize: '1.1rem', marginTop: '0.3rem' }}>
                  You solved {patternScore} bakery patterns and earned {patternScore} Bonus Stars!
                </p>
                <button onClick={resetPatternGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1.25rem', padding: '0.7rem 1.8rem', fontSize: '1rem' }}>
                  Solve More Patterns!
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 16: FINN'S ODD-ONE-OUT */}
        {activeGame === 'odd_one_out' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!oddCompleted ? (
              <div className="kid-card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4caf50', marginBottom: '0.4rem' }}>
                  🐟 Brain Puzzle {oddIndex + 1} of {ODD_PUZZLES.length}
                </div>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Which item does NOT belong with the others?
                </h3>

                {oddExplanation && (
                  <div style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 800, marginBottom: '1rem', fontSize: '0.9rem' }}>
                    💡 {oddExplanation}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {ODD_PUZZLES[oddIndex].items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => handleAnswerOdd(itemIdx)}
                      className="btn-kid"
                      style={{ padding: '1.1rem', fontSize: '1.15rem', fontWeight: 800, backgroundColor: 'var(--bg-main)' }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="kid-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#4caf50', color: '#fff' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🐟🧠</div>
                <h3 style={{ fontSize: '1.4rem' }}>Odd-One-Out Champion!</h3>
                <p style={{ fontSize: '1.1rem', marginTop: '0.3rem' }}>
                  You spotted {oddScore} odd items and won {oddScore} Bonus Stars!
                </p>
                <button onClick={resetOddGame} className="btn-kid btn-kid-gold" style={{ marginTop: '1.25rem', padding: '0.7rem 1.8rem', fontSize: '1rem' }}>
                  Play Odd-One-Out Again!
                </button>
              </div>
            )}
          </div>
        )}

        <button onClick={onClose} className="btn-kid btn-kid-primary" style={{ width: '100%', marginTop: '1.25rem' }}>
          Back to Routines! 👍
        </button>

      </div>
    </div>
  );
};
