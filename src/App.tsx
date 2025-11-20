import React, { useState, useCallback } from 'react';
import { CalculationHistoryItem, AiResponseState, GraphDataPoint } from './types';
import { solveWithReasoning, solveImageProblem } from './services/geminiService';
import { evaluateExpression, generatePoints, isGraphable } from './utils/mathUtils';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { Graph } from './components/Graph';
import { AiResponse } from './components/AiResponse';
import { CameraScanner } from './components/CameraScanner';
import { History, X, Trash2 } from 'lucide-react';

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [isError, setIsError] = useState(false);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Graph State
  const [isGraphing, setIsGraphing] = useState(false);
  const [graphData, setGraphData] = useState<GraphDataPoint[]>([]);
  
  // AI & Camera State
  const [showAi, setShowAi] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [aiState, setAiState] = useState<AiResponseState>({
    text: '',
    loading: false,
    error: null
  });

  const handleInput = (val: string) => {
    setIsError(false);
    setExpression(prev => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
    setIsError(false);
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const calculate = useCallback(() => {
    if (!expression) return;

    // Clean up expression for processing (remove y= prefix if present)
    const cleanExpr = expression.replace(/^y\s*=\s*/i, '');

    // AUTO-GRAPHING LOGIC
    // If expression contains 'x', we treat it as a function to plot instead of a scalar to evaluate.
    if (isGraphable(cleanExpr)) {
        const points = generatePoints(cleanExpr, -10, 10, 0.2);
        if (points.length > 0) {
            setGraphData(points);
            setIsGraphing(true);
            // Add graph event to history
            const newItem: CalculationHistoryItem = {
                id: Date.now().toString(),
                expression: `Plot: ${cleanExpr}`,
                result: 'Graph Generated',
                timestamp: Date.now(),
                isAi: false
            };
            setHistory(prev => [newItem, ...prev].slice(0, 50));
        } else {
            setResult('Invalid Func');
            setIsError(true);
        }
        return;
    }

    // SCALAR CALCULATION LOGIC
    try {
      const calcResult = evaluateExpression(cleanExpr);
      setResult(calcResult);
      setIsError(false);
      
      // Add to history
      const newItem: CalculationHistoryItem = {
        id: Date.now().toString(),
        expression: cleanExpr,
        result: calcResult,
        timestamp: Date.now(),
        isAi: false
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));
    } catch (err) {
      setResult('Error');
      setIsError(true);
    }
  }, [expression]);

  const handleGraph = useCallback(() => {
    const cleanExpr = expression.replace(/^y\s*=\s*/i, '');
    if (!cleanExpr) return;
    
    const points = generatePoints(cleanExpr, -10, 10, 0.2);
    if (points.length > 0) {
      setGraphData(points);
      setIsGraphing(true);
    } else {
      setResult('Cannot plot');
      setIsError(true);
    }
  }, [expression]);

  const handleAiSolve = async () => {
    if (!expression) return;
    
    setShowAi(true);
    setAiState({ loading: true, text: '', error: null });

    try {
      const solution = await solveWithReasoning(expression);
      setAiState({ loading: false, text: solution, error: null });
      
      // Add to history as AI interaction
      const newItem: CalculationHistoryItem = {
        id: Date.now().toString(),
        expression: `AI: ${expression}`,
        result: 'Solved',
        timestamp: Date.now(),
        isAi: true
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));
    } catch (err) {
      setAiState({ loading: false, text: '', error: 'Failed to fetch AI response.' });
    }
  };

  const handleScanCapture = async (base64Image: string) => {
    setIsScanning(false);
    setShowAi(true);
    setAiState({ loading: true, text: 'Analyzing image content...', error: null });

    try {
      const solution = await solveImageProblem(base64Image);
      setAiState({ loading: false, text: solution, error: null });
      
       // Add to history
      const newItem: CalculationHistoryItem = {
        id: Date.now().toString(),
        expression: `Photo Analysis`,
        result: 'Analyzed',
        timestamp: Date.now(),
        isAi: true
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));

    } catch (err) {
      setAiState({ loading: false, text: '', error: 'Failed to analyze image.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center sm:p-8">
      {/* Main Calculator Container - Responsive height for mobile */}
      <div className="w-full max-w-md bg-slate-900 sm:rounded-3xl shadow-2xl overflow-hidden border-x sm:border border-slate-800 relative flex flex-col h-[100dvh] sm:h-auto sm:min-h-[640px]">
        
        {/* Header / Toolbar */}
        <div className="h-14 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 z-10 shrink-0">
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-rose-500"></div>
             <div className="w-3 h-3 rounded-full bg-amber-500"></div>
             <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <div className="text-slate-500 text-sm font-semibold tracking-wider">NEUROCALC</div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
          >
            <History size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 relative flex flex-col">
          <div className="shrink-0">
             <Display expression={expression} result={result} isError={isError} />
          </div>
          
          <div className="mt-auto">
            <Keypad 
              onInput={handleInput}
              onClear={handleClear}
              onDelete={handleDelete}
              onEqual={calculate}
              onAiSolve={handleAiSolve}
              onGraph={handleGraph}
              onScan={() => setIsScanning(true)}
              canGraph={true} // Always enabled now that we allow manual attempts
            />
          </div>

          {/* Overlays */}
          {isGraphing && (
            <Graph 
              data={graphData} 
              expression={expression} 
              onClose={() => setIsGraphing(false)} 
            />
          )}

          {showAi && (
            <AiResponse 
              content={aiState.text} 
              isLoading={aiState.loading} 
              onClose={() => setShowAi(false)} 
            />
          )}

          {isScanning && (
            <CameraScanner 
              onCapture={handleScanCapture} 
              onClose={() => setIsScanning(false)} 
            />
          )}
        </div>
        
        {/* History Panel (Slide over) */}
        <div className={`absolute inset-y-0 right-0 w-full sm:w-72 bg-slate-900/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 border-l border-slate-800 z-50 ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                <h3 className="text-slate-200 font-bold flex items-center gap-2">
                    <History size={18} className="text-cyan-500"/>
                    History
                </h3>
                <button 
                    onClick={() => setShowHistory(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
              {history.length === 0 && <p className="text-slate-600 text-sm italic text-center mt-10">No history yet</p>}
              {history.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => {
                     if (!item.expression.startsWith('Photo Analysis')) {
                       // Clean labels like AI: or Graph: 
                       let exprToLoad = item.expression.replace('AI: ', '').replace('Plot: ', '').replace('Graph: ', '');
                       setExpression(exprToLoad);
                     }
                     setShowHistory(false);
                  }}
                  className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-800/50 hover:border-slate-700 transition-all group"
                >
                  <div className="text-slate-500 text-xs mb-1 font-mono truncate">{item.expression}</div>
                  <div className={`text-lg font-bold font-mono truncate ${item.isAi ? 'text-violet-400' : 'text-cyan-400'}`}>
                    {item.isAi ? 'AI Solved' : item.result === 'Graph Generated' ? 'Graph' : `= ${item.result}`}
                  </div>
                </button>
              ))}
            </div>
            
            {history.length > 0 && (
              <button 
                 onClick={() => setHistory([])}
                 className="mt-4 py-3 flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 w-full border border-red-900/30 rounded-xl hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={16} />
                Clear History
              </button>
            )}
          </div>
        </div>

      </div>
      
      <footer className="fixed bottom-4 right-4 text-slate-600 text-xs select-none pointer-events-none hidden sm:block">
        Powered by Gemini 3 Pro
      </footer>
    </div>
  );
}

export default App;