import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { GraphDataPoint } from "../types";
import { X } from "lucide-react";

interface GraphProps {
  data: GraphDataPoint[];
  expression: string;
  onClose: () => void;
}

export const Graph: React.FC<GraphProps> = ({ data, expression, onClose }) => {
  return (
    <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col p-2 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-2 sm:mb-4 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
        <h3 className="text-emerald-400 font-mono text-sm sm:text-lg truncate pr-2">
          y = <span className="text-white">{expression}</span>
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0"
          aria-label="Close"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 w-full bg-slate-900 rounded-xl border border-slate-800 p-1 sm:p-2 shadow-2xl relative overflow-hidden">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, bottom: 10, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="x"
                type="number"
                domain={["auto", "auto"]}
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                tickFormatter={(val) => val.toFixed(0)}
              />
              <YAxis
                stroke="#94a3b8"
                domain={["auto", "auto"]}
                tick={{ fontSize: 12 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  color: "#f8fafc",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#34d399" }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(val: number) => [val.toFixed(3), "y"]}
                labelFormatter={(label) => `x: ${label}`}
              />
              <ReferenceLine y={0} stroke="#64748b" />
              <ReferenceLine x={0} stroke="#64748b" />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "#34d399" }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 flex-col gap-2">
            <div className="p-4 bg-slate-800 rounded-full">
              <X size={32} />
            </div>
            <p>Unable to plot function</p>
          </div>
        )}
      </div>
      <div className="mt-2 sm:mt-4 text-center text-[10px] sm:text-xs text-slate-500 font-mono">
        Range: x [-10, 10]
      </div>
    </div>
  );
};
