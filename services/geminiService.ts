import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";

// Helper to get specific context for the category
const getCategoryContext = (category: Category): string => {
  switch (category) {
    case Category.ANIMALS:
      return "animal name in Spanish";
    case Category.CLASH_ROYALE:
      return "Clash Royale card name in Spanish";
    case Category.BRAWL_STARS:
      return "Brawl Stars brawler name";
    case Category.RICH_WOMEN:
      return "famous wealthy woman or female celebrity known for luxury";
    case Category.ACTRESSES:
      return "famous popular actress (Hollywood or International)";
    case Category.SOCCER:
      return "famous football (soccer) player";
    case Category.COLORS:
      return "color name in Spanish";
    default:
      return "common object word in Spanish";
  }
};

interface GameContent {
  word: string;
  hint: string;
}

export const generateGameContent = async (category: Category): Promise<GameContent> => {
  try {
    if (!process.env.API_KEY) {
      console.warn("No API KEY found");
      return { word: "API Key Missing", hint: "Check config" };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const context = getCategoryContext(category);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a secret word for the game category: ${category}. Also provide a 'hint' for an impostor that is very closely related to the word but not the word itself.`,
      config: {
        systemInstruction: `You are a game engine for 'The Impostor'. 
        1. Select a random ${context}. 
        2. Generate a 'hint' that describes a key characteristic or visual trait.
        3. IMPORTANT: The 'hint' MUST be in Spanish and VERY SHORT (maximum 4 words).
        4. Output MUST be valid JSON.`,
        temperature: 1.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            hint: { type: Type.STRING }
          },
          required: ["word", "hint"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText) as GameContent;
    
    return {
      word: data.word || "Error",
      hint: data.hint || "Sin pista"
    };

  } catch (error) {
    console.error("Error generating content:", error);
    return { word: "Error Conexión", hint: "Intenta de nuevo" };
  }
};

export const generateHintForCustomWord = async (word: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) return "Sin pista (No API Key)";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a helpful hint for the word: "${word}" for an impostor game.`,
      config: {
        systemInstruction: "You are a game helper. Provide a VERY SHORT clue (max 4 words) in Spanish about the given word so an impostor can pretend they know it.",
        temperature: 1.0,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating custom hint:", error);
    return "Juega con confianza";
  }
};