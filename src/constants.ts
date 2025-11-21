import { CalculatorMode } from "./types";

export const APP_NAME = "NeuroCalc";

export const DEFAULT_GRAPH_RANGE = {
  min: -10,
  max: 10,
  step: 0.5,
};

export const SAMPLE_EQUATIONS = [
  "sin(x) * x",
  "x^2 - 4",
  "log(x) + 2",
  "cos(x) + sin(x)",
];

export const MODES: { label: string; value: CalculatorMode }[] = [
  { label: "Scientific", value: CalculatorMode.SCIENTIFIC },
  { label: "Graphing", value: CalculatorMode.GRAPHING },
  { label: "AI Solver", value: CalculatorMode.AI_CHAT },
];
