/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGame } from '../context/GameContext';
import { Compass, Trophy, Award, BookOpen, Star, Sparkles, UserCheck, Flame } from 'lucide-react';
import { MascotGuide } from './MascotGuide';
import { motion } from 'motion/react';

interface DashboardProps {
  onNavigate: (tab: 'explore' | 'groups' | 'quiz' | 'passport' | 'achievements') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentUser, users } = useGame();

  // Sort players for regional leaderboard ranking
  const sortedPlayers = [...users].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Playful Welcome Hero Banner */}
      <div className="kids-card bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 border-none p-8 text-white relative overflow-hidden shadow-2xl">
        {/* Abstract soccer circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-12 -translate-x-12 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-505/30 text-yellow-300 font-mono text-xs font-black uppercase tracking-wider shadow-sm border border-indigo-400/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Educational Playground ⚽
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight leading-tight filter drop-shadow">
              World Cup Explorer
            </h1>
            <p className="font-sans font-medium text-indigo-100 max-w-xl text-sm sm:text-base leading-relaxed">
              Hey Globetrotters! Grab your digital passport and travel with us across the continents to discover countries, cultures, capital cities, and football heroes!
            </p>
          </div>

          {/* Sizable character indicator */}
          <div className="kids-card bg-white text-slate-800 p-4 border-none flex items-center gap-4 shadow-xl">
            <span className="text-4xl bg-indigo-55 p-2.5 rounded-2xl border border-indigo-100">
              {currentUser ? currentUser.avatar : '👤'}
            </span>
            <div>
              <span className="block text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest">
                ACTIVE CHAMPION
              </span>
              <span className="block font-display font-black text-lg leading-tight text-indigo-900">
                {currentUser ? currentUser.name : 'Unknown Player'}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 mt-1.5 font-bold">
                ⚽ {currentUser ? currentUser.score : 0} points
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Device Module Hub */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-black text-2xl text-slate-900 flex items-center gap-2">
          🌍 Explore the World! <span className="animate-bounce">🌍</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Module 1: EXPLORE COUNTRIES */}
        <button
          onClick={() => onNavigate('explore')}
          className="rounded-[32px] bg-rose-500 p-6 flex flex-col items-center justify-center text-center gap-3 text-white cursor-pointer hover:-translate-y-1.5 shadow-[0_8px_0_0_#be123c] hover:bg-rose-450 transition-all duration-350 relative group"
        >
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 group-hover:bg-white/20 transition-colors">
            <Compass className="w-8 h-8 text-white animate-pulse" />
          </div>
          <span className="font-display font-black text-lg block tracking-tight">
            Explore Countries
          </span>
          <span className="text-xs font-sans text-rose-50 font-medium leading-normal">
            Learn landmarks, food, & player stats!
          </span>
        </button>

        {/* Module 2: GROUPS & MATCH FIXTURES */}
        <button
          onClick={() => onNavigate('groups')}
          className="rounded-[32px] bg-emerald-500 p-6 flex flex-col items-center justify-center text-center gap-3 text-white cursor-pointer hover:-translate-y-1.5 shadow-[0_8px_0_0_#059669] hover:bg-emerald-450 transition-all duration-350 relative group"
        >
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 group-hover:bg-white/20 transition-colors">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <span className="font-display font-black text-lg block tracking-tight">
            Groups & Tables
          </span>
          <span className="text-xs font-sans text-emerald-50 font-medium leading-normal">
            View match scores & active group ranking!
          </span>
        </button>

        {/* Module 3: QUIZ ARENA */}
        <button
          onClick={() => onNavigate('quiz')}
          className="rounded-[32px] bg-indigo-500 p-6 flex flex-col items-center justify-center text-center gap-3 text-white cursor-pointer hover:-translate-y-1.5 shadow-[0_8px_0_0_#4338ca] hover:bg-indigo-450 transition-all duration-350 relative group"
        >
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 group-hover:bg-white/20 transition-colors">
            <Award className="w-8 h-8 text-white" />
          </div>
          <span className="font-display font-black text-lg block tracking-tight">
            Quiz Arena
          </span>
          <span className="text-xs font-sans text-indigo-50 font-medium leading-normal">
            Play solo or duel in Sibling shootout!
          </span>
        </button>

        {/* Module 4: PASS PORT */}
        <button
          onClick={() => onNavigate('passport')}
          className="rounded-[32px] bg-amber-500 p-6 flex flex-col items-center justify-center text-center gap-3 text-white cursor-pointer hover:-translate-y-1.5 shadow-[0_8px_0_0_#d97706] hover:bg-amber-450 transition-all duration-350 relative group"
        >
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 group-hover:bg-white/20 transition-colors">
            <BookOpen className="w-8 h-8 text-white animate-spin-gentle" />
          </div>
          <span className="font-display font-black text-lg block tracking-tight">
            Digital Passport
          </span>
          <span className="text-xs font-sans text-amber-50 font-medium leading-normal">
            Review your collection of passport stamps!
          </span>
        </button>

        {/* Module 5: ACHIEVEMENTS */}
        <button
          onClick={() => onNavigate('achievements')}
          className="rounded-[32px] bg-sky-500 p-6 flex flex-col items-center justify-center text-center gap-3 text-white cursor-pointer hover:-translate-y-1.5 shadow-[0_8px_0_0_#0284c7] hover:bg-sky-450 transition-all duration-350 relative group"
        >
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 group-hover:bg-white/20 transition-colors">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <span className="font-display font-black text-lg block tracking-tight">
            Achievements
          </span>
          <span className="text-xs font-sans text-sky-50 font-medium leading-normal">
            See your unlocked golden medals!
          </span>
        </button>
      </div>

      {/* Middle Grid: Global Leaderboard & Quick Progress Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1: Dashboard Progress Summary */}
        <div className="kids-card bg-emerald-50/40 border border-emerald-100/50 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="font-display font-black text-xl text-emerald-900 flex items-center gap-2 mb-5">
              <UserCheck className="w-5 h-5 text-emerald-600" /> Player Progress
            </h3>
            
            {currentUser ? (
              <div className="space-y-5">
                {/* Visual bar counting stamps */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono font-black text-slate-400 mb-1.5 tracking-wider">
                    <span>EXPLORED COUNTRIES</span>
                    <span className="text-emerald-700">{currentUser.exploredCountries.length} / 10</span>
                  </div>
                  <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden p-0.5 border border-slate-150">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${currentUser.exploredCountries.length * 10}%` }}
                    />
                  </div>
                </div>

                {/* Achievements progress */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono font-black text-slate-400 mb-1.5 tracking-wider">
                    <span>MEDALS AWARDED</span>
                    <span className="text-indigo-700">{currentUser.achievements.length} / 8</span>
                  </div>
                  <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden p-0.5 border border-slate-150">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-200 shadow-sm"
                      style={{ width: `${(currentUser.achievements.length / 8) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Accuracy percentage */}
                <div className="bg-white rounded-2xl border border-slate-100 p-3.5 flex justify-between items-center shadow-sm">
                  <span className="font-display font-bold text-xs text-slate-605 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500 animate-bounce" /> Quiz Accuracy
                  </span>
                  <span className="font-mono font-black text-lg text-slate-800">
                    {currentUser.quizAttempts > 0
                      ? `${Math.round((currentUser.quizCorrectAnswers / currentUser.quizAttempts) * 105)}%`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-sm font-sans italic">
                Please switch/make a player profile to record achievements!
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-dashed border-slate-200/60 mt-4 flex gap-2">
            <button
              onClick={() => onNavigate('passport')}
              className="kids-btn-sm w-full font-bold text-xs justify-center text-center py-2.5"
            >
              📖 Open Passport Booklet
            </button>
          </div>
        </div>

        {/* Section 2: Champion Leaderboard */}
        <div className="kids-card bg-indigo-50/40 border border-indigo-100/50 lg:col-span-2 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="font-display font-black text-xl text-indigo-900 flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> Leaderboard
            </h3>
            
            <div className="space-y-3">
              {sortedPlayers.map((p, index) => {
                const isSelected = p.id === currentUser?.id;
                let rankStyle = "bg-slate-50 border-slate-200 text-slate-500";
                if (index === 0) rankStyle = "bg-yellow-400 border-yellow-500 text-slate-950";
                if (index === 1) rankStyle = "bg-slate-300 border-slate-400 text-slate-950";
                if (index === 2) rankStyle = "bg-orange-300 border-orange-400 text-slate-950";

                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isSelected ? 'border-indigo-200 bg-white shadow-md scale-[1.01]' : 'border-slate-100 bg-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Sphere */}
                      <span className={`w-8 h-8 rounded-xl border font-mono flex items-center justify-center font-black text-xs ${rankStyle}`}>
                        {index + 1}
                      </span>
                      {/* Avatar */}
                      <span className="text-2xl">{p.avatar}</span>
                      {/* Name */}
                      <span className="font-display font-black text-indigo-950 text-sm">
                        {p.name}
                        {isSelected && <span className="text-[9px] ml-2 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-lg font-mono font-bold">YOU</span>}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50/60 rounded-xl border border-indigo-100/50 font-mono font-bold text-xs text-indigo-750">
                      ⚽ {p.score} pts
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-sans italic text-center mt-4">
            Earn 50 pts per brand new checked country & points for every correct quiz answer!
          </div>
        </div>
      </div>

      {/* Alligator Mascot Guide section */}
      <h2 className="font-display font-black text-2xl text-indigo-950 pt-3 flex items-center gap-2">
        🐊 Ask Mascot Goldie
      </h2>
      <MascotGuide />
    </div>
  );
};
