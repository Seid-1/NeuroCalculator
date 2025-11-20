import React from 'react';
import { Delete, Divide, Equal, Minus, Plus, X, RotateCcw, BrainCircuit, Activity, Camera } from 'lucide-react';

interface KeypadProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onEqual: () => void;
  onAiSolve: () => void;
  onGraph: () => void;
  onScan: () => void;
  canGraph: boolean;
}

const Button: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'operator' | 'action' | 'scientific' | 'ai';
  className?: string;
}> = ({ onClick, children, variant = 'default', className = '' }) => {
  
  const baseStyles = "h-14 rounded-xl font-medium text-lg transition-all duration-200 active:scale-95 flex items-center justify-center select-none shadow-sm";
  
  const variants = {
    default: "bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-[0_4px_0_0_rgba(51,65,85,1)] active:shadow-none active:translate-y-[4px]",
    operator: "bg-slate-800 hover:bg-slate-750 text-cyan-400 text-xl shadow-[0_4px_0_0_rgba(30,41,59,1)] active:shadow-none active:translate-y-[4px]",
    action: "bg-rose-500 hover:bg-rose-400 text-white shadow-[0_4px_0_0_rgba(159,18,57,1)] active:shadow-none active:translate-y-[4px]",
    scientific: "bg-slate-800 hover:bg-slate-750 text-slate-300 text-sm font-mono shadow-[0_4px_0_0_rgba(30,41,59,1)] active:shadow-none active:translate-y-[4px]",
    ai: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_4px_0_0_rgba(76,29,149,1)] active:shadow-none active:translate-y-[4px]"
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Keypad: React.FC<KeypadProps> = ({ onInput, onClear, onDelete, onEqual, onAiSolve, onGraph, onScan, canGraph }) => {
  
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full">
      {/* Row 1: Advanced & Clear */}
      <Button variant="scientific" onClick={() => onInput('sin(')}>sin</Button>
      <Button variant="scientific" onClick={() => onInput('cos(')}>cos</Button>
      <Button variant="scientific" onClick={() => onInput('tan(')}>tan</Button>
      <Button variant="action" onClick={onClear} className="bg-slate-600 text-rose-400"><RotateCcw size={18} /></Button>

      {/* Row 2: Scientific */}
      <Button variant="scientific" onClick={() => onInput('ln(')}>ln</Button>
      <Button variant="scientific" onClick={() => onInput('log(')}>log</Button>
      <Button variant="scientific" onClick={() => onInput('^')}>xʸ</Button>
      <Button variant="scientific" onClick={() => onInput('sqrt(')}>√</Button>

      {/* Row 3: Brackets & Constants */}
      <Button variant="scientific" onClick={() => onInput('(')}>(</Button>
      <Button variant="scientific" onClick={() => onInput(')')}>)</Button>
      <Button variant="scientific" onClick={() => onInput('pi')}>π</Button>
      <Button variant="scientific" onClick={() => onInput('e')}>e</Button>
      
       {/* Row 4: Graph, Scan & AI */}
      <Button variant="scientific" onClick={() => onInput('x')} className="text-emerald-400 font-bold">x</Button>
      
      <Button variant="scientific" onClick={onGraph} className="w-full text-emerald-400 group relative">
         <Activity size={20} />
      </Button>

      <Button variant="ai" onClick={onScan} className="bg-gradient-to-r from-sky-500 to-cyan-600 shadow-[0_4px_0_0_rgba(8,145,178,1)]">
        <Camera size={20} />
      </Button>

      <Button variant="ai" onClick={onAiSolve} className="w-full">
        <BrainCircuit size={20} />
      </Button>

      {/* Row 5 */}
      <Button variant="default" onClick={() => onInput('7')}>7</Button>
      <Button variant="default" onClick={() => onInput('8')}>8</Button>
      <Button variant="default" onClick={() => onInput('9')}>9</Button>
      <Button variant="operator" onClick={() => onDelete()}><Delete size={20} /></Button>

      {/* Row 6 */}
      <Button variant="default" onClick={() => onInput('4')}>4</Button>
      <Button variant="default" onClick={() => onInput('5')}>5</Button>
      <Button variant="default" onClick={() => onInput('6')}>6</Button>
      <Button variant="operator" onClick={() => onInput('/')}><Divide size={20} /></Button>

      {/* Row 7 */}
      <Button variant="default" onClick={() => onInput('1')}>1</Button>
      <Button variant="default" onClick={() => onInput('2')}>2</Button>
      <Button variant="default" onClick={() => onInput('3')}>3</Button>
      <Button variant="operator" onClick={() => onInput('*')}><X size={20} /></Button>

      {/* Row 8 */}
      <Button variant="default" onClick={() => onInput('.')}>.</Button>
      <Button variant="default" onClick={() => onInput('0')}>0</Button>
      <Button variant="operator" onClick={onEqual} className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_4px_0_0_rgba(8,145,178,1)]"><Equal size={24} /></Button>
      <Button variant="operator" onClick={() => onInput('+')}><Plus size={20} /></Button>
      
      {/* Extra minus for layout balance if needed */}
      <Button variant="operator" className="col-start-4 row-start-7" onClick={() => onInput('-')}><Minus size={20} /></Button>
    </div>
  );
};