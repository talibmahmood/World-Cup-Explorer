/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { User, Plus, Trash2, Check, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AVATARS = [
  { char: '🦁', role: 'Lion Striker' },
  { char: '🐼', role: 'Panda Keeper' },
  { char: '🦊', role: 'Fox Skipper' },
  { char: '🐬', role: 'Dolphin Winger' },
  { char: '🐰', role: 'Rabbit Midfielder' },
  { char: '🐨', role: 'Koala Referee' },
  { char: '🦉', role: 'Owl Coach' }
];

const COLORS = [
  { name: 'emerald', bg: 'bg-emerald-400', border: 'border-emerald-600', text: 'text-emerald-800' },
  { name: 'sky', bg: 'bg-sky-400', border: 'border-sky-600', text: 'text-sky-800' },
  { name: 'amber', bg: 'bg-amber-400', border: 'border-amber-600', text: 'text-amber-800' },
  { name: 'rose', bg: 'bg-rose-400', border: 'border-rose-600', text: 'text-rose-800' },
  { name: 'purple', bg: 'bg-purple-400', border: 'border-purple-600', text: 'text-purple-800' }
];

export const ProfileSelector: React.FC = () => {
  const { users, currentUser, selectUser, createUser, deleteUser } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [selectedColor, setSelectedColor] = useState('emerald');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createUser(name, selectedAvatar, selectedColor);
    setName('');
    setShowAddForm(false);
  };

  return (
    <div className="relative">
      {/* Current User Pill */}
      <button
        id="btn-profile-dropdown"
        onClick={() => setIsOpen(!isOpen)}
        className={`kids-btn-sm gap-2 text-slate-900 bg-white hover:bg-slate-50`}
      >
        <span className="text-xl">{currentUser ? currentUser.avatar : '👤'}</span>
        <span className="font-display font-bold hidden sm:inline">
          {currentUser ? currentUser.name : 'Choose Player'}
        </span>
        <span className="font-mono text-xs bg-slate-900 text-white px-2 py-0.5 rounded-full">
          {currentUser ? `${currentUser.score} pts` : '0'}
        </span>
      </button>

      {/* Dropdown Layout */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close list */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute right-0 mt-3 w-80 bg-white border-4 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_#0f172a] p-4 z-50 max-h-[480px] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-3 mb-3 border-b-2 border-dashed border-slate-200">
                <span className="font-display font-extrabold text-lg text-slate-800 flex items-center gap-1.5">
                  <UserCircle2 className="w-5 h-5 text-indigo-500" /> Player Switcher
                </span>
                
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="kids-btn-sm bg-indigo-400 text-slate-900 hover:bg-indigo-300"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                )}
              </div>

              {showAddForm ? (
                <form onSubmit={handleCreate} className="space-y-3">
                  <div>
                    <label className="block text-xs font-display font-bold text-slate-500 mb-1">
                      CHAMPION NAME
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Leo Junior"
                      className="w-full rounded-xl border-3 border-slate-900 px-3 py-2 font-display text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-display font-bold text-slate-500 mb-1">
                      CHOOSE FOOTBALL AVATAR
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {AVATARS.map((av) => (
                        <button
                          key={av.char}
                          type="button"
                          title={av.role}
                          onClick={() => setSelectedAvatar(av.char)}
                          className={`p-2 text-2xl rounded-xl border-2 transition ${
                            selectedAvatar === av.char
                              ? 'border-indigo-600 bg-indigo-50 scale-105'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {av.char}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-display font-bold text-slate-500 mb-1">
                      CHOOSE TEAM SHIRT COLOR
                    </label>
                    <div className="flex gap-2">
                      {COLORS.map((col) => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setSelectedColor(col.name)}
                          className={`w-6 h-6 rounded-full border-2 ${col.bg} ${
                            selectedColor === col.name ? 'ring-4 ring-indigo-400 border-indigo-600' : 'border-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="kids-btn-sm bg-emerald-400 text-slate-900 flex-1 hover:bg-emerald-300"
                    >
                      Create Game Profile!
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="kids-btn-sm bg-slate-200 text-slate-700 flex-1 hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  {users.map((profile) => {
                    const profileColor = COLORS.find(c => c.name === profile.color) || COLORS[0];
                    const isSelected = currentUser?.id === profile.id;
                    return (
                      <div
                        key={profile.id}
                        className={`flex items-center justify-between p-2 rounded-2xl border-3 transition-colors ${
                          isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-900 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <button
                          onClick={() => {
                            selectUser(profile.id);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 flex-1 text-left select-none cursor-pointer"
                        >
                          <span className={`text-3xl p-1.5 rounded-xl border-2 border-slate-900 ${profileColor.bg}`}>
                            {profile.avatar}
                          </span>
                          <div>
                            <div className="font-display font-bold text-slate-900 flex items-center gap-1.5">
                              {profile.name}
                              {isSelected && <Check className="w-4 h-4 text-indigo-600 inline" />}
                            </div>
                            <div className="font-mono text-xs text-slate-500">
                              ⚽ {profile.score} pts • {profile.exploredCountries.length}/10 countries
                            </div>
                          </div>
                        </button>

                        {/* Prevent deleting if it is the only user */}
                        {users.length > 1 && (
                          <button
                            onClick={() => deleteUser(profile.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                            title="Delete Player Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
