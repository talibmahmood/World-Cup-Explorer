/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES_DATA } from '../data/countries';
import { BookOpen, Star, Sparkles, UserCheck, Calendar, Download } from 'lucide-react';
import { sfx } from '../lib/audio';

export const Passport: React.FC = () => {
  const { currentUser } = useGame();

  const totalStamps = currentUser ? Object.keys(currentUser.stamps).length : 0;
  const isComplete = totalStamps === 10;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Booklet Header */}
      <div className="kids-card bg-amber-50 border-amber-600">
        <h2 className="font-display font-black text-3xl text-slate-800 flex items-center gap-2 mb-2 leading-none">
          📔 My Digital Passport Booklet
        </h2>
        <p className="font-sans text-xs sm:text-sm text-slate-500">
          Explore countries in the catalog, learn their secrets, and click "Stamp my Passport" to collect colorful country seals!
        </p>
      </div>

      {/* Main Passport Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Custom Credential ID Page */}
        <div className="kids-card bg-[#1d3557] border-slate-900 text-white flex flex-col justify-between overflow-hidden relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Passport gold crest design */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 border-4 border-dashed border-white/5 rounded-full pointer-events-none" />

          {/* Top Banner */}
          <div className="border-b-4 border-slate-900 pb-4 mb-4 flex justify-between items-center z-10">
            <div>
              <span className="block font-mono text-[9px] text-[#e63946] font-black tracking-widest uppercase">
                ISSUING AUTHORITY
              </span>
              <span className="block font-display font-extrabold text-sm tracking-wide text-yellow-400">
                W.C. EXPLORER SERVICE
              </span>
            </div>
            <span className="text-2xl animate-spin" style={{ animationDuration: '6s' }}>🌍</span>
          </div>

          {/* Owner details */}
          <div className="space-y-6 z-10">
            <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-2xl border border-white/20">
              <span className="text-5xl bg-white p-2.5 rounded-3xl border-3 border-slate-900 select-none">
                {currentUser ? currentUser.avatar : '👤'}
              </span>
              <div>
                <span className="block text-[8px] font-mono text-slate-300 uppercase tracking-widest leading-none mb-1">
                  PASSPORT HOLDER
                </span>
                <span className="block font-display font-extrabold text-xl text-yellow-300">
                  {currentUser ? currentUser.name : 'Unknown Player'}
                </span>
                <span className="block font-mono text-[10px] text-slate-350 mt-1 font-bold">
                  ID: GLO-{currentUser ? currentUser.id.toUpperCase() : 'USER'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#111c30] p-4 rounded-2xl border border-white/15">
              <div>
                <span className="block font-mono text-[8px] text-slate-400 tracking-wider">TOTAL STAMPS</span>
                <span className="font-display font-bold text-lg text-emerald-400">{totalStamps} / 10</span>
              </div>
              <div>
                <span className="block font-mono text-[8px] text-slate-400 tracking-wider">CHAMPION RANK</span>
                <span className="font-display font-bold text-lg text-yellow-400">
                  {isComplete ? 'Elite Globetrotter' : totalStamps >= 5 ? 'Junior Pilot' : 'Citizen'}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-white/5">
                <span className="block font-mono text-[8px] text-slate-500">BOOK STATUS</span>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 mt-1 border border-white/10">
                  <div
                    className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${totalStamps * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booklet footprint quote */}
          <div className="border-t-2 border-dashed border-[#ffffff1c] pt-4 mt-6 text-center text-[10px] font-sans italic text-slate-300 z-10 leading-relaxed">
            "We certify that the bearer is an authorized champion of football, capital cities, and world history. Stamp safely, explore daily!"
          </div>
        </div>

        {/* Right Columns: Stamp Collector Cards Grid */}
        <div className="lg:col-span-2 kids-card bg-white border-slate-900">
          <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-dashed border-slate-100">
            <h3 className="font-display font-extrabold text-xl text-slate-800 flex items-center gap-1.5 leading-none">
              <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500/10" /> Collectible Seals
            </h3>
            <span className="font-mono text-xs font-bold text-slate-400 bg-slate-50 border px-2.5 py-0.5 rounded-full">
              PROGRESS: {totalStamps * 10}%
            </span>
          </div>

          {/* Stamp elements layouts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
            {COUNTRIES_DATA.map(c => {
              const dateUnlocked = currentUser?.stamps[c.id];
              const isUnlocked = !!dateUnlocked;

              return (
                <div
                  key={c.id}
                  className={`relative flex flex-col items-center justify-center text-center p-3 rounded-2xl border-3 transition-transform ${
                    isUnlocked
                      ? 'border-slate-900 bg-gradient-to-b from-yellow-50/20 to-yellow-105/10 bg-white hover:-translate-y-1 hover:shadow-md'
                      : 'border-slate-200 bg-slate-50/50 opacity-60'
                  }`}
                  title={isUnlocked ? `Stamped on ${dateUnlocked}` : `${c.name} (locked)`}
                >
                  {/* Circular Stamp Body */}
                  <div
                    className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center relative select-none ${
                      isUnlocked
                        ? 'border-indigo-600 bg-indigo-50/55 animate-fadeIn'
                        : 'border-slate-300 border-dashed bg-white'
                    }`}
                  >
                    {isUnlocked ? (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl leading-none">{c.flag}</span>
                        {/* Tiny Stamp tag */}
                        <span className="text-[7px] font-mono leading-none font-black text-rose-500 mt-1 uppercase tracking-widest scale-90">
                          APPROVED
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-mono font-bold text-slate-300">
                        ?
                      </span>
                    )}

                    {/* Unlocked stamp badge indicator */}
                    {isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 border-2 border-slate-900 rounded-full p-0.5 text-[8px] leading-tight">
                        ⭐
                      </div>
                    )}
                  </div>

                  {/* Stamp Country details */}
                  <div className="mt-2.5">
                    <span className="block font-display font-extrabold text-xs text-slate-800 leading-none">
                      {c.name}
                    </span>
                    <span className="block font-mono text-[8px] text-slate-400 mt-1 font-bold leading-none">
                      {isUnlocked ? `STAMPED` : `UNVISITED`}
                    </span>
                  </div>

                  {/* date unlocked badge */}
                  {isUnlocked && (
                    <span className="text-[8px] font-mono font-medium text-slate-400 mt-1 uppercase scale-90 block">
                      📅 {dateUnlocked}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Celebratory finish banner */}
          {isComplete && (
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-3 border-emerald-400 rounded-2xl flex items-center gap-3.5 animate-bounce-gentle">
              <span className="text-3xl">🥳</span>
              <div>
                <h4 className="font-display font-black text-emerald-800 text-sm">
                  PASSPORT COMPLETED!
                </h4>
                <p className="font-sans text-[11px] text-emerald-600 leading-normal">
                  Congratulations, Athlete! You have walked every landscape, explored all 10 national profiles, and officially completed your Digital Passport Book! You are a Geography Master!
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
