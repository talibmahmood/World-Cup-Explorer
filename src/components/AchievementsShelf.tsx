/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { Sparkles, Trophy, Award, Lock, ShieldAlert } from 'lucide-react';
import { sfx } from '../lib/audio';

export const AchievementsShelf: React.FC = () => {
  const { currentUser } = useGame();

  const unlockedCount = currentUser?.achievements.length || 0;
  const isAllUnlocked = unlockedCount === ACHIEVEMENTS_DATA.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Shelf Header */}
      <div className="kids-card bg-sky-50 border-sky-600">
        <h2 className="font-display font-black text-3xl text-slate-800 flex items-center gap-2 mb-2 leading-none">
          🏅 My Trophy & Medals Shelf
        </h2>
        <p className="font-sans text-xs sm:text-sm text-slate-500">
          Crack trivia questions, get passport stamps, and discover continents to unlock rare golden champion badges!
        </p>
      </div>

      {/* Main Medal Shelf Card representation */}
      <div className="kids-card bg-amber-50 border-slate-900 shadow-[10px_10px_0px_0px_#0f172a] p-8 relative">
        <div className="flex justify-between items-center mb-8 border-b-4 border-dashed border-slate-200 pb-4">
          <div>
            <h3 className="font-display font-black text-xl text-slate-800 flex items-center gap-1">
              🏆 Trophy Shelf ({unlockedCount} / {ACHIEVEMENTS_DATA.length})
            </h3>
            <span className="block font-mono text-[9px] font-bold text-slate-400 mt-0.5">
              SECURED BY THE WORLD CUP ACADEMY
            </span>
          </div>

          <span className="font-mono text-xs font-black bg-slate-900 text-yellow-400 px-3 py-1 rounded-full">
            {unlockedCount === 0 ? 'ROOKIE' : isAllUnlocked ? 'MASTER LEGEND' : 'CHAMPION EXPLORER'}
          </span>
        </div>

        {/* Medals grid representing shelves */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {ACHIEVEMENTS_DATA.map(badge => {
            const isUnlocked = currentUser?.achievements.includes(badge.id) || false;

            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center justify-between p-5 rounded-3xl border-3 text-center transition ${
                  isUnlocked
                    ? 'border-slate-900 bg-white hover:-translate-y-1.5 shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a]'
                    : 'border-slate-200 bg-slate-50/40 opacity-55'
                }`}
              >
                {/* Locket badge sphere */}
                <div
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center relative shadow-sm ${
                    isUnlocked
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
                      : 'border-slate-350 bg-white text-slate-300'
                  }`}
                >
                  {isUnlocked ? (
                    <span className="text-3xl" style={{ animation: isUnlocked ? 'wiggle 2s infinite ease-in-out' : '' }}>
                      {badge.title === 'First Step' ? '🧭' :
                       badge.title === 'World Explorer' ? '🌍' :
                       badge.title === 'Continent Hopper' ? '🗺️' :
                       badge.title === 'Samba Stamp' ? '🎷' :
                       badge.title === 'Atlas & Teranga' ? '🦁' :
                       badge.title === 'Quiz Hero' ? '🎖️' :
                       badge.title === 'Quiz Legend' ? '🥇' : '🏆'}
                    </span>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-300" />
                  )}

                  {isUnlocked && (
                    <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full p-1.5 border border-slate-900 text-[10px] leading-none animate-ping absolute block w-4 h-4" />
                  )}
                </div>

                {/* Badge title desc */}
                <div className="mt-4 space-y-1">
                  <h4 className="font-display font-extrabold text-sm text-slate-800 leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] font-sans text-slate-500 leading-snug">
                    {badge.desc}
                  </p>
                </div>

                {/* Lock indicator message */}
                <div className="mt-4 pt-3 border-t border-slate-100 w-full text-[9px] font-mono uppercase tracking-wider font-extrabold text-slate-400">
                  {isUnlocked ? (
                    <span className="text-emerald-600">UNLOCKED 🎉</span>
                  ) : (
                    <span className="text-slate-400">LOCKED 🔒</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Shelf Wood Plank Visual Accent */}
        <div className="w-full bg-[#b7094c] h-5 rounded-full border-3 border-slate-900 mt-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 bg-stripe" />
          <span className="text-[10px] text-white font-mono font-bold tracking-widest">WORLD CUP CHAMPION BADGES</span>
        </div>
      </div>

      {/* Encouragement footer */}
      {isAllUnlocked && (
        <div className="p-4 bg-yellow-400 border-3 border-slate-900 rounded-2xl flex items-center gap-3 animate-bounce-gentle overflow-hidden text-slate-950 relative">
          <span className="text-4xl animate-spin" style={{ animationDuration: '4s' }}>⭐</span>
          <div>
            <h4 className="font-display font-black text-sm">
              YOU ARE A CERTIFIED WORLD CUP GEOGRAPHY KING/QUEEN!
            </h4>
            <p className="font-sans text-[11px] leading-relaxed">
              Oh my goal-gator swamp! You have unlocked evvvvery single medal on the shelf! Lionel, Sam, and Coach Parent are staring in absolute awe! You are the ultimate master legend player!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
