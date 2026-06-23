/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { QuizQuestion, QuizCategory, Difficulty } from '../types';
import { Award, Trophy, Play, Users, RefreshCw, Star, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { sfx } from '../lib/audio';

export const QuizArena: React.FC = () => {
  const { currentUser, users, submitQuizResult } = useGame();
  
  // Game Setup States
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'solo' | 'competition'>('solo');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);

  // Solo Mode States
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]); // index of user answers
  const [hasAnswered, setHasAnswered] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Competition Mode States (Turn based, Penalty Shootout)
  const [player1Id, setPlayer1Id] = useState<string>('');
  const [player2Id, setPlayer2Id] = useState<string>('');
  const [compTurn, setCompTurn] = useState<1 | 2>(1); // Player 1 or 2 turn
  const [p1Goals, setP1Goals] = useState<('⚽' | '❌')[]>([]); // Shootout indicators
  const [p2Goals, setP2Goals] = useState<('⚽' | '❌')[]>([]);
  const [compRound, setCompRound] = useState(1); // Round 1, 2, 3
  const [compCurrentQuestion, setCompCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [compWinner, setCompWinner] = useState<string | null>(null); // name of winner

  // Bootstrap dual players of competition
  React.useEffect(() => {
    if (users.length >= 2) {
      setPlayer1Id(users[0].id);
      setPlayer2Id(users[1].id);
    } else if (users.length > 0) {
      setPlayer1Id(users[0].id);
      setPlayer2Id(users[0].id);
    }
  }, [users]);

  // Launch Solo Quiz Session
  const startSoloQuiz = () => {
    let pool = QUIZ_QUESTIONS;
    
    // Filter Category
    if (selectedCategory !== 'all') {
      pool = pool.filter(q => q.category === selectedCategory);
    }
    // Filter Difficulty
    pool = pool.filter(q => q.difficulty === selectedDifficulty);

    // If pool is empty (due to combination limits), pick random from difficulty
    if (pool.length === 0) {
      pool = QUIZ_QUESTIONS.filter(q => q.difficulty === selectedDifficulty);
    }

    // Shuffle pool and take up to 3 questions
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    setActiveQuestions(shuffled);
    setCurrentIdx(0);
    setUserAnswers([]);
    setHasAnswered(false);
    setPointsEarned(0);
    setCorrectCount(0);
    setIsPlaying(true);
    sfx.playLevelUp();
  };

  const handleSoloOptionClick = (optionIndex: number) => {
    if (hasAnswered) return;

    const currentQuestion = activeQuestions[currentIdx];
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const updatedAnswers = [...userAnswers, optionIndex];
    setUserAnswers(updatedAnswers);
    setHasAnswered(true);

    if (isCorrect) {
      sfx.playSuccess();
      setCorrectCount(prev => prev + 1);
      
      // Compute score increment
      let multiplier = 20;
      if (selectedDifficulty === Difficulty.MEDIUM) multiplier = 35;
      if (selectedDifficulty === Difficulty.HARD) multiplier = 50;
      setPointsEarned(prev => prev + multiplier);
    } else {
      sfx.playFailure();
    }
  };

  const handleNextSolo = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setHasAnswered(false);
      sfx.playCoin();
    } else {
      // Completed, Submit results to GameContext
      submitQuizResult(correctCount, activeQuestions.length, selectedCategory, selectedDifficulty);
      setCurrentIdx(currentIdx + 1); // Triggers finished display card
    }
  };

  // Launch Competition Penalty Shootout Derby
  const startCompetition = () => {
    setP1Goals([]);
    setP2Goals([]);
    setCompRound(1);
    setCompTurn(1);
    setCompWinner(null);

    // Pick 6 random questions from the global pool (3 rounds * 2 players)
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 6);
    setActiveQuestions(shuffled);
    setCompCurrentQuestion(shuffled[0]);
    setIsPlaying(true);
    sfx.playLevelUp();
  };

  const handleCompAnswer = (optionIndex: number) => {
    if (!compCurrentQuestion) return;

    const isCorrect = optionIndex === compCurrentQuestion.correctIndex;
    const activePlayerId = compTurn === 1 ? player1Id : player2Id;
    const activePlayerName = users.find(u => u.id === activePlayerId)?.name || 'Player';

    // Update goal shootout log
    if (compTurn === 1) {
      setP1Goals(prev => [...prev, isCorrect ? '⚽' : '❌']);
    } else {
      setP2Goals(prev => [...prev, isCorrect ? '⚽' : '❌']);
    }

    if (isCorrect) {
      sfx.playSuccess();
      alert(`🎯 GOOOAL! ${activePlayerName} slips it past the goalie! Awesome match play!`);
      
      // Update points for that player!
      submitQuizResult(1, 1, 'football', 'easy');
    } else {
      sfx.playFailure();
      alert(`🧤 SAVED! The goalie leaps to catch it! Nice try, ${activePlayerName}!`);
    }

    // Toggle Turn or Advance Round
    if (compTurn === 1) {
      setCompTurn(2);
      // Next question
      const nextQuestionIdx = (compRound - 1) * 2 + 1;
      setCompCurrentQuestion(activeQuestions[nextQuestionIdx]);
    } else {
      // Both finished this round
      if (compRound < 3) {
        setCompRound(prev => prev + 1);
        setCompTurn(1);
        const nextQuestionIdx = compRound * 2;
        setCompCurrentQuestion(activeQuestions[nextQuestionIdx]);
      } else {
        // Shootout complete! Calculate Winner!
        const p1Score = p1Goals.filter(v => v === '⚽').length + (isCorrect ? 0 : 0); // temp adjust
        const p1FinalGoals = [...p1Goals];
        const p2FinalGoals = [...p2Goals, isCorrect ? '⚽' : '❌']; // because p2 just finished

        const p1Total = p1FinalGoals.filter(v => v === '⚽').length;
        const p2Total = p2FinalGoals.filter(v => v === '⚽').length;

        const p1Name = users.find(u => u.id === player1Id)?.name || 'Player 1';
        const p2Name = users.find(u => u.id === player2Id)?.name || 'Player 2';

        setTimeout(() => {
          if (p1Total > p2Total) {
            setCompWinner(p1Name);
          } else if (p2Total > p1Total) {
            setCompWinner(p2Name);
          } else {
            setCompWinner('Tie Match!');
          }
          sfx.playLevelUp();
        }, 300);
      }
    }
  };

  const p1Details = users.find(u => u.id === player1Id) || { name: 'Player 1', avatar: '🦁' };
  const p2Details = users.find(u => u.id === player2Id) || { name: 'Player 2', avatar: '🐼' };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Visual Arena Header info */}
      <div className="kids-card bg-indigo-50 border-slate-900">
        <h2 className="font-display font-black text-3xl text-slate-800 flex items-center gap-2 mb-2 leading-none">
          <Award className="w-8 h-8 text-indigo-500" /> World Cup Quiz Arena
        </h2>
        <p className="font-sans text-xs sm:text-sm text-slate-500">
          Crack geography trivia, name capitals, spot flags, and master World Cup history! Choose your game mode below:
        </p>
      </div>

      {!isPlaying ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mode A: Solo Training */}
          <div className="kids-card bg-white border-slate-900 flex flex-col justify-between p-6">
            <div>
              <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-dashed border-slate-100">
                <h3 className="font-display font-black text-xl text-slate-800 flex items-center gap-1.5">
                  ⭐ Solo Explorer Play
                </h3>
                <span className="text-[10px] font-mono leading-none font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 rounded-full py-1">
                  SINGLE PLAYER
                </span>
              </div>

              <p className="text-slate-600 text-sm font-sans leading-relaxed mb-6">
                Take on 3 rapid-fire trivia questions tailored to your favorite categories and points settings. Correct answers earn gold points!
              </p>

              {/* Solo configuration selectors */}
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-mono font-bold text-slate-400 mb-1.5">CHOOSE TRIVIA CATEGORY</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'all', name: 'Mixed Pack 🍿' },
                      { key: QuizCategory.FLAGS, name: 'Flags 🏳️' },
                      { key: QuizCategory.CAPITALS, name: 'Capitals 🏢' },
                      { key: QuizCategory.GEOGRAPHY, name: 'Geography 🌋' },
                      { key: QuizCategory.FOOTBALL, name: 'Football ⚽' }
                    ].map(cat => (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => { setSelectedCategory(cat.key as any); sfx.playCoin(); }}
                        className={`kids-btn-sm text-xs select-none ${selectedCategory === cat.key ? 'bg-indigo-400 text-slate-950 font-black' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-mono font-bold text-slate-400 mb-1.5">SET GAME DIFFICULTY</span>
                  <div className="flex gap-1.5">
                    {[
                      { key: Difficulty.EASY, name: 'Easy (20pts) 🟢' },
                      { key: Difficulty.MEDIUM, name: 'Medium (35pts) 🟡' },
                      { key: Difficulty.HARD, name: 'Hard (50pts) 🔴' }
                    ].map(diff => (
                      <button
                        key={diff.key}
                        type="button"
                        onClick={() => { setSelectedDifficulty(diff.key); sfx.playCoin(); }}
                        className={`kids-btn-sm text-xs flex-1 justify-center select-none ${selectedDifficulty === diff.key ? 'bg-yellow-400 text-slate-950 font-black' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        {diff.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={startSoloQuiz}
              className="kids-btn bg-indigo-400 hover:bg-indigo-300 text-slate-900 mt-8 justify-center"
            >
              <Play className="w-5 h-5 fill-slate-900" /> Start Solo Quiz Adventure!
            </button>
          </div>

          {/* Mode B: Sibling Penalty Shootout Derby */}
          <div className="kids-card bg-emerald-50/50 border-slate-950 flex flex-col justify-between p-6">
            <div>
              <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-dashed border-slate-200">
                <h3 className="font-display font-black text-xl text-slate-850 flex items-center gap-1.5">
                  🏟️ Sibling Penalty Shootout
                </h3>
                <span className="text-[10px] font-mono leading-none font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 rounded-full py-1">
                  2-PLAYER LOCAL DUEL
                </span>
              </div>

              <p className="text-slate-600 text-sm font-sans leading-relaxed mb-6">
                Sibling versus sibling shootout! Lionel and Sam take consecutive turn quiz kicks. Solve questions to boot the ball for a GOAL! Save stats, crown the victor!
              </p>

              {users.length >= 2 ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* Player 1 selector */}
                  <div className="p-3 bg-white rounded-2xl border-2 border-slate-900">
                    <label className="block text-[9px] font-mono font-bold text-slate-400 leading-none mb-1">PLAYER 1 KICKER</label>
                    <select
                      value={player1Id}
                      onChange={(e) => { setPlayer1Id(e.target.value); sfx.playCoin(); }}
                      className="w-full text-xs font-display font-bold text-slate-800 bg-transparent focus:outline-none"
                    >
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.avatar} {u.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Player 2 selector */}
                  <div className="p-3 bg-white rounded-2xl border-2 border-slate-900">
                    <label className="block text-[9px] font-mono font-bold text-slate-400 leading-none mb-1">PLAYER 2 KICKER</label>
                    <select
                      value={player2Id}
                      onChange={(e) => { setPlayer2Id(e.target.value); sfx.playCoin(); }}
                      className="w-full text-xs font-display font-bold text-slate-800 bg-transparent focus:outline-none"
                    >
                      {users.map(u => (
                        <option key={u.id} value={u.id} disabled={u.id === player1Id}>{u.avatar} {u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-250 p-4 rounded-2xl text-center text-xs text-slate-400 italic">
                  Cannot find 2 player accounts. Go to the Player Switcher dropdown at the top right, tap "Add", and create a sister or brother profile so you can play shootout dockets!
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setMode('competition');
                startCompetition();
              }}
              disabled={users.length < 2}
              className="kids-btn bg-emerald-400 hover:bg-emerald-300 text-slate-905 mt-8 justify-center disabled:opacity-40 select-none"
            >
              <Users className="w-5 h-5" /> Launch Penalty Derby Shootout!
            </button>
          </div>

        </div>
      ) : (
        /* ACTIVE GAMEPLAY SCREEN */
        <div>
          {mode === 'solo' ? (
            /* SOLO GAME SESSION FLOW */
            <div>
              {currentIdx < activeQuestions.length ? (
                /* Active Question slides */
                <div className="kids-card bg-white border-slate-990 p-8 space-y-6 max-w-2xl mx-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  {/* Status header */}
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 border-b-2 border-dashed border-slate-100 pb-3 mb-3">
                    <span>SOLO TRAINING • LEVEL: {selectedDifficulty.toUpperCase()}</span>
                    <span>SLIDE {currentIdx + 1} / 3</span>
                  </div>

                  {/* Question Title */}
                  <div className="space-y-2">
                    <span className="text-4xl">🤔</span>
                    <h3 className="font-display font-black text-2xl text-slate-800 leading-normal">
                      {activeQuestions[currentIdx].question}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeQuestions[currentIdx].options.map((opt, oIdx) => {
                      const isChosen = userAnswers[currentIdx] === oIdx;
                      const isCorrect = oIdx === activeQuestions[currentIdx].correctIndex;

                      let btnStyle = "border-slate-900 bg-white hover:bg-slate-50 text-slate-800";
                      if (hasAnswered) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-600 bg-emerald-100 text-emerald-800 font-bold";
                        } else if (isChosen) {
                          btnStyle = "border-rose-600 bg-rose-100 text-rose-800";
                        } else {
                          btnStyle = "border-slate-200 bg-white opacity-40";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={hasAnswered}
                          onClick={() => handleSoloOptionClick(oIdx)}
                          className={`rounded-2xl border-3 p-4 font-display font-bold text-base transition-all flex items-center gap-3 w-full text-left cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-7 h-7 rounded-lg border-2 border-slate-900 flex items-center justify-center font-mono font-bold bg-slate-100 text-xs text-slate-700">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation card */}
                  {hasAnswered && (
                    <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl animate-fadeIn space-y-2">
                      <div className="flex items-center gap-1.5 font-display font-black text-indigo-900 text-sm">
                        {userAnswers[currentIdx] === activeQuestions[currentIdx].correctIndex ? (
                          <span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="w-5 h-5" /> AMAZING! Well done!</span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-600"><XCircle className="w-5 h-5" /> OOPS! Nice try!</span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-sans text-indigo-700 leading-relaxed">
                        {activeQuestions[currentIdx].explanation}
                      </p>
                    </div>
                  )}

                  {/* Action key buttons */}
                  {hasAnswered && (
                    <button
                      onClick={handleNextSolo}
                      className="w-full kids-btn bg-yellow-400 hover:bg-yellow-350 text-slate-900 justify-center shrink-0 mt-4 select-none"
                    >
                      {currentIdx < activeQuestions.length - 1 ? 'Go to Next Question! ➡️' : 'View Results! 🏆'}
                    </button>
                  )}
                </div>
              ) : (
                /* Completed Summary scoreboard */
                <div className="kids-card bg-white border-slate-900 p-8 max-w-lg mx-auto text-center space-y-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-fadeIn">
                  <span className="text-7xl block animate-bounce" style={{ animationDuration: '3s' }}>🏆</span>
                  <div className="space-y-1">
                    <span className="inline-block font-mono text-[10px] text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full font-black border border-emerald-200">
                      TRAINING DECK FINISHED
                    </span>
                    <h3 className="font-display font-black text-3xl text-slate-800 pt-1">
                      Awesome Job, Explorer!
                    </h3>
                    <p className="font-sans text-xs text-slate-500 max-w-xs mx-auto">
                      You solved {correctCount} out of 3 trivia cards!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border-2 border-slate-900 rounded-2xl">
                    <div className="text-center">
                      <span className="block text-[8px] font-mono text-slate-400 font-bold uppercase">CORRECT ANSWERS</span>
                      <span className="font-mono text-xl text-indigo-650 font-black">{correctCount} / 3 Laps</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[8px] font-mono text-slate-400 font-bold uppercase">GOLD POINTS AWARDED</span>
                      <span className="font-mono text-xl text-emerald-650 font-black">+{pointsEarned} pts ⚽</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="kids-btn bg-slate-200 text-slate-700 hover:bg-slate-300 w-full justify-center py-2.5 text-sm"
                    >
                      Exit Arena
                    </button>
                    <button
                      onClick={startSoloQuiz}
                      className="kids-btn bg-yellow-400 text-slate-950 hover:bg-yellow-350 w-full justify-center py-2.5 text-sm"
                    >
                      <RefreshCw className="w-4 h-4" /> Play Again!
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* COMPETITION DERBY MATCH FLOW */
            <div className="max-w-2xl mx-auto space-y-6">
              {compWinner ? (
                /* Crown Winner finished overlay */
                <div className="kids-card bg-white border-slate-900 p-8 text-center space-y-6 max-w-md mx-auto shadow-[12px_12px_0px_0px_#000] animate-fadeIn">
                  <span className="text-7xl block animate-bounce" style={{ animationDuration: '2s' }}>👑</span>
                  <div>
                    <span className="inline-block font-mono text-[9px] bg-yellow-400 text-slate-900 px-3 py-1 rounded-full font-black border border-yellow-500">
                      SHOOTOUT DERBY COMPLETED
                    </span>
                    <h3 className="font-display font-black text-4xl text-slate-800 mt-2">
                      {compWinner === 'Tie Match!' ? "It's a Draw! 🤝" : `${compWinner} Wins!`}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Fantastic match, kickers! Both players score 10 pts per goal and demonstrated exceptional fair play! Share your jerseys!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 border-3 border-slate-900 p-4 rounded-3xl">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl">{p1Details.avatar}</span>
                      <span className="font-display font-black text-xs text-slate-700 truncate w-full">{p1Details.name}</span>
                      <div className="flex gap-1 mt-2 text-sm">
                        {p1Goals.map((v, i) => <span key={i}>{v}</span>)}
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-3xl">{p2Details.avatar}</span>
                      <span className="font-display font-black text-xs text-slate-700 truncate w-full">{p2Details.name}</span>
                      <div className="flex gap-1 mt-2 text-sm">
                        {p2Goals.map((v, i) => <span key={i}>{v}</span>)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="kids-btn bg-slate-200 text-slate-700 hover:bg-slate-300 flex-1 justify-center py-2.5 text-xs sm:text-sm"
                    >
                      Exit Stadium
                    </button>
                    <button
                      onClick={startCompetition}
                      className="kids-btn bg-emerald-400 text-slate-900 hover:bg-emerald-350 flex-1 justify-center py-2.5 text-xs sm:text-sm"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} /> Shoot Again!
                    </button>
                  </div>
                </div>
              ) : (
                /* Turn question prompts */
                <div className="kids-card bg-emerald-500 border-slate-900 p-8 shadow-[10px_10px_0px_0px_#0f172a] text-[#003049] space-y-6">
                  {/* Derby Scoreboard */}
                  <div className="grid grid-cols-3 bg-white p-4 border-3 border-slate-900 rounded-3xl relative overflow-hidden">
                    {/* Player 1 goals */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-4xl">{p1Details.avatar}</span>
                      <span className="font-display font-black text-sm text-slate-800 leading-none truncate w-full">{p1Details.name}</span>
                      <div className="flex gap-1 items-center mt-2 h-6 text-sm">
                        {p1Goals.map((v, i) => <span key={i}>{v}</span>)}
                        {p1Goals.length === 0 && <span className="text-slate-300 font-mono text-[9px]">no shots</span>}
                      </div>
                    </div>

                    {/* Arena Whistle logo */}
                    <div className="flex flex-col items-center justify-center text-center border-x-2 border-slate-200">
                      <span className="text-2xl leading-none">📢</span>
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none mt-1">ROUND</span>
                      <span className="font-mono font-black text-2xl text-indigo-700">{compRound} / 3</span>
                    </div>

                    {/* Player 2 goals */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-4xl">{p2Details.avatar}</span>
                      <span className="font-display font-black text-sm text-slate-800 leading-none truncate w-full">{p2Details.name}</span>
                      <div className="flex gap-1 items-center mt-2 h-6 text-sm">
                        {p2Goals.map((v, i) => <span key={i}>{v}</span>)}
                        {p2Goals.length === 0 && <span className="text-slate-300 font-mono text-[9px]">no shots</span>}
                      </div>
                    </div>
                  </div>

                  {/* Active turn alert bubble */}
                  <div className="kids-card bg-white border-slate-900 p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b-2 border-dashed border-slate-100 pb-3">
                      <span className="text-3xl animate-bounce" style={{ animationDuration: '1.2s' }}>
                        {compTurn === 1 ? p1Details.avatar : p2Details.avatar}
                      </span>
                      <div>
                        <span className="block font-mono text-[9px] uppercase tracking-wider font-extrabold text-indigo-650">
                          ACTIVE SHOOTER ACTIVE TURN
                        </span>
                        <h4 className="font-display font-black text-xl text-slate-800 leading-tight">
                          {compTurn === 1 ? p1Details.name : p2Details.name}, Take the Shot!
                        </h4>
                      </div>
                    </div>

                    {/* Question */}
                    <p className="font-display font-extrabold text-slate-800 text-lg leading-normal">
                      {compCurrentQuestion?.question}
                    </p>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {compCurrentQuestion?.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleCompAnswer(oIdx)}
                          className="rounded-2xl border-2 border-slate-900 hover:border-indigo-650 bg-white hover:bg-indigo-50 p-3.5 font-display font-bold text-slate-800 text-sm sm:text-base text-left transition select-none cursor-pointer flex items-center gap-2 w-full"
                        >
                          <span className="w-5 h-5 rounded border border-slate-400 bg-slate-50 flex items-center justify-center font-mono text-[10px] font-semibold text-slate-600">
                            {oIdx + 1}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to end this shootout match? Your current derby goals are lost.")) {
                        setIsPlaying(false);
                      }
                    }}
                    className="tag border-none cursor-pointer select-none text-[10px] font-mono font-bold text-white bg-slate-900/60 hover:bg-slate-950 px-3 py-1.5 rounded-full inline-block"
                  >
                    🚩 Forfeit Match
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
