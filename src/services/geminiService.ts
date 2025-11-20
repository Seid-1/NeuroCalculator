import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
// API Key must be provided in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const solveWithReasoning = async (expression: string): Promise<string> => {
  try {
    const modelId = 'gemini-3-pro-preview'; // Using Pro for better reasoning capabilities
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `
        You are an expert mathematics tutor and scientific calculator assistant.
        
        Task: Solve the following mathematical problem or expression.
        Input: "${expression}"
        
        Instructions:
        1. If it is a calculation, provide the final result clearly.
        2. Provide a step-by-step explanation of how the result was derived.
        3. If the input implies a concept (e.g., "what is entropy?"), explain it concisely with formulas if applicable.
        4. Use Markdown formatting for readability. Use bolding for the final answer.
        5. Be concise but thorough.
      `,
      config: {
        temperature: 0.2, // Lower temperature for more deterministic/accurate math results
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to the AI service. Please check your connection or API key.";
  }
};

export const solveImageProblem = async (base64Image: string): Promise<string> => {
  try {
    const modelId = 'gemini-3-pro-preview'; // Pro model supports multimodal input

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `You are an expert mathematics tutor.
            Task: Analyze the image provided. It likely contains a mathematical expression, equation, graph, or word problem.
            
            Instructions:
            1. Identify and transcribe the mathematical content from the image.
            2. Solve the problem step-by-step.
            3. If it's a graph, analyze its key features (intercepts, slope, etc.).
            4. Use Markdown formatting.
            5. Provide the final answer clearly.
            `
          }
        ]
      },
      config: {
        temperature: 0.2,
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Vision API Error:", error);
    return "Error: Unable to analyze image. Please check your connection or API key.";
  }
};

export const generateGraphDataPoints = async (functionExpression: string, min: number, max: number, points: number): Promise<{x: number, y: number}[]> => {
   // Although we can do this in JS, sometimes complex functions are harder to parse locally without a heavy library.
   // However, for latency, we will prefer local evaluation in the components. 
   // This service function is reserved if we need AI to generate data for non-standard functions (e.g. "prime number distribution").
   // For now, we will return a placeholder to indicate this should be done locally if possible.
   return [];
};