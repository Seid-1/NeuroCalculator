import React from "react";
import { X, Loader2, Sparkles } from "lucide-react";

interface AiResponseProps {
  content: string;
  isLoading: boolean;
  onClose: () => void;
}

export const AiResponse: React.FC<AiResponseProps> = ({
  content,
  isLoading,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col p-4 backdrop-blur-md animate-in slide-in-from-bottom-10 duration-300">
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-violet-400">
          <Sparkles size={20} />
          <h3 className="font-bold text-lg">AI Analysis</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
            <Loader2 size={48} className="animate-spin text-violet-500" />
            <p className="animate-pulse">Consulting neural network...</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-slate max-w-none">
            {/* Simple Markdown rendering */}
            {content.split("\n").map((line, i) => {
              if (line.startsWith("### "))
                return (
                  <h3
                    key={i}
                    className="text-violet-300 font-bold mt-4 mb-2 text-lg"
                  >
                    {line.replace("### ", "")}
                  </h3>
                );
              if (line.startsWith("## "))
                return (
                  <h2
                    key={i}
                    className="text-violet-300 font-bold mt-6 mb-3 text-xl border-b border-slate-700 pb-1"
                  >
                    {line.replace("## ", "")}
                  </h2>
                );
              if (line.startsWith("**") && line.endsWith("**"))
                return (
                  <p key={i} className="font-bold text-white my-2">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              if (line.startsWith("- "))
                return (
                  <li key={i} className="ml-4 text-slate-300 my-1">
                    {line.replace("- ", "")}
                  </li>
                );
              return (
                <p key={i} className="text-slate-300 my-2 leading-relaxed">
                  {line}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
