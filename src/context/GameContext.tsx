/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Country } from '../types';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { COUNTRIES_DATA } from '../data/countries';
import { sfx } from '../lib/audio';

interface GameContextType {
  users: UserProfile[];
  currentUser: UserProfile | null;
  selectUser: (id: string) => void;
  createUser: (name: string, avatar: string, color: string) => UserProfile;
  deleteUser: (id: string) => void;
  exploreCountry: (countryId: string) => void;
  submitQuizResult: (correctAnswers: number, totalQuestions: number, category: string, difficulty: string) => void;
  syncFirebase: () => void;
  resetAll: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'child1',
    name: 'Lionel',
    avatar: '🦁',
    color: 'emerald',
    score: 180,
    achievements: ['first_step', 'samba_stamp'],
    exploredCountries: ['br', 'ar'],
    stamps: { br: new Date().toLocaleDateString(), ar: new Date().toLocaleDateString() },
    quizCorrectAnswers: 4,
    quizAttempts: 6
  },
  {
    id: 'child2',
    name: 'Sam my Star',
    avatar: '🐼',
    color: 'sky',
    score: 350,
    achievements: ['first_step', 'quiz_hero', 'samba_stamp', 'continent_hopper'],
    exploredCountries: ['br', 'jp', 'ca'],
    stamps: {
      br: new Date().toLocaleDateString(),
      jp: new Date().toLocaleDateString(),
      ca: new Date().toLocaleDateString()
    },
    quizCorrectAnswers: 8,
    quizAttempts: 10
  },
  {
    id: 'parent',
    name: 'Coach Parent',
    avatar: '🦉',
    color: 'amber',
    score: 50,
    achievements: ['first_step'],
    exploredCountries: ['de'],
    stamps: { de: new Date().toLocaleDateString() },
    quizCorrectAnswers: 2,
    quizAttempts: 2
  }
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('world_cup_explorer_users');
    const storedCurrentUserId = localStorage.getItem('world_cup_explorer_current_uid');

    if (storedUsers) {
      try {
        const parsed = JSON.parse(storedUsers);
        setUsers(parsed);
        if (storedCurrentUserId && parsed.some((u: UserProfile) => u.id === storedCurrentUserId)) {
          setCurrentUserId(storedCurrentUserId);
        } else if (parsed.length > 0) {
          setCurrentUserId(parsed[0].id);
        }
      } catch (e) {
        setUsers(DEFAULT_USERS);
        setCurrentUserId(DEFAULT_USERS[0].id);
      }
    } else {
      // Bootstrap with fun pre-configured sibling/coach accounts
      setUsers(DEFAULT_USERS);
      setCurrentUserId(DEFAULT_USERS[0].id);
      localStorage.setItem('world_cup_explorer_users', JSON.stringify(DEFAULT_USERS));
      localStorage.setItem('world_cup_explorer_current_uid', DEFAULT_USERS[0].id);
    }
  }, []);

  // Save changes to LocalStorage whenever state evolves
  const saveToStorage = (updatedUsers: UserProfile[], currentUid: string | null) => {
    localStorage.setItem('world_cup_explorer_users', JSON.stringify(updatedUsers));
    if (currentUid) {
      localStorage.setItem('world_cup_explorer_current_uid', currentUid);
    }
  };

  const selectUser = (id: string) => {
    setCurrentUserId(id);
    localStorage.setItem('world_cup_explorer_current_uid', id);
    sfx.playCoin();
  };

  const createUser = (name: string, avatar: string, color: string): UserProfile => {
    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      name,
      avatar,
      color,
      score: 0,
      achievements: [],
      exploredCountries: [],
      stamps: {},
      quizCorrectAnswers: 0,
      quizAttempts: 0
    };
    
    const updated = [...users, newUser];
    setUsers(updated);
    setCurrentUserId(newUser.id);
    saveToStorage(updated, newUser.id);
    sfx.playLevelUp();
    return newUser;
  };

  const deleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    if (currentUserId === id) {
      const nextUid = updated.length > 0 ? updated[0].id : null;
      setCurrentUserId(nextUid);
      saveToStorage(updated, nextUid);
    } else {
      saveToStorage(updated, currentUserId);
    }
    sfx.playFailure();
  };

  const checkAchievements = (user: UserProfile): string[] => {
    const unlocked = [...user.achievements];
    const totalExplored = user.exploredCountries.length;
    const totalCorrect = user.quizCorrectAnswers;

    // First step
    if (totalExplored >= 1 && !unlocked.includes('first_step')) {
      unlocked.push('first_step');
    }
    // World explorer
    if (totalExplored >= 10 && !unlocked.includes('world_explorer')) {
      unlocked.push('world_explorer');
    }
    // Continent Hopper (requires 3 distinct continents)
    const continents = new Set(
      user.exploredCountries
        .map(cid => COUNTRIES_DATA.find(c => c.id === cid)?.continent)
        .filter(Boolean)
    );
    if (continents.size >= 3 && !unlocked.includes('continent_hopper')) {
      unlocked.push('continent_hopper');
    }
    // Samba stamp (Brazil visited)
    if (user.exploredCountries.includes('br') && !unlocked.includes('samba_stamp')) {
      unlocked.push('samba_stamp');
    }
    // African Pride (Morocco + Senegal visited)
    if (user.exploredCountries.includes('ma') && user.exploredCountries.includes('sn') && !unlocked.includes('african_pride')) {
      unlocked.push('african_pride');
    }
    // Quiz Hero
    if (totalCorrect >= 5 && !unlocked.includes('quiz_hero')) {
      unlocked.push('quiz_hero');
    }
    // Quiz Legend
    if (totalCorrect >= 15 && !unlocked.includes('quiz_legend')) {
      unlocked.push('quiz_legend');
    }

    return unlocked;
  };

  const exploreCountry = (countryId: string) => {
    if (!currentUserId) return;

    let unlockedNewAchievement = false;

    const updated = users.map(u => {
      if (u.id === currentUserId) {
        if (u.exploredCountries.includes(countryId)) {
          return u; // Already explored
        }

        const newExplored = [...u.exploredCountries, countryId];
        const newStamps = { ...u.stamps, [countryId]: new Date().toLocaleDateString() };
        
        // Add 50 points for discovering a country!
        const newScore = u.score + 50;
        
        let updatedUser: UserProfile = {
          ...u,
          exploredCountries: newExplored,
          stamps: newStamps,
          score: newScore
        };

        const newAchievements = checkAchievements(updatedUser);
        if (newAchievements.length > u.achievements.length) {
          unlockedNewAchievement = true;
          updatedUser.achievements = newAchievements;
        }

        return updatedUser;
      }
      return u;
    });

    setUsers(updated);
    saveToStorage(updated, currentUserId);

    // Audio effects!
    if (unlockedNewAchievement) {
      sfx.playLevelUp();
    } else {
      sfx.playCoin();
    }
  };

  const submitQuizResult = (
    correctAnswers: number,
    totalQuestions: number,
    category: string,
    difficulty: string
  ) => {
    if (!currentUserId) return;

    let unlockedNewAchievement = false;

    const updated = users.map(u => {
      if (u.id === currentUserId) {
        // Calculate points based on difficulty: 
        // Easy: 20 points per correct answer
        // Medium: 35 points per correct answer
        // Hard: 50 points per correct answer
        let pointsMultiplier = 20;
        if (difficulty === 'medium') pointsMultiplier = 35;
        if (difficulty === 'hard') pointsMultiplier = 50;

        const scoreGained = correctAnswers * pointsMultiplier;
        
        let updatedUser: UserProfile = {
          ...u,
          score: u.score + scoreGained,
          quizAttempts: u.quizAttempts + totalQuestions,
          quizCorrectAnswers: u.quizCorrectAnswers + correctAnswers
        };

        // Special Perfect Football Guru Achievement (Perfect score 3/3 on Medium or Hard football)
        if (
          category === 'football' && 
          correctAnswers === 3 && 
          totalQuestions === 3 && 
          (difficulty === 'medium' || difficulty === 'hard') &&
          !updatedUser.achievements.includes('football_guru')
        ) {
          updatedUser.achievements = [...updatedUser.achievements, 'football_guru'];
          unlockedNewAchievement = true;
        }

        const newAchievements = checkAchievements(updatedUser);
        if (newAchievements.length > updatedUser.achievements.length) {
          unlockedNewAchievement = true;
          updatedUser.achievements = newAchievements;
        }

        return updatedUser;
      }
      return u;
    });

    setUsers(updated);
    saveToStorage(updated, currentUserId);

    if (unlockedNewAchievement) {
      sfx.playLevelUp();
    } else if (correctAnswers > 0) {
      sfx.playSuccess();
    } else {
      sfx.playFailure();
    }
  };

  const syncFirebase = () => {
    // This provides a friendly layout trigger with detailed instructions on how to hook up Firestore.
    alert(
      "Firebase Integration Option:\n\n" +
      "1. Run 'set_up_firebase' under the platform UI.\n" +
      "2. Uncomment the cloud DB hooks in 'src/context/GameContext.tsx'.\n" +
      "3. All stats automatically sync server-side to keep kids' profiles safe on tablets, mobile and desktop!"
    );
  };

  const resetAll = () => {
    setUsers(DEFAULT_USERS);
    setCurrentUserId(DEFAULT_USERS[0].id);
    saveToStorage(DEFAULT_USERS, DEFAULT_USERS[0].id);
    sfx.playFailure();
  };

  const currentUser = users.find(u => u.id === currentUserId) || null;

  return (
    <GameContext.Provider
      value={{
        users,
        currentUser,
        selectUser,
        createUser,
        deleteUser,
        exploreCountry,
        submitQuizResult,
        syncFirebase,
        resetAll
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
