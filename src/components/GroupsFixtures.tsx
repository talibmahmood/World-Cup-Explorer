/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { INITIAL_GROUPS, MATCHES_DATA } from '../data/fixtures';
import { COUNTRIES_DATA } from '../data/countries';
import { Trophy, Calendar, Sparkles, Filter, ChevronRight, BarChart3 } from 'lucide-react';
import { sfx } from '../lib/audio';

export const GroupsFixtures: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<'all' | 'A' | 'B'>('all');
  const [fixturesFilter, setFixturesFilter] = useState<'all' | 'completed' | 'scheduled'>('all');

  const getTeamDetails = (code: string) => {
    return COUNTRIES_DATA.find(c => c.id === code) || { name: code, flag: '🏳️' };
  };

  const filteredMatches = MATCHES_DATA.filter(m => {
    const groupMatches = activeGroup === 'all' || m.group === activeGroup;
    const statusMatches = fixturesFilter === 'all' || m.status === fixturesFilter;
    return groupMatches && statusMatches;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Visual Header */}
      <div className="kids-card bg-emerald-50 border-slate-900">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="font-display font-black text-3xl text-slate-800 flex items-center gap-1.5 leading-none">
              <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-500/20" /> Tournament Tables & Fixtures
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-500 mt-2">
              See how your favorite teams rank in Group A & B! Discover completed match scores and scheduled games.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveGroup(activeGroup === 'all' ? 'A' : activeGroup === 'A' ? 'B' : 'all');
                sfx.playCoin();
              }}
              className="kids-btn-sm bg-yellow-400 hover:bg-yellow-350 text-slate-900 text-xs"
            >
              <Filter className="w-3.5 h-3.5" /> Filter Group: {activeGroup.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {INITIAL_GROUPS.map((grp) => {
          // Check if we should omit this group
          if (activeGroup !== 'all' && grp.name !== `Group ${activeGroup}`) return null;

          return (
            <div key={grp.name} className="kids-card bg-white border-slate-900">
              <div className="flex justify-between items-center mb-4 border-b-2 border-dashed border-slate-150 pb-2">
                <h3 className="font-display font-extrabold text-xl text-slate-850 flex items-center gap-1.5">
                  🛡️ {grp.name}
                </h3>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-widest bg-slate-100 px-2.5 py-0.5 rounded-full">
                  OFFICIAL STANDINGS
                </span>
              </div>

              {/* Standings Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[400px]">
                  <thead>
                    <tr className="border-b-2 border-slate-900 text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                      <th className="py-2 pl-1">TEAM</th>
                      <th className="py-2 text-center">PLAYED</th>
                      <th className="py-2 text-center">WON</th>
                      <th className="py-2 text-center">DRAWN</th>
                      <th className="py-2 text-center">LOST</th>
                      <th className="py-2 text-center">GOAL DIF</th>
                      <th className="py-2 pr-1 text-right text-emerald-600 font-black">POINTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans text-xs">
                    {grp.standings.map((stand, idx) => {
                      const team = getTeamDetails(stand.teamCode);
                      const goalDiff = stand.goalsFor - stand.goalsAgainst;

                      return (
                        <tr key={stand.teamCode} className="hover:bg-slate-50 transition">
                          <td className="py-3 pl-1 flex items-center gap-2 font-display font-bold text-slate-800 text-sm">
                            <span className="font-mono text-xs text-slate-400 w-4 block text-center font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-xl leading-none">{team.flag}</span>
                            <span>{team.name}</span>
                          </td>
                          <td className="py-3 text-center font-mono font-semibold text-slate-600">{stand.played}</td>
                          <td className="py-3 text-center font-mono font-semibold text-slate-600">{stand.won}</td>
                          <td className="py-3 text-center font-mono font-semibold text-slate-600">{stand.drawn}</td>
                          <td className="py-3 text-center font-mono font-semibold text-slate-600">{stand.lost}</td>
                          <td className="py-3 text-center font-mono font-semibold text-slate-600">
                            {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
                          </td>
                          <td className="py-3 pr-1 text-right font-mono font-black text-sm text-emerald-600">
                            {stand.points} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Match Fixtures List Section */}
      <div className="kids-card bg-slate-50 border-slate-900">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 border-b-2 border-dashed border-slate-200 pb-4">
          <h3 className="font-display font-black text-2xl text-slate-850 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-500 animate-bounce-gentle" /> Match Schedule & Live Scoreboards
          </h3>

          {/* Filter Status controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setFixturesFilter('all'); sfx.playCoin(); }}
              className={`kids-btn-sm text-xs ${fixturesFilter === 'all' ? 'bg-indigo-400 text-slate-950 font-bold' : 'bg-white hover:bg-slate-50 text-slate-600'}`}
            >
              All Matches
            </button>
            <button
              onClick={() => { setFixturesFilter('completed'); sfx.playCoin(); }}
              className={`kids-btn-sm text-xs ${fixturesFilter === 'completed' ? 'bg-indigo-400 text-slate-950 font-bold' : 'bg-white hover:bg-slate-50 text-slate-600'}`}
            >
              Completed Results
            </button>
            <button
              onClick={() => { setFixturesFilter('scheduled'); sfx.playCoin(); }}
              className={`kids-btn-sm text-xs ${fixturesFilter === 'scheduled' ? 'bg-indigo-400 text-slate-950 font-bold' : 'bg-white hover:bg-slate-50 text-slate-600'}`}
            >
              Scheduled Games
            </button>
          </div>
        </div>

        {/* Fixtures Layout Cards */}
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMatches.map(m => {
              const home = getTeamDetails(m.homeTeamCode);
              const away = getTeamDetails(m.awayTeamCode);
              const isComp = m.status === 'completed';

              return (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border-3 border-slate-900 p-4 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0f172a] transition flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full">
                      GROUP {m.group}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-bold">
                      📅 {m.date} • {m.time}
                    </span>
                  </div>

                  <div className="flex justify-around items-center py-2.5">
                    {/* Home Team */}
                    <div className="flex flex-col items-center justify-center gap-1 w-24 text-center">
                      <span className="text-4xl leading-none">{home.flag}</span>
                      <span className="font-display font-extrabold text-[#003049] text-xs sm:text-sm truncate w-full">
                        {home.name}
                      </span>
                    </div>

                    {/* Result Score block */}
                    <div className="flex items-center justify-center gap-2.5">
                      {isComp ? (
                        <div className="flex items-center gap-2 bg-slate-900 text-yellow-400 font-mono font-black text-xl px-4 py-2 rounded-2xl border-2 border-slate-850 shadow-inner">
                          <span>{m.homeScore}</span>
                          <span className="text-slate-500 font-sans text-xs font-normal">FT</span>
                          <span>{m.awayScore}</span>
                        </div>
                      ) : (
                        <div className="font-display font-bold text-slate-400 text-xs sm:text-sm bg-slate-100 border-2 border-slate-200 px-4 py-2 rounded-2xl">
                          VS
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center justify-center gap-1 w-24 text-center">
                      <span className="text-4xl leading-none">{away.flag}</span>
                      <span className="font-display font-extrabold text-[#003049] text-xs sm:text-sm truncate w-full">
                        {away.name}
                      </span>
                    </div>
                  </div>

                  <div className="border-t-2 border-dashed border-slate-50 pt-2 flex items-center justify-between text-[11px] font-sans font-semibold text-slate-500 bg-slate-50/50 p-2 rounded-xl mt-2">
                    <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#b7094c]">
                      🏁 {isComp ? 'Final whistle' : 'Kickoff scheduled'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-slate-400 font-sans text-xs italic text-center py-10 bg-white border-2 border-slate-200 rounded-2xl">
            No fixtures found matching current criteria! Try choosing "All Matches" above.
          </div>
        )}
      </div>

      {/* Parental/Maintainer update prompt block */}
      <div className="kids-card bg-indigo-50 border-indigo-400 flex flex-col sm:flex-row gap-4 justify-between items-center p-4">
        <div className="flex gap-2.5 items-start">
          <span className="text-2xl">🔧</span>
          <div>
            <h4 className="font-display font-extrabold text-sm text-slate-800">
              Parent & Maintainer Guide: Adding Data
            </h4>
            <p className="font-sans text-xs text-slate-500 leading-relaxed max-w-xl">
              Want to update the World Cup database with real-time match outcomes later? Simply open the <code>/src/data/fixtures.ts</code> file and append your team match score matrices into the <code>MATCHES_DATA</code> JSON collection!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            alert(
              "HOW TO ADD A NEW COUNTRY Later:\n\n" +
              "1. Open '/src/data/countries.ts' file.\n" +
              "2. Copy any existing Country element block.\n" +
              "3. Append your new country with its customized land flag, capital, food, interesting kid-facts, and football skills score matrix!\n" +
              "4. Save. The system compiles and automatically lists the new country anywhere (Explore tab, maps, quizzes) instantly!"
            );
            sfx.playSuccess();
          }}
          className="kids-btn-sm bg-indigo-400 hover:bg-slate-900 hover:text-white border-slate-900 transition text-[11px]"
        >
          📖 View New Country manual
        </button>
      </div>
    </div>
  );
};
