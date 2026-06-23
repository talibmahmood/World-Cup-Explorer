/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Dashboard } from './components/Dashboard';
import { CountryExplorer } from './components/CountryExplorer';
import { GroupsFixtures } from './components/GroupsFixtures';
import { Passport } from './components/Passport';
import { QuizArena } from './components/QuizArena';
import { AchievementsShelf } from './components/AchievementsShelf';
import { ProfileSelector } from './components/ProfileSelector';
import { sfx } from './lib/audio';
import { Trophy, HelpCircle, RefreshCw, Layers, Compass, BookOpen, Award, Sparkles, MapPin, ExternalLink, Settings } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explore' | 'groups' | 'quiz' | 'passport' | 'achievements'>('dashboard');
  const [showParentZone, setShowParentZone] = useState(false);
  const { currentUser, resetAll } = useGame();

  const handleNavigate = (tab: 'dashboard' | 'explore' | 'groups' | 'quiz' | 'passport' | 'achievements' | any) => {
    setActiveTab(tab);
    sfx.playCoin();
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 font-sans flex flex-col justify-between pb-8">
      
      {/* Visual Header Deck */}
      <header className="bg-white border-b-4 border-sky-100 sticky top-0 z-40 px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Name & Icon from Sleek Theme */}
          <button
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center gap-3 text-left cursor-pointer select-none group"
          >
            <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-200">
              <span className="text-white font-black text-2xl">W</span>
            </div>
            <div>
              <h1 className="font-display font-black text-xl text-indigo-900 tracking-tight leading-none">
                WORLD CUP <span className="text-sky-500">EXPLORER</span>
              </h1>
              <span className="block font-mono text-[9px] font-bold text-emerald-600 tracking-wider mt-0.5">
                KIDS LEARN & PLAY HUB
              </span>
            </div>
          </button>

          {/* Navigation deck for standard resolutions */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Layers },
              { id: 'explore', label: 'Explore Countries', icon: Compass },
              { id: 'groups', label: 'Groups & Fixtures', icon: Trophy },
              { id: 'quiz', label: 'Quiz Arena', icon: Award },
              { id: 'passport', label: 'Digital Passport', icon: BookOpen },
              { id: 'achievements', label: 'Medal Shelf', icon: Sparkles }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigate(tab.id)}
                  className={`relative inline-flex items-center gap-1.5 px-4 py-2 font-display font-bold text-xs select-none transition-all duration-150 cursor-pointer rounded-xl ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Player Switcher profile pill dropdown */}
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="hidden md:flex items-center gap-3 bg-indigo-50 px-4 py-1.5 rounded-full border-2 border-indigo-100">
                <div className="text-right">
                  <p className="text-[9px] font-extrabold text-indigo-400 leading-none uppercase">{currentUser.name}'s account</p>
                  <p className="text-base font-black text-indigo-900 leading-none mt-1">{currentUser.score} pts</p>
                </div>
                <div className="w-9 h-9 bg-indigo-200 rounded-full border-2 border-white overflow-hidden shadow-inner flex items-center justify-center">
                  <span className="text-lg">{currentUser.avatar}</span>
                </div>
              </div>
            )}
            <ProfileSelector />
          </div>
        </div>

        {/* Floating Mobile/Tablet Navigation deck (visible on smaller screens) */}
        <div className="lg:hidden max-w-7xl mx-auto flex gap-1.5 overflow-x-auto pt-3 border-t border-slate-100 mt-2.5">
          {[
            { id: 'dashboard', label: 'Home' },
            { id: 'explore', label: 'Explore' },
            { id: 'groups', label: 'Groups' },
            { id: 'quiz', label: 'Quiz' },
            { id: 'passport', label: 'Passport' },
            { id: 'achievements', label: 'Medals' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleNavigate(tab.id)}
              className={`text-xs px-3.5 py-2 font-display font-bold rounded-xl transition shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-650 text-white shadow'
                  : 'bg-white text-slate-550 border border-slate-150 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Render Tab Sub-modules */}
        {activeTab === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
        {activeTab === 'explore' && <CountryExplorer />}
        {activeTab === 'groups' && <GroupsFixtures />}
        {activeTab === 'quiz' && <QuizArena />}
        {activeTab === 'passport' && <Passport />}
        {activeTab === 'achievements' && <AchievementsShelf />}

      </main>

      {/* Parent Zone Accordion & Footer Section */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-12 space-y-6">
        
        {/* Parent & Educator Zone Card */}
        <div className="kids-card bg-slate-900 border-slate-900 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
          <button
            onClick={() => {
              setShowParentZone(!showParentZone);
              sfx.playCoin();
            }}
            className="w-full flex items-center justify-between text-left select-none cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              <div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-yellow-300">
                  Parent or Educator Configuration Zone
                </h3>
                <p className="text-xs text-slate-450 font-sans">
                  Tap to unfold step-by-step guides for free hosting, database saves, and platform customizer instructions.
                </p>
              </div>
            </div>
            <span className="font-display font-black text-xl text-yellow-300">
              {showParentZone ? '▲ HIDE' : '▼ VIEW SETUP'}
            </span>
          </button>

          {showParentZone && (
            <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-800 space-y-6 animate-fadeIn text-sm text-slate-300 leading-relaxed font-sans">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Deployment section */}
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="font-display font-black text-base text-yellow-400 flex items-center gap-1.5 leading-none">
                    <ExternalLink className="w-4 h-4 text-emerald-400" /> Option A: Free GitHub Pages Deployment
                  </h4>
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs">
                    <li>Create a free account on <a href="https://github.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-bold">GitHub</a>.</li>
                    <li>Create a new repository called <code>world-cup-explorer</code>.</li>
                    <li>Initialize repository, drag and upload your build files from your directory. Since it is a completely static SPA bundle, you can upload all code easily!</li>
                    <li>Go to repository <strong>Settings ➔ Pages</strong>, set source branch to <code>main</code> (or root), and click <strong>Save</strong>!</li>
                    <li>Your secure live game address (e.g. <code>https://yourusername.github.io/world-cup-explorer</code>) generates instantly! Compatible with all kids' tablets, iPads, and mobile phones!</li>
                  </ol>

                  <h4 className="font-display font-black text-base text-yellow-400 flex items-center gap-1.5 leading-none pt-2 border-t border-slate-800 mt-2">
                    <MapPin className="w-4 h-4 text-rose-400" /> Option B: Google Drive / Local Sharing
                  </h4>
                  <p className="text-xs">
                    Google Drive acts as a file hoster but does <strong>not</strong> support direct HTML dynamic app execution out-of-the-box due to sandboxing policies. It is better to use GitHub Pages, Vercel, or Netlify, which are entirely free, safer, and load in under 2 seconds!
                  </p>
                </div>

                {/* Databases section */}
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="font-display font-black text-base text-yellow-400 flex items-center gap-1.5 leading-none">
                    <Settings className="w-4 h-4 text-sky-400" /> Data Saving & Cloud Integration
                  </h4>
                  <p className="text-xs text-slate-400">
                    The game currently runs a <strong>perfect dual-saving system</strong>. Profiles and scores are safely backed up in the browser's <code>localStorage</code>. To expand to a multi-device setup using Firebase Firestore:
                  </p>
                  
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>Run <code>set_up_firebase</code> inside our environment to provision authentication and enterprise NoSQL.</li>
                    <li>Create collections: <code>users</code> (tracks scores, avatars, and medals) and <code>stamps</code> (tracks passport validation timestamps).</li>
                    <li>Hook up the Firebase SDK code by loading <code>firebase-applet-config.json</code> as documented in <code>/skills/system_skills/firebase-skill/SKILL.md</code>!</li>
                  </ul>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to reset all profiles, scores, and stamps back to starting demo data? This cannot be undone!")) {
                          resetAll();
                          handleNavigate('dashboard');
                        }
                      }}
                      className="kids-btn-sm bg-rose-500 hover:bg-rose-450 border-rose-600 text-white font-mono font-bold uppercase text-[10px] w-full justify-center"
                    >
                      ⚠️ Wipe/Reset Developer Demo profiles
                    </button>
                  </div>
                </div>

              </div>

              {/* Maintenance parameters */}
              <div className="text-center text-xs text-slate-550 pt-2 border-t border-slate-850">
                🚀 Designed for educational expansion. Future learning modules (e.g. Earth Landmarks, Oceans, Animals) can be added simply by adding a new view mapping and duplicating the country data schema!
              </div>

            </div>
          )}
        </div>

        {/* Small footer credits */}
        <div className="text-slate-400 font-sans text-xs text-center">
          <div>World Cup Explorer learning game • Built with React and Tailwind CSS</div>
          <div className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[9px] text-slate-400">
            <span>⚽ SOCCER ACADEMY</span> • <span>🌍 SUSTAINED STATIC HOSTED</span> • <span>❤ INSPIRED LEARNING</span>
          </div>
        </div>

      </footer>

    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

