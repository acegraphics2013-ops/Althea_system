import { KidTask, KidReward } from '../types';

export const MORNING_ROUTINE_PRESETS: KidTask[] = [
  { id: 'morn-1', title: 'Wake Up with a Smile & Stretch ☀️', icon: '⏰', category: 'morning', time: '6:45 AM', completed: false, stars: 1, toonId: 'althea' },
  { id: 'morn-2', title: 'Make My Bed & Tidy Blanket', icon: '🛏️', category: 'morning', time: '7:00 AM', completed: false, stars: 1, toonId: 'poppy' },
  { id: 'morn-bath', title: 'Take Refreshing Morning Bath & Wash Hair', icon: '🧼', category: 'morning', time: '7:10 AM', completed: false, stars: 1, toonId: 'shelly' },
  { id: 'morn-3', title: 'Brush My Teeth & Wash Face', icon: '🪥', category: 'morning', time: '7:20 AM', completed: false, stars: 1, toonId: 'finn' },
  { id: 'morn-4', title: 'Put On Clean Clothes & Socks', icon: '👕', category: 'morning', time: '7:30 AM', completed: false, stars: 1, toonId: 'glisten' },
  { id: 'morn-5', title: 'Eat Breakfast & Drink Milk 🥛', icon: '🥣', category: 'morning', time: '7:45 AM', completed: false, stars: 1, toonId: 'cosmo' },
  { id: 'morn-6', title: 'Pack Backpack & Water Bottle', icon: '🎒', category: 'morning', time: '7:55 AM', completed: false, stars: 1, toonId: 'brightney' },
  { id: 'morn-7', title: 'Put On Shoes & Tie Laces', icon: '👟', category: 'morning', time: '8:05 AM', completed: false, stars: 1, toonId: 'flutter' },
  { id: 'morn-8', title: 'Goodbye Hug & Ready for School!', icon: '🤗', category: 'morning', time: '8:15 AM', completed: false, stars: 1, toonId: 'goob' }
];

export const INITIAL_KID_TASKS: KidTask[] = [
  // Full Morning Routine with Morning Bath
  ...MORNING_ROUTINE_PRESETS,

  // School & Homework
  { id: 'kt-5', title: 'Math Worksheet Problems', icon: '🔢', category: 'school', time: '4:00 PM', completed: false, stars: 2, notes: 'Page 12 Addition & Subtraction', toonId: 'rodger' },
  { id: 'kt-6', title: 'Read Favorite Story Book', icon: '📖', category: 'school', time: '4:30 PM', completed: false, stars: 2, notes: 'Read for 15 minutes out loud', toonId: 'brightney' },
  { id: 'kt-7', title: 'Practice Weekly Spelling Words', icon: '✍️', category: 'school', time: '5:00 PM', completed: false, stars: 1, toonId: 'boxten' },

  // Afternoon & Home Fun
  { id: 'kt-8', title: 'Clean Up Toys & Study Desk', icon: '🧸', category: 'afternoon', time: '5:30 PM', completed: false, stars: 1, toonId: 'sprout' },
  { id: 'kt-9', title: 'Drink Water & Eat Fruit Snack', icon: '🍎', category: 'afternoon', time: '6:00 PM', completed: true, stars: 1, toonId: 'teagan' },
  { id: 'kt-10', title: 'Help Set Dinner Table', icon: '🍽️', category: 'afternoon', time: '6:30 PM', completed: false, stars: 1, toonId: 'shrimpo' },

  // Bedtime Routine
  { id: 'kt-11', title: 'Put On Clean Pajamas', icon: '👔', category: 'bedtime', time: '8:00 PM', completed: false, stars: 1, toonId: 'toodles' },
  { id: 'kt-12', title: 'Listen to Bedtime Story', icon: '📚', category: 'bedtime', time: '8:30 PM', completed: false, stars: 1, toonId: 'vee' },
  { id: 'kt-13', title: 'Sleep Early for Big Tomorrow', icon: '🛌', category: 'bedtime', time: '9:00 PM', completed: false, stars: 1, toonId: 'astro' },
];

export const INITIAL_REWARDS: KidReward[] = [
  { id: 'rew-1', name: '30 Mins Outdoor Playground / Bike Time 🛝', starsNeeded: 5, unlocked: true, icon: '🛝', category: 'play' },
  { id: 'rew-2', name: 'Yummy Ice Cream / Jollibee Sundae Treat 🍦', starsNeeded: 8, unlocked: false, icon: '🍦', category: 'treat' },
  { id: 'rew-3', name: 'Watch Favorite Cartoon Show 📺', starsNeeded: 10, unlocked: false, icon: '📺', category: 'fun' },
  { id: 'rew-4', name: 'Jollibee Spaghetti / Pizza Treat 🍕', starsNeeded: 15, unlocked: false, icon: '🍝', category: 'treat' },
  { id: 'rew-5', name: '30 Mins iPad / Roblox Game Time 🎮', starsNeeded: 20, unlocked: false, icon: '🎮', category: 'fun' },
  { id: 'rew-6', name: 'Family Movie Night with Popcorn 🍿', starsNeeded: 25, unlocked: false, icon: '🎬', category: 'fun' },
  { id: 'rew-7', name: 'Surprise Toy Box / Lego Set Gift 🎁', starsNeeded: 35, unlocked: false, icon: '🎁', category: 'gift' },
  { id: 'rew-8', name: 'Superstar Golden Trophy & Certificate 🏆', starsNeeded: 50, unlocked: false, icon: '🏆', category: 'gift' }
];
