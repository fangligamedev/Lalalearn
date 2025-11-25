
import React, { useRef } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, disabled, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCount = lines.length;

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      // Insert 4 spaces
      const newValue = code.substring(0, start) + "    " + code.substring(end);
      
      onChange(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="w-full h-full bg-slate-800 flex flex-col relative group">
      {/* Minimal Header - File Name */}
      <div className="absolute top-0 right-0 left-0 h-6 bg-slate-900/80 z-10 pointer-events-none flex justify-end px-2 border-b border-slate-700/50">
         <span className="text-[10px] text-slate-500 font-mono self-center">magic_script.py</span>
      </div>

      <div className="flex flex-1 relative overflow-hidden pt-6">
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="bg-slate-900 w-10 text-right pr-2 pt-4 text-slate-600 font-mono text-sm select-none overflow-hidden code-font leading-relaxed border-r border-slate-700/50"
        >
          {Array.from({ length: Math.max(lineCount, 20) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          disabled={disabled}
          className="flex-1 w-full bg-slate-900/50 text-purple-200 p-4 font-mono text-sm md:text-base focus:outline-none resize-none code-font leading-relaxed whitespace-pre"
          spellCheck={false}
          placeholder={placeholder || "# Type your code here..."}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
