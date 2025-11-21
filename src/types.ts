export enum CalculatorMode {
  BASIC = 'BASIC',
  SCIENTIFIC = 'SCIENTIFIC',
  GRAPHING = 'GRAPHING',
  AI_CHAT = 'AI_CHAT'
}

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  isAi: boolean;
}

export interface GraphDataPoint {
  x: number;
  y: number;
}

export type ThemeColor = 'cyan' | 'purple' | 'emerald' | 'orange';

export interface AiResponseState {
  text: string;
  loading: boolean;
  error: string | null;
}
