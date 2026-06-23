/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sfx } from '../lib/audio';

const MASCOT_QA = [
  {
    q: 'What is the "Offside Rule"? ⚽',
    a: 'Imagine you are playing tag, but you are hiding behind the person before the game even starts! In soccer, you cannot stand behind the last defender of the opposing team waiting to kick the ball. You must stay in line with them until your friend kicks the ball to you. That makes it fair and super active!'
  },
  {
    q: 'Why does the World Cup happen only every 4 years? 🏆',
    a: 'Because it is a MASSIVE worldly festival! More than 200 countries play games for three years to qualify. It takes lots of planning, building stadium parks, and training to see who is the ultimate world champion. It makes it extra special when it finally arrives, like a super rare leap-year birthday!'
  },
  {
    q: 'How do I earn stamps in my Passport? 🗺️',
    a: 'It is super easy! Go to the "Explore Countries" page, click on any country flag (like Brazil 🇧🇷 or Japan 🇯🇵), and read their cool facts. Once you reach the bottom, press the big gold "STAMP MY PASSPORT" button! Goldie will blow a whistle, and you will get a shiny colored seal in your digital passport!'
  },
  {
    q: 'What is a "Hat-trick" in football? 🎩',
    a: 'A hat-trick is when one single player scores three goals in a single game! It is incredibly hard to do! Back in the old days, when a player did this, they were presented with a lovely velvet top-hat by their club to celebrate. So now we say they did a Hat-trick!'
  },
  {
    q: 'Why do players shake hands and trade shirts? 🤝',
    a: 'Because of "Fair Play" and Teranga (friendship)! Even if teams compete hard on the grass, they are all fellow football globetrotters. Trading jerseys at the whistle says: "You played an awesome game, and we are friends in sports!"'
  }
];

const MASCOT_JOKES = [
  "Why did the soccer ball go to the nurse? Because it kept getting kicked! Haha! ⚽",
  "Why is a soccer field the coolest place to sit? Because it is surrounded by fans! Get it? 🎐",
  "What do soccer players do when they get old? They become 'old timers' and go for the golden boot! 🥾"
];

export const MascotGuide: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'goldie' | 'user'; text: string }>>([
    { sender: 'goldie', text: 'G’day mate! I’m Goldie the Goal-Gator! 🐊 I have traveled all over the continents to gather cool facts, fun rules, and hilarious sports jokes. Ask me anything about the World Cup!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleAskPredefined = (question: string, answer: string) => {
    sfx.playCoin();
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'goldie', text: answer }
    ]);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sfx.playCoin();
    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Goldie thinking and generating a playful responder
    setTimeout(() => {
      let reply = '';
      const lowercaseMsg = userMsg.toLowerCase();

      if (lowercaseMsg.includes('joke')) {
        reply = "Here’s a swamp-sizzling joke for you! " + MASCOT_JOKES[Math.floor(Math.random() * MASCOT_JOKES.length)];
      } else if (lowercaseMsg.includes('messi') || lowercaseMsg.includes('argentina')) {
        reply = "Lionel Messi is a true football wizard from Argentina! 🇦🇷 He wears jersey number 10, does super-fast dribbles, and led his team to lift the beautiful gold trophy in 2022! Have you checked Argentina's card?";
      } else if (lowercaseMsg.includes('brazil') || lowercaseMsg.includes('pele')) {
        reply = "Brazil is the land of golden sunshine and Samba soccer! 🇧🇷 Pelé won 3 World Cup trophies before he was 30 years old! They have won 5 cups in total. Super alligator bite awesome!";
      } else if (lowercaseMsg.includes('best') || lowercaseMsg.includes('winner')) {
        reply = "The best player is the one who tries their hardest and plays with their friends! But Brazil has won the most World Cups (5 times), and Argentina has the current golden star Messi! 🏆";
      } else if (lowercaseMsg.includes('food') || lowercaseMsg.includes('eat')) {
        reply = "Oh, my alligator tummy is rumbling! I love Brazilian Pão de Queijo cheese bread and French sweet Crêpes! 🥞 Make sure you click different countries to view their famous recipes!";
      } else {
        reply = `That is a swamp-tastic question! 🐊 In soccer and geography, there is always something new to learn! To explore country specifics, jump onto the 'Explore Countries' tab and get passport stamps! Go, team, go! ⚽`;
      }

      setMessages((prev) => [...prev, { sender: 'goldie', text: reply }]);
      setIsTyping(false);
      sfx.playSuccess();
    }, 1200);
  };

  return (
    <div className="kids-card bg-amber-50 border-amber-600 flex flex-col md:flex-row gap-6">
      {/* Visual Mascot representation */}
      <div className="flex flex-col items-center text-center md:w-1/3">
        <div className="relative">
          {/* Animated Goldie Avatar */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }}
            className="w-32 h-32 bg-amber-400 border-4 border-slate-900 rounded-full flex items-center justify-center text-6xl shadow-[4px_4px_0px_0px_#0f172a] overflow-hidden"
          >
            🐊
          </motion.div>
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 border-2 border-slate-900 rounded-full p-1.5 text-lg">
            👑
          </div>
        </div>
        
        <h3 className="font-display font-extrabold text-xl text-slate-800 mt-4 flex items-center gap-1.5">
          Goldie the Goal-Gator
        </h3>
        <p className="font-mono text-xs font-semibold text-amber-700 bg-amber-200/50 px-3 py-1 rounded-full mt-1 border border-amber-300">
          Official Mascot Guide
        </p>
        
        <div className="text-slate-600 text-xs mt-3 leading-relaxed">
          "I help you learn sweet trivia, understand soccer math rules, and find golden passport seals!"
        </div>

        {/* Quick Quiz / Jokes */}
        <button
          onClick={() => {
            const joke = "Here’s a swamp-sizzling joke for you! " + MASCOT_JOKES[Math.floor(Math.random() * MASCOT_JOKES.length)];
            setMessages((prev) => [
              ...prev,
              { sender: 'user', text: "Tell me a joke, Goldie! 🐊" },
              { sender: 'goldie', text: joke }
            ]);
            sfx.playSuccess();
          }}
          className="kids-btn-sm bg-yellow-400 hover:bg-yellow-300 text-slate-900 mt-4 w-full justify-center"
        >
          🎈 Tell Me a Joke!
        </button>
      </div>

      {/* Interactive Chat Board */}
      <div className="flex-1 flex flex-col min-h-[350px]">
        {/* Chats display */}
        <div className="flex-1 h-64 overflow-y-auto border-3 border-slate-900 bg-white rounded-2xl p-4 gap-3 flex flex-col">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[85%] ${
                m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 mb-0.5 px-1">
                {m.sender === 'user' ? 'You' : 'Goldie 🐊'}
              </span>
              <div
                className={`rounded-2xl border-2 border-slate-900 p-3 text-sm font-sans leading-relaxed shadow-[2px_2px_0px_0px_#0f172a] ${
                  m.sender === 'user'
                    ? 'bg-indigo-100 text-slate-800 rounded-tr-none'
                    : 'bg-amber-100 text-slate-800 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="self-start flex flex-col items-start">
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 mb-0.5 px-1">
                Goldie is thinking...
              </span>
              <div className="bg-amber-100 text-slate-800 rounded-2xl border-2 border-slate-900 p-3 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick Click Help Bubbles */}
        <div className="mt-3">
          <div className="text-xs font-display font-medium text-amber-800 flex items-center gap-1 mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Tap a smart question to ask Goldie:
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {MASCOT_QA.map((qa, index) => (
              <button
                key={index}
                onClick={() => handleAskPredefined(qa.q, qa.a)}
                className="text-xs font-sans border-2 border-slate-300 hover:border-slate-900 font-semibold bg-white hover:bg-amber-100 text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition cursor-pointer select-none"
              >
                {qa.q}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-4 pt-3 border-t-2 border-dashed border-slate-200">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a football / geography question... (e.g., tell me a Messi joke!)"
            className="flex-1 rounded-xl border-3 border-slate-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
          />
          <button
            type="submit"
            className="kids-btn-sm bg-amber-400 text-slate-900 hover:bg-yellow-400 px-4"
            disabled={isTyping}
            title="Ask Goldie Mascot"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
