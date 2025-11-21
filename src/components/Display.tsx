import React, { useEffect, useRef } from 'react';

interface DisplayProps {
  expression: string;
  result: string;
  isError: boolean;
}

export const Display: React.FC<DisplayProps> = ({ expression, result, isError }) => {
  const displayRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to end of expression
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [expression]);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-inner mb-6 border border-slate-700 flex flex-col justify-end h-40 relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      {/* Expression Input */}
      <div 
        ref={displayRef}
        className="text-slate-400 text-xl font-mono text-right overflow-x-auto whitespace-nowrap scrollbar-hide mb-2 pb-1"
      >
        {expression || '0'}
      </div>

      {/* Result Output */}
      <div className={`text-4xl font-bold text-right font-mono tracking-tight truncate ${isError ? 'text-red-400' : 'text-cyan-400'}`}>
        {result || (expression ? '...' : '0')}
      </div>
    </div>
  );
};
