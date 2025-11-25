import React from 'react';
import { UI_STRINGS } from '../constants';
import { Language } from '../types';
import { Bot, ArrowRight } from 'lucide-react';

interface TutorialOverlayProps {
  step: number;
  onNext: () => void;
  language: Language;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ step, onNext, language }) => {
  const strings = UI_STRINGS[language].tutorial;

  // Render content based on step
  const renderContent = () => {
    switch(step) {
      case 0: // Welcome
        return {
          text: strings.welcome,
          position: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          arrow: null
        };
      case 1: // Map
        return {
          text: strings.map,
          position: "top-32 left-1/2 transform -translate-x-1/2",
          arrow: "down"
        };
      case 2: // Editor (Only shows when level is active)
        return {
          text: strings.editor,
          position: "top-1/2 left-1/4 transform -translate-x-1/2", // Approximate
          arrow: "down"
        };
      case 3: // Run Button
        return {
          text: strings.run,
          position: "top-24 right-1/4 transform translate-x-1/2",
          arrow: "up"
        };
      case 4: // Chat
        return {
          text: strings.chat,
          position: "bottom-32 right-16",
          arrow: "right"
        };
      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 pointer-events-auto flex flex-col transition-all duration-500">
       <div className={`absolute ${content.position} max-w-sm w-full p-6 animate-pop`}>
         <div className="bg-white rounded-3xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.5)] relative border-4 border-purple-500">
            {/* Sparky Icon */}
            <div className="absolute -top-10 -left-6 w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
              <Bot size={40} className="text-white" />
            </div>

            <div className="mt-4 text-slate-800 text-lg font-bold leading-relaxed">
              {content.text}
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={onNext}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold shadow-md flex items-center space-x-2 transition-transform active:scale-95"
              >
                <span>{step === 4 ? strings.finish : strings.next}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Little Triangle Pointer */}
            <div className="absolute w-6 h-6 bg-white rotate-45 border-b-4 border-r-4 border-purple-500/0 transform 
              ${content.arrow === 'down' ? '-bottom-3 left-1/2 -translate-x-1/2' : 
                content.arrow === 'up' ? '-top-3 left-1/2 -translate-x-1/2' : 
                content.arrow === 'right' ? 'top-1/2 -right-3 -translate-y-1/2' : 'hidden'}
            "></div>
         </div>
       </div>
    </div>
  );
};

export default TutorialOverlay;