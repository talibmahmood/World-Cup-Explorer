/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum QuizCategory {
  FLAGS = 'flags',
  CAPITALS = 'capitals',
  COUNTRIES = 'countries',
  CONTINENTS = 'continents',
  GEOGRAPHY = 'geography',
  FOOTBALL = 'football'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface Landmark {
  name: string;
  desc: string;
  icon: string;
}

export interface FoodItem {
  name: string;
  desc: string;
  emoji: string;
}

export interface TeamStats {
  pace: number;
  shoot: number;
  pass: number;
  dribble: number;
  defense: number;
  physical: number;
}

export interface Country {
  id: string; // e.g. "br", "ar", "fr"
  name: string;
  flag: string; // Emoji
  continent: string;
  capital: string;
  population: string;
  area: string;
  currency: string;
  language: string;
  worldCupsWon: number;
  color: string; // Tailwind color name like "emerald", "amber", "sky", "red"
  coordinates: {
    lat: number;
    lng: number;
    x: number; // For plotting on a standard flat world map component (0-100%)
    y: number; // For plotting on a standard flat world map component (0-100%)
  };
  geography: {
    region: string;
    neighboring: string[];
    landmarks: Landmark[];
  };
  culture: {
    famousFood: FoodItem[];
    traditions: { name: string; desc: string }[];
    music: string;
    festivals: string[];
    interestingFacts: string[];
  };
  football: {
    nationalTeam: string;
    nickname: string;
    famousPlayers: string[];
    wcHistory: string;
    achievements: string[];
    stats: TeamStats;
  };
}

export interface Match {
  id: string;
  group: string;
  homeTeamCode: string;
  awayTeamCode: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  status: 'scheduled' | 'completed';
}

export interface Standing {
  teamCode: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface GroupData {
  name: string; // A, B, C, etc.
  teams: string[];
  standings: Standing[];
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string; // Lucide icon name
  color: string; // Card theme color
  category: 'discovery' | 'quiz' | 'geography' | 'football';
  requiredCount?: number;
}

export interface UserProgress {
  userId: string;
  countryId: string;
  explored: boolean;
  quizScore: number;
  unlockedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string; // Emoji or Key
  color: string; // Display color
  score: number;
  achievements: string[];
  exploredCountries: string[]; // List of country IDs
  stamps: { [countryId: string]: string }; // Map of countryId -> dateUnlocked
  quizCorrectAnswers: number;
  quizAttempts: number;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
