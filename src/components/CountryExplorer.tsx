/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES_DATA } from '../data/countries';
import { Country } from '../types';
import { Search, MapPin, Compass, BookOpen, Utensils, Award, Landmark, Sparkles, Volume2, Globe } from 'lucide-react';
import { sfx } from '../lib/audio';
import { motion, AnimatePresence } from 'motion/react';
import { InteractiveWorldMap } from './InteractiveWorldMap';
import { CountryMiniMap } from './CountryMiniMap';

export const CountryExplorer: React.FC = () => {
  const { currentUser, exploreCountry } = useGame();
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [activeCountryId, setActiveCountryId] = useState<string>('br');

  const filteredCountries = COUNTRIES_DATA.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.capital.toLowerCase().includes(search.toLowerCase()) ||
                          c.language.toLowerCase().includes(search.toLowerCase());
    const matchesContinent = selectedContinent === 'All' || c.continent === selectedContinent;
    return matchesSearch && matchesContinent;
  });

  const activeCountry = COUNTRIES_DATA.find(c => c.id === activeCountryId) || COUNTRIES_DATA[0];
  const isExplored = currentUser?.exploredCountries.includes(activeCountry.id) || false;

  const handleCountrySelect = (id: string) => {
    setActiveCountryId(id);
    sfx.playCoin();
  };

  const handleStamp = () => {
    if (!currentUser) return;
    exploreCountry(activeCountry.id);
  };

  const continents = ['All', 'South America', 'Europe', 'Asia', 'Africa', 'North America', 'Oceania'];

  // Color mappings for themed styled backgrounds
  const colorMap: { [key: string]: string } = {
    emerald: 'bg-emerald-550 border-emerald-600 focus:ring-emerald-400 text-emerald-800 bg-emerald-50',
    sky: 'bg-sky-500 border-sky-600 focus:ring-sky-400 text-sky-800 bg-sky-50',
    blue: 'bg-blue-500 border-blue-600 focus:ring-blue-400 text-blue-800 bg-blue-50',
    red: 'bg-red-500 border-red-600 focus:ring-red-400 text-red-800 bg-red-50',
    yellow: 'bg-yellow-400 border-yellow-600 focus:ring-yellow-400 text-yellow-800 bg-yellow-50',
    amber: 'bg-amber-400 border-amber-600 focus:ring-amber-400 text-amber-800 bg-amber-50',
    orange: 'bg-orange-500 border-orange-600 focus:ring-orange-400 text-orange-850 bg-orange-50',
    zinc: 'bg-zinc-400 border-zinc-600 focus:ring-zinc-400 text-zinc-800 bg-zinc-50',
    teal: 'bg-teal-500 border-teal-600 focus:ring-teal-400 text-teal-850 bg-teal-50'
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Search Header Deck */}
      <div className="kids-card bg-rose-50 border-slate-900">
        <h2 className="font-display font-black text-3xl text-slate-800 mb-6 flex items-center gap-2">
          🗺️ Discover the World!
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Text Input Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for country names, capitals, languages... (e.g. Portuguese)"
              className="w-full rounded-2xl border-3 border-slate-900 bg-white pl-12 pr-4 py-3 font-display text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Continent Filter Scroller */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {continents.map(cont => (
              <button
                key={cont}
                onClick={() => {
                  setSelectedContinent(cont);
                  sfx.playCoin();
                }}
                className={`kids-btn-sm text-xs select-none ${
                  selectedContinent === cont
                    ? 'bg-rose-400 text-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cont}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accurate Interactive World Geography Map */}
      <InteractiveWorldMap
        activeCountryId={activeCountryId}
        onCountrySelect={handleCountrySelect}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Flag gallery list */}
        <div className="lg:col-span-1">
          <div className="kids-card bg-white border-slate-900 p-4 h-[630px] flex flex-col">
            <h3 className="font-display font-extrabold text-slate-850 text-base mb-3 flex items-center gap-1.5 border-b-2 border-dashed border-slate-100 pb-2 shrink-0">
              <Globe className="w-5 h-5 text-indigo-500" /> Countries ({filteredCountries.length})
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
              {filteredCountries.length > 0 ? (
                filteredCountries.map(c => {
                  const isActive = c.id === activeCountryId;
                  const hasStamp = currentUser?.exploredCountries.includes(c.id);

                  return (
                    <button
                      key={c.id}
                      onClick={() => handleCountrySelect(c.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border-2 transition text-left cursor-pointer select-none ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50 font-bold font-display text-xs sm:text-sm'
                          : 'border-slate-200 hover:bg-slate-50 font-display text-xs sm:text-sm text-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl leading-none">{c.flag}</span>
                        <div className="leading-tight truncate max-w-[85px] sm:max-w-[110px]">
                           {c.name}
                        </div>
                      </div>

                      {hasStamp && (
                        <span className="text-[9px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full border border-yellow-300 font-mono font-medium scale-90">
                          ⭐ SEAL
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-slate-400 text-xs italic font-sans py-6 text-center">
                  None found! Try setting the filters or search value differently.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Columns: Active country profile detail boards */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCountry.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Header card with Flag / Core Metrics / Passport stamp */}
              <div className="kids-card bg-white border-slate-900 p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-dashed border-slate-200 pb-6">
                  {/* Flag and Name */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <span className="text-7xl p-3 bg-slate-50 rounded-3xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      {activeCountry.flag}
                    </span>
                    <div>
                      <span className="text-xs font-mono font-extrabold uppercase bg-slate-900 text-yellow-400 px-3 py-1 rounded-full border border-slate-700">
                        {activeCountry.continent}
                      </span>
                      <h1 className="font-display font-black text-4xl text-slate-850 tracking-tight mt-1">
                        {activeCountry.name}
                      </h1>
                      <p className="font-mono text-xs text-slate-500 mt-0.5 font-bold">
                        Nicknames: "{activeCountry.football.nickname}"
                      </p>
                    </div>
                  </div>

                  {/* Passport Stamp Center */}
                  <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-2xl border-3 border-dashed border-yellow-500 min-w-[200px]">
                    {isExplored ? (
                      <div className="text-center space-y-1">
                        <span className="text-4xl">🏵️</span>
                        <h4 className="font-display font-black text-emerald-600 text-sm">
                          PASSPORT SEAL UNLOCKED!
                        </h4>
                        <span className="block font-mono text-[10px] text-slate-500 font-bold">
                          Validated on {currentUser?.stamps[activeCountry.id]}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center space-y-3 w-full">
                        <span className="text-4xl grayscale opacity-45">🏵️</span>
                        
                        {currentUser ? (
                          <button
                            onClick={handleStamp}
                            className="w-full kids-btn-sm bg-yellow-400 hover:bg-yellow-350 text-slate-900 py-2 font-display font-extrabold text-xs justify-center"
                          >
                            Stamp my Passport! 🏵️
                          </button>
                        ) : (
                          <span className="text-xs font-sans text-slate-400 italic">
                            Create a player profile to earn stamps!
                          </span>
                        )}
                        <span className="block text-[9px] font-mono font-medium text-amber-800">
                          +50 Gold Points per stamp
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Country-specific Geographical Focus Map */}
                <div className="my-6">
                  <CountryMiniMap country={activeCountry} />
                </div>

                {/* Grid of basic attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4 border-t-2 border-slate-100">
                  <div className="p-3 bg-rose-50/60 rounded-2xl border-2 border-rose-100">
                    <span className="block text-[9px] font-mono font-black text-rose-500 uppercase tracking-tight">CAPITAL CITY</span>
                    <span className="block font-display font-bold text-slate-800 text-xs sm:text-sm mt-0.5">{activeCountry.capital}</span>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded-2xl border-2 border-emerald-100">
                    <span className="block text-[9px] font-mono font-black text-emerald-600 uppercase tracking-tight">POPULATION</span>
                    <span className="block font-display font-bold text-slate-800 text-xs sm:text-sm mt-0.5">{activeCountry.population}</span>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200">
                    <span className="block text-[9px] font-mono font-black text-amber-700 uppercase tracking-tight flex items-center gap-0.5">🏆 WC TITLES</span>
                    <span className="block font-display font-bold text-slate-850 text-xs sm:text-sm mt-0.5">
                      {activeCountry.worldCupsWon > 0 ? `${activeCountry.worldCupsWon} 🏆` : 'None yet'}
                    </span>
                  </div>

                  <div className="p-3 bg-sky-50/60 rounded-2xl border-2 border-sky-100">
                    <span className="block text-[9px] font-mono font-black text-sky-600 uppercase tracking-tight">CURRENCY</span>
                    <span className="block font-display font-bold text-slate-800 text-xs sm:text-sm mt-0.5">{activeCountry.currency}</span>
                  </div>

                  <div className="p-3 bg-purple-50/60 rounded-2xl border-2 border-purple-100">
                    <span className="block text-[9px] font-mono font-black text-purple-600 uppercase tracking-tight">LANGUAGE</span>
                    <span className="block font-display font-bold text-slate-800 text-xs sm:text-sm mt-0.5 truncate">{activeCountry.language}</span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Geography & Culture block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* GEOGRAPHY Notebook */}
                <div className="kids-card bg-emerald-50 border-slate-900">
                  <h3 className="font-display font-black text-xl text-slate-800 flex items-center gap-2 mb-4 border-b-2 border-dashed border-slate-200 pb-2">
                    <Compass className="w-5 h-5 text-emerald-600" /> Geography & Nature
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 tracking-wider block mb-1">
                        WHERE IN THE WORLD?
                      </span>
                      <p className="text-sm font-sans text-slate-600 leading-relaxed bg-white p-3 rounded-2xl border border-slate-300">
                        {activeCountry.geography.region}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 tracking-wider block mb-1">
                        NEIGHBORING COUNTRIES
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeCountry.geography.neighboring.map((neigh, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white text-slate-650 px-3 py-1 rounded-full border border-slate-300 font-sans font-bold flex items-center gap-1"
                          >
                            📍 {neigh}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 tracking-wider block mb-2">
                        MAJOR LANDMARKS FOR KIDS!
                      </span>
                      <div className="space-y-3">
                        {activeCountry.geography.landmarks.map((l, index) => {
                          return (
                            <div key={index} className="flex gap-2.5 items-start bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                              <span className="text-lg p-2 bg-emerald-100 rounded-xl border border-emerald-300 text-emerald-700">
                                <Landmark className="w-4 h-4" />
                              </span>
                              <div>
                                <h4 className="font-display font-extrabold text-sm text-slate-800 leading-none mb-1">
                                  {l.name}
                                </h4>
                                <p className="text-xs font-sans text-slate-500 leading-relaxed">
                                  {l.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CULTURE CARD */}
                <div className="kids-card bg-indigo-50 border-slate-900">
                  <h3 className="font-display font-black text-xl text-slate-800 flex items-center gap-2 mb-4 border-b-2 border-dashed border-slate-200 pb-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" /> Culture & Food
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 tracking-wider block mb-2">
                        FAMOUS FOODS TO TRY! 😋
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {activeCountry.culture.famousFood.map((food, index) => (
                          <div key={index} className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200">
                            <span className="text-3xl bg-indigo-50 p-1.5 rounded-xl border border-indigo-200">{food.emoji}</span>
                            <div>
                              <h4 className="font-display font-extrabold text-xs sm:text-sm text-indigo-950 leading-none mb-0.5">
                                {food.name}
                              </h4>
                              <p className="text-[11px] font-sans text-slate-500 leading-tight">
                                {food.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 tracking-wider block mb-1">
                        TRADITIONS & RHYTHMS
                      </span>
                      <div className="bg-white p-3 rounded-2xl border border-slate-250 text-slate-600 space-y-2 text-sm">
                        <p className="font-sans">
                          🎵 <strong className="text-indigo-950 font-display font-bold">National Music:</strong> {activeCountry.culture.music}
                        </p>
                        {activeCountry.culture.traditions.map((t, idx) => (
                          <p key={idx} className="font-sans leading-relaxed text-xs">
                            💡 <strong className="text-slate-850 font-medium">{t.name}:</strong> {t.desc}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 tracking-wider block mb-1">
                        DID YOU KNOW FRONTIER?
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-xs font-sans text-slate-600 leading-relaxed border-t border-indigo-200 pt-2">
                        {activeCountry.culture.interestingFacts.map((fact, idx) => (
                          <li key={idx}>
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Section: Football Deck (FIFA Rating Card & Champions) */}
              <div className="kids-card bg-amber-50 border-slate-900">
                <h3 className="font-display font-black text-xl text-slate-800 flex items-center gap-2 mb-4 border-b-2 border-dashed border-slate-200 pb-2">
                  <Award className="w-5 h-5 text-amber-600" /> National Football Team
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Team facts */}
                  <div className="space-y-4 md:col-span-1">
                    <div className="bg-white rounded-3xl border-3 border-slate-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-amber-100/50 to-white">
                      <span className="block font-sans font-extrabold text-xs text-amber-700 leading-none mb-1">THE SQUAD</span>
                      <h4 className="font-display font-black text-lg text-slate-800 leading-tight">
                        {activeCountry.football.nationalTeam}
                      </h4>
                      <p className="text-xs text-slate-500 font-sans mt-2">
                        🏅 <strong>Achievements:</strong> {activeCountry.football.achievements.join(', ')}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-300 p-3">
                      <span className="block text-[9px] font-mono font-bold text-slate-400">FAMOUS HEROES</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {activeCountry.football.famousPlayers.map((p, idx) => (
                          <span
                            key={idx}
                            className="tag text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200"
                          >
                            ⚽ {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* World Cup history */}
                  <div className="bg-white p-4 rounded-3xl border-3 border-slate-900 md:col-span-1 flex flex-col justify-between">
                    <div>
                      <span className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1">WORLD CUP STORY</span>
                      <p className="text-xs sm:text-sm font-sans text-slate-600 leading-relaxed italic">
                        "{activeCountry.football.wcHistory}"
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-display font-extrabold text-amber-700 bg-amber-100 self-start px-2 py-0.5 rounded border border-amber-300 mt-4">
                      ⭐ Football History Expert
                    </span>
                  </div>

                  {/* FIFA Card Skills stats (Visual Bar Chart) */}
                  <div className="bg-gradient-to-b from-[#111] to-[#222] text-white p-5 rounded-3xl border-4 border-yellow-400 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-mono text-[9px] text-yellow-400 font-black tracking-widest uppercase">
                          MATCH POWER INDEX
                        </span>
                        <span className="text-lg">⚡</span>
                      </div>
                      
                      <div className="space-y-2">
                        {/* Pace */}
                        <div>
                          <div className="flex justify-between text-[11px] font-mono leading-none mb-1">
                            <span>🏃 SPEED</span>
                            <span className="font-bold text-yellow-400">{activeCountry.football.stats.pace}</span>
                          </div>
                          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${activeCountry.football.stats.pace}%` }} />
                          </div>
                        </div>

                        {/* Shoot */}
                        <div>
                          <div className="flex justify-between text-[11px] font-mono leading-none mb-1">
                            <span>🎯 SHOOTING</span>
                            <span className="font-bold text-yellow-400">{activeCountry.football.stats.shoot}</span>
                          </div>
                          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${activeCountry.football.stats.shoot}%` }} />
                          </div>
                        </div>

                        {/* Passing */}
                        <div>
                          <div className="flex justify-between text-[11px] font-mono leading-none mb-1">
                            <span>⚽ PASSING</span>
                            <span className="font-bold text-yellow-400">{activeCountry.football.stats.pass}</span>
                          </div>
                          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${activeCountry.football.stats.pass}%` }} />
                          </div>
                        </div>

                        {/* Dribbling */}
                        <div>
                          <div className="flex justify-between text-[11px] font-mono leading-none mb-1">
                            <span>🌪️ DRIBBLING</span>
                            <span className="font-bold text-yellow-400">{activeCountry.football.stats.dribble}</span>
                          </div>
                          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${activeCountry.football.stats.dribble}%` }} />
                          </div>
                        </div>

                        {/* Defense */}
                        <div>
                          <div className="flex justify-between text-[11px] font-mono leading-none mb-1">
                            <span>🛡️ DEFENSE</span>
                            <span className="font-bold text-yellow-400">{activeCountry.football.stats.defense}</span>
                          </div>
                          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${activeCountry.football.stats.defense}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-center text-slate-400 mt-4 border-t border-slate-700 pt-2 font-bold">
                      COACH POWER: {Math.round((activeCountry.football.stats.pace + activeCountry.football.stats.shoot + activeCountry.football.stats.pass + activeCountry.football.stats.dribble + activeCountry.football.stats.defense) / 5)} OVR
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
