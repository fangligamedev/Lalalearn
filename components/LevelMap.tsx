
import React from 'react';
import { getLevels, UI_STRINGS } from '../constants';
import { UserState } from '../types';
import { Lock, Star, Play, Trophy, Users, User } from 'lucide-react';
import { audio } from '../services/audioService';

interface LevelMapProps {
  userState: UserState;
  onSelectLevel: (id: number) => void;
  onSelectBank: (bank: 'A' | 'B' | 'C') => void;
  onSwitchUser: () => void;
  onShowLeaderboard: () => void;
}

const LevelMap: React.FC<LevelMapProps> = ({ userState, onSelectLevel, onSelectBank, onSwitchUser, onShowLeaderboard }) => {
  const levels = getLevels(userState.language, userState.currentBank);
  const ui = UI_STRINGS[userState.language];

  const handleBankChange = (bank: 'A' | 'B' | 'C') => {
    audio.play('CLICK');
    onSelectBank(bank);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-12 gap-6">
          
          {/* Left: Title + User Controls (Grouped Together) */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 drop-shadow-sm flex items-center gap-3 animate-float">
              <Trophy className="text-yellow-500" size={40} />
              {ui.mapTitle}
            </h2>

            {/* Switch User Button - Placed right next to Title */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => { audio.play('CLICK'); onSwitchUser(); }}
                    className="flex items-center gap-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/20 group border border-indigo-400/30"
                    title={ui.switchUser}
                >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                    <User size={16} className="text-white" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold">{ui.player}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm truncate max-w-[100px]">{userState.name}</span>
                        <span className="bg-indigo-800 text-indigo-200 text-[9px] px-1.5 rounded border border-indigo-400/30 font-mono">
                        {userState.currentBank}
                        </span>
                    </div>
                    </div>
                </button>

                <button 
                    onClick={() => { audio.play('CLICK'); onShowLeaderboard(); }}
                    className="p-3 text-yellow-500 hover:text-yellow-400 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-600 transition-colors shadow-md"
                    title={ui.leaderboard}
                >
                    <Trophy size={20} />
                </button>
            </div>
          </div>

          {/* Right: Bank Selector */}
          <div className="bg-slate-800 p-2 rounded-2xl border border-slate-700 flex items-center gap-3 shadow-xl self-start xl:self-auto">
             <div className="flex items-center gap-2 px-3 text-slate-400 font-bold text-xs uppercase tracking-wider">
               <Users size={14} />
               <span>{ui.bankSelector}</span>
             </div>
             <div className="flex gap-1">
               {(['A', 'B', 'C'] as const).map(bank => (
                 <button
                   key={bank}
                   onClick={() => handleBankChange(bank)}
                   className={`w-10 h-10 rounded-xl font-black text-lg transition-all transform hover:scale-110 ${
                     userState.currentBank === bank 
                     ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg scale-110 ring-2 ring-white/20' 
                     : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                   }`}
                 >
                   {bank}
                 </button>
               ))}
             </div>
          </div>
        </div>
        
        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {levels.map((level) => {
            const isUnlocked = level.id <= userState.currentLevel;
            const stars = userState.levelStars[level.id] || 0;
            const isCompleted = stars > 0;

            return (
              <div
                key={level.id}
                onClick={() => {
                   if(isUnlocked) {
                     audio.play('START');
                     onSelectLevel(level.id);
                   }
                }}
                className={`relative group rounded-3xl p-6 transition-all duration-300 transform border-b-4 
                  ${isUnlocked 
                    ? 'cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(168,85,247,0.4)] bg-slate-800 border-indigo-900 hover:border-indigo-500' 
                    : 'opacity-50 grayscale bg-slate-900 border-slate-800 cursor-not-allowed'
                  }
                `}
              >
                {isUnlocked && (
                  <div className="absolute top-4 right-4 bg-slate-900/50 rounded-lg px-2 py-1 text-[10px] font-mono text-slate-300 border border-slate-700">
                    ⏱️ {level.timeLimit}s
                  </div>
                )}

                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl mb-4 shadow-inner
                  ${isCompleted ? 'bg-green-500 text-white' : level.id === userState.currentLevel ? 'bg-yellow-500 text-black animate-pulse' : 'bg-slate-700 text-slate-500'}
                `}>
                  {level.id}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 truncate">
                    {level.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 h-8">
                    {level.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  {isCompleted ? (
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <Star key={i} size={20} className={i <= stars ? "text-yellow-400 fill-yellow-400" : "text-slate-700 fill-slate-700"} />
                      ))}
                    </div>
                  ) : !isUnlocked ? (
                    <Lock className="text-slate-600" size={20} />
                  ) : (
                    <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider flex items-center gap-1">
                      {ui.playNow} <Play size={14} fill="currentColor"/>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelMap;
