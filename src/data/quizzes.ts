import { QuizQuestion, QuizCategory, Difficulty } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // FLAGS
  {
    id: 'q1',
    category: QuizCategory.FLAGS,
    difficulty: Difficulty.EASY,
    question: 'Which country has a flag with a bright green and yellow background and a blue globe in the center (🇧🇷)?',
    options: ['Argentina', 'Brazil', 'Senegal', 'Australia'],
    correctIndex: 1,
    explanation: 'That is Brazil! Their yellow stands for golden wealth, green stands for the Amazon, and the blue globe represents the night sky over Rio de Janeiro.'
  },
  {
    id: 'q2',
    category: QuizCategory.FLAGS,
    difficulty: Difficulty.MEDIUM,
    question: 'The Canadian flag (🇨🇦) featured a beautiful single leaf in the center. What kind of leaf is it?',
    options: ['Oak Leaf', 'Fern Leaf', 'Maple Leaf', 'Pine Needle'],
    correctIndex: 2,
    explanation: 'It is a Maple Leaf! Canada has millions of maple trees and produces most of the world\'s sweet maple syrup.'
  },
  {
    id: 'q3',
    category: QuizCategory.FLAGS,
    difficulty: Difficulty.HARD,
    question: 'Which country has a flag with green, yellow, and red vertical stripes, and a green star in the center (🇸🇳)?',
    options: ['Senegal', 'Morocco', 'Spain', 'Germany'],
    correctIndex: 0,
    explanation: 'It is Senegal! The green star represents hope, and the flag carries traditional Pan-African colors.'
  },

  // CAPITALS
  {
    id: 'q4',
    category: QuizCategory.CAPITALS,
    difficulty: Difficulty.EASY,
    question: 'What is the beautiful capital city of France, famous for the twinkling Eiffel Tower?',
    options: ['London', 'Berlin', 'Rome', 'Paris'],
    correctIndex: 3,
    explanation: 'Paris is the capital of France! It is also known as the "City of Light" because it was one of the first European cities to get gas street lighting.'
  },
  {
    id: 'q5',
    category: QuizCategory.CAPITALS,
    difficulty: Difficulty.MEDIUM,
    question: 'Buenos Aires is the coastal capital of which football-loving country?',
    options: ['Brazil', 'Spain', 'Argentina', 'Morocco'],
    correctIndex: 2,
    explanation: 'It is Argentina! Buenos Aires means "Fair Airs" or "Good Winds" in Spanish, because of its refreshing sea breezes.'
  },
  {
    id: 'q6',
    category: QuizCategory.CAPITALS,
    difficulty: Difficulty.HARD,
    question: 'What is the capital city of Australia, custom-built so it is located exactly between Sydney and Melbourne?',
    options: ['Sydney', 'Canberra', 'Brisbane', 'Melbourne'],
    correctIndex: 1,
    explanation: 'It is Canberra! It was chosen as a compromise in 1908 so Sydney and Melbourne wouldn’t fight over being the capital.'
  },

  // GEOGRAPHY & CONTINENTS
  {
    id: 'q7',
    category: QuizCategory.GEOGRAPHY,
    difficulty: Difficulty.EASY,
    question: 'What is the biggest jungle forest on Earth, home to pink river dolphins, colourful macaws, and millions of trees?',
    options: ['Sahara Desert', 'The Black Forest', 'The Amazon Rainforest', 'The Outback'],
    correctIndex: 2,
    explanation: 'The Amazon Rainforest in Brazil! It produces about 20% of the oxygen on Earth and contains thousands of unique wild animals.'
  },
  {
    id: 'q8',
    category: QuizCategory.GEOGRAPHY,
    difficulty: Difficulty.MEDIUM,
    question: 'In which spectacular Asian island country can you visit Mount Fuji, a perfect volcano cone surrounded by lakes?',
    options: ['China', 'Japan', 'South Korea', 'Australia'],
    correctIndex: 1,
    explanation: 'It is Japan! Mount Fuji is a sacred symbol of Japan, and many artists draw its beautiful snow-capped peak.'
  },
  {
    id: 'q9',
    category: QuizCategory.GEOGRAPHY,
    difficulty: Difficulty.HARD,
    question: 'The wondrous "Blue City" of Chefchaouen, where all houses and streets are painted sky-blue, is found in which country?',
    options: ['Morocco', 'Senegal', 'Spain', 'Germany'],
    correctIndex: 0,
    explanation: 'It is Morocco! The walls were traditionally painted blue to keep homes cool, repel mosquitoes, or symbolize heaven and the sky!'
  },

  // FOOTBALL
  {
    id: 'q10',
    category: QuizCategory.FOOTBALL,
    difficulty: Difficulty.EASY,
    question: 'Which country’s national team plays in yellow shirts and is the only country to win 5 World Cups?',
    options: ['Germany', 'Brazil', 'England', 'France'],
    correctIndex: 1,
    explanation: 'Brazil! Known as the "Seleção", they have won 5 World Cup trophies (1958, 1962, 1970, 1994, 2002) and made the yellow jersey legendary!'
  },
  {
    id: 'q11',
    category: QuizCategory.FOOTBALL,
    difficulty: Difficulty.MEDIUM,
    question: 'Which European team is nicknamed "Les Bleus" (The Blues) and won the World Cup in 1998 and 2018?',
    options: ['Germany', 'Spain', 'Italy', 'France'],
    correctIndex: 3,
    explanation: 'It is France! They wear a rich blue jersey and their emblem features a proud rooster.'
  },
  {
    id: 'q12',
    category: QuizCategory.FOOTBALL,
    difficulty: Difficulty.HARD,
    question: 'Supported by their roaring fans, which amazing country became the first-ever African and Arab nation to reach the World Cup Semifinal in 2022?',
    options: ['Senegal', 'Morocco', 'Japan', 'Australia'],
    correctIndex: 1,
    explanation: 'It is Morocco! Nicknamed the "Atlas Lions," they shocked the world by defeating Spain and Portugal to reach the semi-finals.'
  }
];
