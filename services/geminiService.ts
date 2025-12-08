import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";

// --- DATA DE RESPALDO (OFFLINE) ---
// Se usa si no hay API Key o si la IA falla, para que el juego NUNCA se trabe.
const OFFLINE_DATA: Record<Category, { word: string; hint: string }[]> = {
  [Category.ANIMALS]: [
    { word: "Jirafa", hint: "Altura" },
    { word: "Elefante", hint: "Memoria" },
    { word: "Pingüino", hint: "Frío" },
    { word: "León", hint: "Melena" },
    { word: "Delfín", hint: "Inteligente" }
  ],
  [Category.CLASH_ROYALE]: [
    { word: "Montapuercos", hint: "Salto" },
    { word: "P.E.K.K.A", hint: "Mariposa" },
    { word: "Princesa", hint: "Distancia" },
    { word: "Megacaballero", hint: "Aterrizaje" }
  ],
  [Category.BRAWL_STARS]: [
    { word: "Shelly", hint: "Escopeta" },
    { word: "El Primo", hint: "Luchador" },
    { word: "Spike", hint: "Cactus" },
    { word: "Crow", hint: "Veneno" }
  ],
  [Category.RICH_WOMEN]: [
    { word: "Kim Kardashian", hint: "Reality" },
    { word: "Kylie Jenner", hint: "Labios" },
    { word: "Georgina Rodríguez", hint: "Soy" },
    { word: "Paris Hilton", hint: "Heredera" }
  ],
  [Category.ACTRESSES]: [
    { word: "Angelina Jolie", hint: "Labios" },
    { word: "Scarlett Johansson", hint: "Viuda" },
    { word: "Margot Robbie", hint: "Muñeca" },
    { word: "Jennifer Lawrence", hint: "Juegos" }
  ],
  [Category.SOCCER]: [
    { word: "Lionel Messi", hint: "Cabra" },
    { word: "Cristiano Ronaldo", hint: "Siuuu" },
    { word: "Neymar", hint: "Caídas" },
    { word: "Mbappé", hint: "Tortuga" }
  ],
  [Category.COLORS]: [
    { word: "Rojo", hint: "Pasión" },
    { word: "Azul", hint: "Cielo" },
    { word: "Verde", hint: "Naturaleza" },
    { word: "Amarillo", hint: "Sol" }
  ],
  [Category.NOSOTROS]: [] // Se llena dinámicamente
};

const getRandomOfflineContent = (category: Category): GameContent => {
  const list = OFFLINE_DATA[category];
  if (!list || list.length === 0) {
    return { word: "Mesa", hint: "Mueble" }; // Fallback final
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};

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
    const apiKey = process.env.API_KEY;
    
    // Si no hay API KEY, usamos el modo OFFLINE silenciosamente para que el juego funcione
    if (!apiKey || apiKey.trim() === '') {
      console.warn("Using Offline Mode (Missing API Key)");
      return getRandomOfflineContent(category);
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const context = getCategoryContext(category);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a secret word for the game category: ${category}. Also provide a 'hint' for an impostor.`,
      config: {
        systemInstruction: `You are a game engine for 'The Impostor'. 
        1. Select a random ${context}. 
        2. Generate a 'hint' for the impostor.
        3. CRITICAL: The 'hint' must be SUBTLE, VAGUE, and AMBIGUOUS. It should NOT describe the object directly. It should reference a feeling, a minor detail, or a broad category. It must be HARD to guess the word from the hint alone.
        4. The 'hint' MUST be in Spanish and VERY SHORT (maximum 3 words).
        5. Output MUST be valid JSON.`,
        temperature: 1.3, // Higher temperature for more variety
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

    const jsonText = response.text ? response.text : "{}";
    let data: GameContent;
    
    try {
        data = JSON.parse(jsonText) as GameContent;
    } catch (e) {
        return getRandomOfflineContent(category);
    }
    
    return {
      word: data.word || getRandomOfflineContent(category).word,
      hint: data.hint || "Confía en ti"
    };

  } catch (error) {
    console.error("Error generating content, falling back to offline:", error);
    return getRandomOfflineContent(category);
  }
};

export const generateHintForCustomWord = async (word: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey.trim() === '') return "Di algo vago";

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a subtle impostor hint for the word: "${word}".`,
      config: {
        systemInstruction: "You are a game helper. Provide a SUBTLE, VAGUE Spanish clue (max 3 words) about the word. Do not be obvious.",
        temperature: 1.0,
      }
    });

    const text = response.text ? response.text.trim() : "";
    return text || "Di algo vago";

  } catch (error) {
    return "Di algo vago";
  }
};