import React from 'react';
import { Star, RotateCcw, ArrowRight, Trophy } from 'lucide-react';
import { UI_STRINGS } from '../constants';
import { Language } from '../types';

interface VictoryModalProps {
  stars: number;
  score: number;
  timeBonus: number;
  onNext: () => void;
  onReplay: () => void;
  language: Language;
}

const VictoryModal: React.FC<VictoryModalProps> = ({ stars, score, timeBonus, onNext, onReplay, language }) => {
  const ui = UI_STRINGS[language].victory;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 rounded-3xl p-8 max-w-md w-full border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)] relative transform animate-in zoom-in-95 duration-300 flex flex-col items-center">
        
        {/* Animated Background Rays */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Trophy Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce border-4 border-white">
          <Trophy className="text-white" size={48} />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 text-center drop-shadow-md">{ui.title}</h2>
        <p className="text-slate-300 mb-6 text-center text-lg">{ui.subtitle}</p>

        {/* Score Details */}
        <div className="bg-slate-800/60 rounded-xl p-4 w-full mb-6 border border-slate-700">
           <div className="flex justify-between items-center mb-1">
             <span className="text-slate-400 text-sm">{ui.baseScore}</span>
             <span className="text-white font-mono">1000</span>
           </div>
           <div className="flex justify-between items-center mb-3">
             <span className="text-green-400 text-sm">{ui.timeBonus}</span>
             <span className="text-green-400 font-mono">+{timeBonus}</span>
           </div>
           <div className="h-px bg-slate-700 w-full mb-3"></div>
           <div className="flex justify-between items-center">
             <span className="text-white font-bold text-lg">{ui.score}</span>
             <span className="text-yellow-400 font-bold text-2xl font-mono">{score}</span>
           </div>
        </div>

        {/* Star Rating */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`transform transition-all duration-500 ${s <= stars ? 'scale-110' : 'scale-90 opacity-30 grayscale'}`}
              style={{ transitionDelay: `${s * 150}ms` }}
            >
              <Star 
                size={48} 
                className={`${s <= stars ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'text-slate-600 fill-slate-800'}`} 
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 w-full">
          <button 
            onClick={onReplay}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 border-2 border-slate-600"
          >
            <RotateCcw size={20} />
            <span>{ui.replay}</span>
          </button>
          <button 
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-transform active:scale-95"
          >
            <span>{ui.nextLevel}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;