
import React, { useState } from 'react';
import { User, Plus, Trophy } from 'lucide-react';
import { UserState } from '../types';
import { UI_STRINGS } from '../constants';
import { audio } from '../services/audioService';

interface UserSelectModalProps {
  players: UserState[];
  onSelectUser: (user: UserState) => void;
  onCreateUser: (name: string, bank: 'A'|'B'|'C') => void;
  language: 'en' | 'zh';
}

const UserSelectModal: React.FC<UserSelectModalProps> = ({ players, onSelectUser, onCreateUser, language }) => {
  const [newName, setNewName] = useState('');
  const [selectedBank, setSelectedBank] = useState<'A'|'B'|'C'>('A');
  const [isCreating, setIsCreating] = useState(false);
  const ui = UI_STRINGS[language];

  const handleCreate = () => {
    if (newName.trim()) {
      audio.play('CLICK');
      onCreateUser(newName.trim(), selectedBank);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-700 shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh]">
        
        <h2 className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
          {ui.selectUser}
        </h2>
        <p className="text-slate-400 text-center mb-6 text-sm">Select a profile to load their progress.</p>

        {/* Existing Users Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 overflow-y-auto custom-scrollbar p-1 flex-1 min-h-0">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => { audio.play('START'); onSelectUser(p); }}
              className="relative flex flex-col items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-2xl p-4 transition-all transform hover:scale-105 group"
            >
              <div className="absolute top-2 right-2 bg-slate-900 text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                {p.currentBank}卷
              </div>

              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white mb-2 shadow-lg group-hover:shadow-indigo-500/50 relative">
                {p.name.charAt(0).toUpperCase()}
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded-full border border-slate-900 flex items-center gap-0.5">
                   <Trophy size={8} /> {p.xp}
                </div>
              </div>
              <span className="font-bold text-slate-200 group-hover:text-white truncate w-full text-center text-lg">{p.name}</span>
            </button>
          ))}
          
          {/* Add New Button */}
          {!isCreating && (
            <button
              onClick={() => { audio.play('CLICK'); setIsCreating(true); }}
              className="flex flex-col items-center justify-center bg-slate-800/50 hover:bg-slate-800 border-2 border-dashed border-slate-600 hover:border-slate-400 rounded-2xl p-4 transition-all min-h-[120px]"
            >
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 mb-2">
                <Plus size={24} />
              </div>
              <span className="font-bold text-slate-400">{ui.newUser}</span>
            </button>
          )}
        </div>

        {/* Create Input Mode */}
        {isCreating && (
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 animate-in slide-in-from-bottom-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Plus size={18}/> {ui.create} {ui.newUser}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Player Name"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">{ui.bankSelector}</label>
                <div className="flex gap-2">
                  {(['A', 'B', 'C'] as const).map(bank => (
                    <button
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      className={`flex-1 py-2 rounded-lg font-bold border-2 transition-all ${
                        selectedBank === bank 
                        ? 'bg-indigo-600 border-indigo-400 text-white' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserSelectModal;
