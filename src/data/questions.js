export const quizCategories = [
  { value: 'general', label: 'General knowledge', emoji: '🌍' },
  { value: 'science', label: 'Science & nature', emoji: '🪴' },
  { value: 'pop-culture', label: 'Pop culture', emoji: '🎬' },
  { value: 'food', label: 'Food & drink', emoji: '🍓' },
];

export const quizDifficulties = [
  { value: 'easy', label: 'Easy does it', detail: 'A comfy warm-up' },
  { value: 'medium', label: 'Getting curious', detail: 'A little challenge' },
  { value: 'hard', label: 'Brainiac mode', detail: 'Bring your A-game' },
];

export const questionCounts = [5, 10, 15];

export const sampleQuestions = [
  {
    id: 'planet-day',
    category: 'Science & nature',
    text: 'Which planet in our solar system has the shortest day?',
    answers: ['Mercury', 'Jupiter', 'Mars', 'Venus'],
    correctAnswerIndex: 1,
  },
  {
    id: 'octopus',
    category: 'Science & nature',
    text: 'How many hearts does an octopus have?',
    answers: ['One', 'Two', 'Three', 'Four'],
    correctAnswerIndex: 2,
  },
  {
    id: 'honey',
    category: 'Food & drink',
    text: 'What is the main ingredient in traditional hummus?',
    answers: ['Lentils', 'Chickpeas', 'White beans', 'Peas'],
    correctAnswerIndex: 1,
  },
  {
    id: 'moon',
    category: 'General knowledge',
    text: 'What is the name of the closest star to Earth?',
    answers: ['Sirius', 'Polaris', 'The Sun', 'Proxima Centauri'],
    correctAnswerIndex: 2,
  },
  {
    id: 'animation',
    category: 'Pop culture',
    text: 'Which animation studio made the film Spirited Away?',
    answers: ['Pixar', 'Studio Ghibli', 'Aardman', 'Laika'],
    correctAnswerIndex: 1,
  },
];
