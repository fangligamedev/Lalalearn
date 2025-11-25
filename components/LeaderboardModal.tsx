
import React from 'react';
import { X, Trophy, Medal, Star } from 'lucide-react';
import { UserState } from '../types';
import { UI_STRINGS } from '../constants';

interface LeaderboardModalProps {
  players: UserState[];
  currentPlayerId: string;
  onClose: () => void;
  language: 'en' | 'zh';
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ players, currentPlayerId, onClose, language }) => {
  const ui = UI_STRINGS[language];
  
  // Sort players by XP (descending)
  const sortedPlayers = [...players].sort((a, b) => b.xp - a.xp);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-md rounded-3xl border-2 border-yellow-600/50 shadow-2xl flex flex-col overflow-hidden max-h-[80vh] m-4">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-900 to-amber-900 p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <Trophy size={28} className="text-yellow-400 animate-bounce" />
             <h2 className="text-2xl font-black text-white tracking-wide uppercase">{ui.leaderboard}</h2>
          </div>
          <button onClick={onClose} className="bg-black/20 p-2 rounded-full hover:bg-black/40 text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {sortedPlayers.map((player, index) => {
            const isMe = player.id === currentPlayerId;
            let rankIcon = <span className="font-mono font-bold text-slate-500 w-6 text-center">{index + 1}</span>;
            
            if (index === 0) rankIcon = <Medal className="text-yellow-400 w-6" />;
            if (index === 1) rankIcon = <Medal className="text-slate-300 w-6" />;
            if (index === 2) rankIcon = <Medal className="text-amber-600 w-6" />;

            return (
              <div 
                key={player.id}
                className={`flex items-center p-4 rounded-xl border ${isMe ? 'bg-indigo-900/40 border-indigo-500 ring-1 ring-indigo-400' : 'bg-slate-800 border-slate-700'}`}
              >
                <div className="mr-4 flex justify-center w-8">
                  {rankIcon}
                </div>
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 shadow-inner ${isMe ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className={`font-bold ${isMe ? 'text-white' : 'text-slate-200'}`}>{player.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                     <Star size={10} className="text-yellow-500" /> {player.stars} Stars
                  </div>
                </div>

                <div className="font-mono font-black text-xl text-yellow-400">
                  {player.xp}
                </div>
              </div>
            );
          })}

          {sortedPlayers.length === 0 && (
             <div className="text-center text-slate-500 py-10">No players yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
