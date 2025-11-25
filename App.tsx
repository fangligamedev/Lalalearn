
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Map as MapIcon, RotateCcw, Play, Languages, User, Star, Terminal, AlertTriangle, CheckCircle, XCircle, Timer, Zap, Trophy, Users } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import CoachChat from './components/CoachChat';
import LevelMap from './components/LevelMap';
import TutorialOverlay from './components/TutorialOverlay';
import VictoryModal from './components/VictoryModal';
import LeaderboardModal from './components/LeaderboardModal'; 
import UserSelectModal from './components/UserSelectModal';   
import { getLevels, UI_STRINGS, LEVEL_COUNT } from './constants';
import { validateCodeWithGemini, sendChatMessage } from './services/geminiService';
import { UserState, MessageRole, ChatMessage, CoachPersona, LevelData } from './types';
import { audio } from './services/audioService';

const App: React.FC = () => {
  // --- Global State (Multi-User) ---
  const [allPlayers, setAllPlayers] = useState<UserState[]>([]);
  const [showUserSelect, setShowUserSelect] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // --- Current User State ---
  const [userState, setUserState] = useState<UserState>({
    id: 'default',
    currentLevel: 1,
    stars: 0,
    levelStars: {},
    xp: 0,
    unlockedBadges: [],
    name: 'Guest',
    language: 'zh',
    hasSeenTutorial: false,
    settings: {
      voiceURI: null,
      persona: 'gentle'
    },
    currentBank: 'A'
  });

  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [currentLevelData, setCurrentLevelData] = useState<LevelData | null>(null);
  const [code, setCode] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  
  // Party Mode State
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [scoreData, setScoreData] = useState({ score: 0, timeBonus: 0 });

  const [tutorialStep, setTutorialStep] = useState<number>(-1);
  const [showVictory, setShowVictory] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  const ui = UI_STRINGS[userState.language];
  const levels = getLevels(userState.language, userState.currentBank);

  // --- Initialization & Persistence ---

  // 1. Load players
  useEffect(() => {
    const savedPlayers = localStorage.getItem('pysparky_players');
    if (savedPlayers) {
      try {
        const parsed = JSON.parse(savedPlayers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllPlayers(parsed);
          setShowUserSelect(true);
          return;
        }
      } catch (e) {
        console.error("Failed to load save data", e);
      }
    }
    setShowUserSelect(true);
  }, []);

  // 2. Save players
  useEffect(() => {
    if (allPlayers.length > 0) {
      localStorage.setItem('pysparky_players', JSON.stringify(allPlayers));
    }
  }, [allPlayers]);

  // 3. Sync current userState back to allPlayers
  useEffect(() => {
    if (userState.id !== 'default') {
      setAllPlayers(prev => prev.map(p => p.id === userState.id ? userState : p));
    }
  }, [userState]);


  // --- Effects (Level Logic) ---
  useEffect(() => {
    if (userState.id !== 'default' && !userState.hasSeenTutorial) {
      setTutorialStep(0);
    }
  }, [userState.id]); 

  // Level Initialization & Timer
  useEffect(() => {
    if (activeLevelId && currentLevelData) {
      setMessages([{ role: MessageRole.MODEL, text: currentLevelData.description || ui.welcomeChat }]);
      setCode(currentLevelData.starterCode || '');
      setOutput('');
      setRunStatus('idle');
      
      // Init Timer
      setTimeLeft(currentLevelData.timeLimit || 60);
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
             clearInterval(timerRef.current!);
             audio.play('LOSE');
             return 0;
          }
          if (prev <= 11) audio.play('TICK');
          return prev - 1;
        });
      }, 1000);

    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (userState.id !== 'default') {
        setMessages([{ role: MessageRole.MODEL, text: ui.welcomeChat }]);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeLevelId, currentLevelData, userState.language, userState.currentBank]);


  // --- User Management Handlers ---

  const handleCreateUser = (name: string, bank: 'A'|'B'|'C') => {
    const newUser: UserState = {
      id: Date.now().toString(),
      name,
      currentLevel: 1,
      stars: 0,
      levelStars: {},
      xp: 0,
      unlockedBadges: [],
      language: userState.language, 
      hasSeenTutorial: false,
      settings: { voiceURI: null, persona: 'gentle' },
      currentBank: bank 
    };
    setAllPlayers(prev => [...prev, newUser]);
    setUserState(newUser);
    setShowUserSelect(false);
  };

  const handleSelectUser = (user: UserState) => {
    setUserState(user);
    setShowUserSelect(false);
  };

  const handleSwitchUser = () => {
    audio.play('CLICK');
    setActiveLevelId(null);
    setCurrentLevelData(null);
    setShowUserSelect(true);
  };

  // --- Game Handlers ---

  const toggleLanguage = () => {
    audio.play('CLICK');
    setUserState(prev => ({ ...prev, language: prev.language === 'en' ? 'zh' : 'en' }));
  };

  const handleLevelSelect = (id: number) => {
    const baseLevel = levels.find(l => l.id === id);
    if (baseLevel) {
      let finalLevel = { ...baseLevel };
      // RANDOMIZATION LOGIC: Pick a random variant if available
      if (baseLevel.variants && baseLevel.variants.length > 0) {
        const randomIndex = Math.floor(Math.random() * baseLevel.variants.length);
        const randomVariant = baseLevel.variants[randomIndex];
        // Merge variant data into the active level data
        finalLevel = {
          ...finalLevel,
          task: randomVariant.task,
          starterCode: randomVariant.starterCode,
          hint: randomVariant.hint,
          description: randomVariant.description || finalLevel.description // Optional override
        };
      }
      
      setCurrentLevelData(finalLevel);
      setActiveLevelId(id);
      if (tutorialStep === 1) setTutorialStep(2);
    }
  };
  
  const handleBankSelect = (bank: 'A' | 'B' | 'C') => {
    setUserState(prev => ({...prev, currentBank: bank}));
  };

  const handleTutorialNext = () => {
    audio.play('CLICK');
    if (tutorialStep >= 4) {
      setTutorialStep(-1);
      setUserState(prev => ({ ...prev, hasSeenTutorial: true }));
    } else {
      setTutorialStep(prev => prev + 1);
    }
  };

  const handleRunCode = async () => {
    if (!currentLevelData) return;
    audio.play('CLICK');
    setIsRunning(true);
    setRunStatus('running');
    setOutput(ui.casting);
    
    if (timerRef.current) clearInterval(timerRef.current);

    if (tutorialStep === 3) setTutorialStep(4);

    const result = await validateCodeWithGemini(code, currentLevelData.task, userState.language);
    
    setIsRunning(false);
    setOutput(result.output || "");
    setRunStatus(result.success ? 'success' : 'error');

    const feedbackMsg: ChatMessage = { role: MessageRole.MODEL, text: result.feedback };
    setMessages(prev => [...prev, feedbackMsg]);

    if (result.success) {
      const baseScore = 1000;
      const timeBonus = timeLeft * 20;
      const totalScore = baseScore + timeBonus;
      
      const percentLeft = timeLeft / (currentLevelData.timeLimit || 60);
      let newStars = 1;
      if (percentLeft > 0.5) newStars = 3;
      else if (percentLeft > 0.2) newStars = 2;

      setEarnedStars(newStars);
      setScoreData({ score: totalScore, timeBonus });
      
      setUserState(prev => {
        const nextLevel = currentLevelData.id === prev.currentLevel && currentLevelData.id < LEVEL_COUNT ? prev.currentLevel + 1 : prev.currentLevel;
        const currentLevelStars = prev.levelStars[currentLevelData.id] || 0;
        
        return {
          ...prev,
          stars: prev.stars + Math.max(0, newStars - currentLevelStars),
          xp: prev.xp + totalScore,
          currentLevel: nextLevel,
          levelStars: { ...prev.levelStars, [currentLevelData.id]: Math.max(currentLevelStars, newStars) }
        };
      });
      setTimeout(() => setShowVictory(true), 800);
    } else {
       if (timeLeft > 0) {
          audio.play('LOSE');
          timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
              return prev - 1;
            });
          }, 1000);
       }
    }
  };

  const handleSendMessage = async (text: string) => {
    if (tutorialStep === 4) handleTutorialNext();
    const newMsg: ChatMessage = { role: MessageRole.USER, text };
    setMessages(prev => [...prev, newMsg]);
    setIsChatLoading(true);

    const response = await sendChatMessage(
      messages, 
      text, 
      userState.language, 
      userState.settings.persona,
      {
        currentLevel: activeLevelId || 0,
        levelTitle: currentLevelData?.title,
        levelTask: currentLevelData?.task,
        currentCode: code,
        userXp: userState.xp
      }
    );

    setIsChatLoading(false);
    setMessages(prev => [...prev, { role: MessageRole.MODEL, text: response }]);
  };

  const handleNextLevel = () => {
    setShowVictory(false);
    setActiveLevelId(null);
    setCurrentLevelData(null);
  };

  const updateSettings = (voice: string, persona: CoachPersona) => {
    setUserState(prev => ({ ...prev, settings: { voiceURI: voice || null, persona } }));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden font-fredoka selection:bg-purple-500/30">
      
      {/* Modals */}
      {showUserSelect && (
        <UserSelectModal 
          players={allPlayers} 
          onSelectUser={handleSelectUser} 
          onCreateUser={handleCreateUser} 
          language={userState.language}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal 
          players={allPlayers} 
          currentPlayerId={userState.id}
          onClose={() => { audio.play('CLICK'); setShowLeaderboard(false); }}
          language={userState.language}
        />
      )}

      {tutorialStep >= 0 && <TutorialOverlay step={tutorialStep} onNext={handleTutorialNext} language={userState.language} />}
      {showVictory && <VictoryModal stars={earnedStars} score={scoreData.score} timeBonus={scoreData.timeBonus} onNext={handleNextLevel} onReplay={() => setShowVictory(false)} language={userState.language} />}

      {/* Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-40 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 p-2 rounded-lg shadow-lg shadow-purple-900/40">
            <Bot className="text-white" size={22} />
          </div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden md:block tracking-wide">
            {ui.appTitle}
          </h1>
        </div>

        {/* Timer (Center) */}
        {activeLevelId && (
          <div className={`absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${timeLeft < 10 ? 'bg-red-900/50 border-red-500 animate-pulse' : 'bg-slate-800 border-slate-700'}`}>
            <Timer size={20} className={timeLeft < 10 ? 'text-red-400' : 'text-slate-400'} />
            <span className={`font-mono text-xl font-black ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
           {activeLevelId && (
            <button onClick={() => setActiveLevelId(null)} className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-bold transition-all border border-slate-700 hover:border-slate-600">
              <MapIcon size={16} />
              <span>{ui.mapBtn}</span>
            </button>
          )}
          
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-4 py-2 rounded-full text-xs font-bold border border-slate-700">
            <Zap size={16} className="text-blue-400 fill-blue-400" />
            <span className="text-blue-100">{userState.xp}</span>
          </div>

          <button onClick={toggleLanguage} className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-bold transition-all border border-slate-700">
            <Languages size={16} />
            <span>{userState.language === 'en' ? '中' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 h-[calc(100vh-4rem)] overflow-hidden relative p-3">
        {!activeLevelId ? (
          <LevelMap 
            userState={userState} 
            onSelectLevel={handleLevelSelect} 
            onSelectBank={handleBankSelect} 
            onSwitchUser={handleSwitchUser} 
            onShowLeaderboard={() => setShowLeaderboard(true)}
          />
        ) : (
          <div className="flex flex-col md:flex-row h-full gap-4">
            
            {/* Left Column */}
            <div className="flex flex-col flex-[2] gap-3 h-full min-w-0">
              
              {/* TOP BAR */}
              <div className="flex justify-between items-stretch gap-3 shrink-0 h-20">
                <div className="flex-1 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-3 px-5 rounded-2xl border border-indigo-500/30 backdrop-blur-sm shadow-sm flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm shrink-0">{ui.mission} #{currentLevelData?.id}</span>
                      <h2 className="font-bold text-base text-white tracking-wide truncate">{currentLevelData?.title}</h2>
                    </div>
                    <p className="text-sm text-slate-200 leading-snug opacity-90 truncate">{currentLevelData?.task}</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700 shrink-0">
                   <button 
                    onClick={() => { audio.play('CLICK'); setCode(currentLevelData?.starterCode || ''); }}
                    className="h-full px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl transition-colors flex flex-col items-center justify-center gap-1 min-w-[64px]"
                    title={ui.resetBtn}
                   >
                     <RotateCcw size={18} />
                     <span className="text-[10px] uppercase font-bold">{ui.resetBtn.includes(' ') ? 'Reset' : ui.resetBtn}</span>
                   </button>
                   
                   <button 
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="h-full px-6 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95 border-b-4 border-green-700 hover:border-green-600 flex flex-col items-center justify-center gap-1 min-w-[80px]"
                   >
                     {isRunning ? (
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     ) : (
                       <Play size={20} fill="currentColor" />
                     )}
                     <span className="text-[10px] uppercase font-bold">{ui.runBtn}</span>
                   </button>
                </div>
              </div>

              {/* EDITOR */}
              <div className="flex-1 min-h-0 relative shadow-2xl rounded-xl overflow-hidden border-2 border-slate-700/50">
                <CodeEditor 
                  code={code} onChange={setCode} 
                  placeholder={currentLevelData?.starterCode}
                />
              </div>

              {/* OUTPUT */}
              <div className="h-[25%] bg-[#1e1e1e] rounded-xl border border-slate-700 flex flex-col overflow-hidden shrink-0 shadow-lg font-mono text-sm group">
                <div className="px-4 py-2 bg-[#2d2d2d] border-b border-[#3e3e42] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-400 font-bold tracking-wider">{ui.outputTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     {runStatus === 'success' && <span className="flex items-center gap-1 text-[10px] text-green-400 uppercase font-bold"><CheckCircle size={10}/> Success</span>}
                     {runStatus === 'error' && <span className="flex items-center gap-1 text-[10px] text-red-400 uppercase font-bold"><XCircle size={10}/> Error</span>}
                  </div>
                </div>
                
                <div className="p-4 overflow-y-auto custom-scrollbar flex-1 whitespace-pre-wrap code-font bg-[#1e1e1e]/90">
                  {runStatus === 'idle' && <span className="text-slate-500 italic opacity-70">$ python3 magic_script.py</span>}
                  
                  {runStatus === 'running' && (
                     <div className="text-yellow-400 animate-pulse flex items-center gap-2">
                       <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"/> 
                       executing magic_script.py...
                     </div>
                  )}

                  {runStatus === 'success' && output && (
                    <div className="text-green-300 animate-in fade-in duration-300">
                      <span className="text-slate-500 block mb-2 select-none text-xs">$ python3 magic_script.py</span>
                      {output}
                    </div>
                  )}

                  {runStatus === 'error' && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="text-slate-500 block mb-2 select-none text-xs">$ python3 magic_script.py</span>
                      <div className="text-red-300 bg-red-950/30 border-l-2 border-red-500/50 p-3 rounded-r-lg font-mono text-xs md:text-sm">
                         <div className="flex items-center gap-2 font-bold mb-2 text-red-400"><AlertTriangle size={14}/> Runtime Error / Syntax Error</div>
                         {output}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Coach Chat */}
            <div className="flex-1 min-w-[320px] max-w-md shrink-0 h-[calc(100%-150px)] self-start rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <CoachChat 
                messages={messages} onSendMessage={handleSendMessage} isLoading={isChatLoading} language={userState.language}
                voice={userState.settings.voiceURI} persona={userState.settings.persona} onUpdateSettings={updateSettings}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
