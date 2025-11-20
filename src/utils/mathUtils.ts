import * as math from 'mathjs';
import { GraphDataPoint } from '../types';

// Helper to clean up expression for mathjs
export const sanitizeExpression = (expression: string): string => {
  return expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/\^/g, '^')
    // Add implicit multiplication: 2x -> 2*x, 2( -> 2*(, )x -> )*x
    .replace(/(\d)([a-zA-Z(])/g, '$1*$2')
    .replace(/(\))([a-zA-Z0-9])/g, '$1*$2');
};

export const evaluateExpression = (expression: string): string => {
  try {
    const sanitized = sanitizeExpression(expression);
    const result = math.evaluate(sanitized);
    
    if (typeof result === 'number') {
      // Check for very small numbers that should be 0
      if (Math.abs(result) < 1e-10) return '0';
      return math.format(result, { precision: 14 });
    }
    return result.toString();
  } catch (error) {
    throw new Error("Invalid Expression");
  }
};

export const generatePoints = (expression: string, min: number, max: number, step: number): GraphDataPoint[] => {
  const points: GraphDataPoint[] = [];
  try {
    const sanitized = sanitizeExpression(expression);
    const compiled = math.compile(sanitized);
    
    for (let x = min; x <= max; x += step) {
      try {
        // Mathjs scope requires 'x'
        const y = compiled.evaluate({ x });
        
        // Ensure y is a finite number (handle asymptotes/division by zero)
        if (typeof y === 'number' && isFinite(y)) {
          // Clamp values to avoid graph distortion from extreme outliers
          const clampedY = Math.max(Math.min(y, 1000), -1000);
          points.push({ x, y: clampedY });
        } else {
            // Push null or skip to create gaps in line? Recharts handles missing points well if skipped
        }
      } catch (e) {
        // Skip points where evaluation fails
      }
    }
  } catch (e) {
    console.error("Failed to compile function for graphing", e);
  }
  return points;
};

export const isGraphable = (expression: string): boolean => {
  // Simple check: contains x. 
  // More complex check could try to compile it with x variable.
  return expression.includes('x');
};