import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";

// --- GESTIÓN DE HISTORIAL (Evitar Repeticiones) ---
const MAX_HISTORY = 15; // Recordar las últimas 15 palabras
const getHistoryKey = (category: Category) => `impostor_history_${category}`;

const getUsedWords = (category: Category): string[] => {
  try {
    const stored = localStorage.getItem(getHistoryKey(category));
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const addWordToHistory = (category: Category, word: string) => {
  try {
    const current = getUsedWords(category);
    // Agregamos al inicio y cortamos si excede el máximo
    const updated = [word, ...current].slice(0, MAX_HISTORY);
    localStorage.setItem(getHistoryKey(category), JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving history", e);
  }
};

const clearHistory = (category: Category) => {
  localStorage.removeItem(getHistoryKey(category));
};

// --- DATA DE RESPALDO (OFFLINE) ---
// Lista ampliada para garantizar variedad sin API Key
const OFFLINE_DATA: Record<Category, { word: string; hint: string }[]> = {
  [Category.ANIMALS]: [
    { word: "Jirafa", hint: "Cuello" }, { word: "Elefante", hint: "Trompa" },
    { word: "Pingüino", hint: "Frac" }, { word: "León", hint: "Rey" },
    { word: "Delfín", hint: "Salto" }, { word: "Tigre", hint: "Rayas" },
    { word: "Águila", hint: "Vuelo" }, { word: "Tiburón", hint: "Aleta" },
    { word: "Lobo", hint: "Luna" }, { word: "Oso", hint: "Miel" },
    { word: "Canguro", hint: "Bolsa" }, { word: "Cocodrilo", hint: "Río" },
    { word: "Murciélago", hint: "Noche" }, { word: "Panda", hint: "Bambú" },
    { word: "Zebra", hint: "Blanco y negro" }, { word: "Camello", hint: "Joroba" },
    { word: "Pulpo", hint: "Tinta" }, { word: "Gato", hint: "Vidas" },
    { word: "Perro", hint: "Amigo" }, { word: "Mariposa", hint: "Oruga" }
  ],
  [Category.CLASH_ROYALE]: [
    { word: "Montapuercos", hint: "Grito" }, { word: "P.E.K.K.A", hint: "Mariposa" },
    { word: "Princesa", hint: "Fuego" }, { word: "Megacaballero", hint: "Salto" },
    { word: "Ejército de Esqueletos", hint: "Multitud" }, { word: "Barril de Duendes", hint: "Vuelo" },
    { word: "Mago Eléctrico", hint: "Zap" }, { word: "Minero", hint: "Tierra" },
    { word: "Gigante Noble", hint: "Cañón" }, { word: "Bandida", hint: "Dash" },
    { word: "Gólem", hint: "Roca" }, { word: "Dragón Infernal", hint: "Rayo" },
    { word: "Leñador", hint: "Furia" }, { word: "Bruja Nocturna", hint: "Murciélagos" },
    { word: "Arquero Mágico", hint: "Geometría" }, { word: "Chispitas", hint: "Carga" },
    { word: "Fantasma Real", hint: "Invisible" }, { word: "Pescador", hint: "Anzuelo" },
    { word: "Valquiria", hint: "Giro" }, { word: "Mosquetera", hint: "Disparo" }
  ],
  [Category.BRAWL_STARS]: [
    { word: "Bull", hint: "Matias Velazquez" }, // CUSTOM OVERRIDE
    { word: "Angelo", hint: "Ignacio Adami" },   // CUSTOM OVERRIDE
    { word: "Barley", hint: "Facundo Cabrera" }, // CUSTOM OVERRIDE
    { word: "Shelly", hint: "Básica" }, { word: "El Primo", hint: "Meteorito" },
    { word: "Spike", hint: "Silencio" }, { word: "Crow", hint: "Dagas" },
    { word: "Leon", hint: "Camuflaje" }, { word: "Colt", hint: "Balas" },
    { word: "Jessie", hint: "Torreta" }, { word: "Dynamike", hint: "Explosivo" }, 
    { word: "Mortis", hint: "Pala" }, { word: "Tara", hint: "Cartas" }, 
    { word: "Gene", hint: "Mano" }, { word: "Piper", hint: "Paraguas" }, 
    { word: "Frank", hint: "Martillo" }, { word: "Bibi", hint: "Bate" }, 
    { word: "Bea", hint: "Abeja" }, { word: "Edgar", hint: "Bufanda" }, 
    { word: "Surge", hint: "Mejora" }
  ],
  [Category.ACTORS]: [
    { word: "Leonardo DiCaprio", hint: "Titanic" }, { word: "Brad Pitt", hint: "Rubio" },
    { word: "Tom Cruise", hint: "Misión" }, { word: "Johnny Depp", hint: "Pirata" },
    { word: "Robert Downey Jr", hint: "Hierro" }, { word: "Will Smith", hint: "Príncipe" },
    { word: "Dwayne Johnson", hint: "Roca" }, { word: "Ryan Reynolds", hint: "Rojo" },
    { word: "Cillian Murphy", hint: "Bomba" }, { word: "Henry Cavill", hint: "Capa" },
    { word: "Pedro Pascal", hint: "Casco" }, { word: "Guillermo Francella", hint: "Bigote" },
    { word: "Ricardo Darín", hint: "Secreto" }, { word: "Adam Sandler", hint: "Comedia" },
    { word: "Jim Carrey", hint: "Muecas" }, { word: "Keanu Reeves", hint: "Matrix" },
    { word: "Chris Evans", hint: "Escudo" }, { word: "Tom Holland", hint: "Araña" },
    { word: "Vin Diesel", hint: "Familia" }, { word: "Joaquin Phoenix", hint: "Payaso" }
  ],
  [Category.ACTRESSES]: [
    { word: "Angelina Jolie", hint: "Maléfica" }, { word: "Scarlett Johansson", hint: "Vengadora" },
    { word: "Margot Robbie", hint: "Barbie" }, { word: "Jennifer Lawrence", hint: "Hambre" },
    { word: "Emma Stone", hint: "La La Land" }, { word: "Zendaya", hint: "Araña" },
    { word: "Anne Hathaway", hint: "Diablo" }, { word: "Meryl Streep", hint: "Leyenda" },
    { word: "Julia Roberts", hint: "Mujer" }, { word: "Ana de Armas", hint: "Rubia" },
    { word: "Salma Hayek", hint: "Frida" }, { word: "Penélope Cruz", hint: "España" },
    { word: "Emma Watson", hint: "Magia" }, { word: "Gal Gadot", hint: "Maravilla" },
    { word: "Natalie Portman", hint: "Cisne" }, { word: "Mila Kunis", hint: "Ted" },
    { word: "Megan Fox", hint: "Robot" }, { word: "Cameron Diaz", hint: "Máscara" },
    { word: "Jennifer Aniston", hint: "Amigos" }, { word: "Sandra Bullock", hint: "Gravedad" }
  ],
  [Category.SOCCER]: [
    { word: "Lionel Messi", hint: "Diez" }, { word: "Cristiano Ronaldo", hint: "Bicho" },
    { word: "Neymar", hint: "Santos" }, { word: "Mbappé", hint: "Francia" },
    { word: "Haaland", hint: "Robot" }, { word: "Vinicius Jr", hint: "Baile" },
    { word: "Maradona", hint: "Mano" }, { word: "Pelé", hint: "Rey" },
    { word: "Ronaldinho", hint: "Sonrisa" }, { word: "Zidane", hint: "Cabezazo" },
    { word: "Bellingham", hint: "Hey Jude" }, { word: "Modric", hint: "Mago" },
    { word: "Lewandowski", hint: "Gol" }, { word: "Benzema", hint: "Gato" },
    { word: "Suárez", hint: "Mordisco" }, { word: "Ramos", hint: "Noventa" },
    { word: "Iniesta", hint: "Gol" }, { word: "Xavi", hint: "Pase" },
    { word: "Buffon", hint: "Eterno" }, { word: "Dibu Martínez", hint: "Bailecito" }
  ],
  [Category.COLORS]: [
    { word: "Rojo", hint: "Sangre" }, { word: "Azul", hint: "Mar" },
    { word: "Verde", hint: "Pasto" }, { word: "Amarillo", hint: "Luz" },
    { word: "Negro", hint: "Oscuridad" }, { word: "Blanco", hint: "Nieve" },
    { word: "Rosa", hint: "Pantera" }, { word: "Violeta", hint: "Flor" },
    { word: "Naranja", hint: "Fruta" }, { word: "Gris", hint: "Nube" },
    { word: "Marrón", hint: "Tierra" }, { word: "Celeste", hint: "Bandera" },
    { word: "Dorado", hint: "Oro" }, { word: "Plateado", hint: "Medalla" },
    { word: "Turquesa", hint: "Piedra" }, { word: "Beige", hint: "Arena" },
    { word: "Bordó", hint: "Vino" }, { word: "Lila", hint: "Suave" },
    { word: "Fucsia", hint: "Intenso" }, { word: "Cian", hint: "Impresora" }
  ],
  [Category.OBJECTS]: [
    { word: "Silla", hint: "Sentarse" }, { word: "Mesa", hint: "Comer" },
    { word: "Cuchara", hint: "Sopa" }, { word: "Tenedor", hint: "Pinchos" },
    { word: "Cama", hint: "Dormir" }, { word: "Almohada", hint: "Cabeza" },
    { word: "Llave", hint: "Puerta" }, { word: "Teléfono", hint: "Llamada" },
    { word: "Vaso", hint: "Agua" }, { word: "Botella", hint: "Plástico" },
    { word: "Zapatilla", hint: "Pie" }, { word: "Reloj", hint: "Tiempo" },
    { word: "Lámpara", hint: "Luz" }, { word: "Espejo", hint: "Reflejo" },
    { word: "Peine", hint: "Pelo" }, { word: "Cepillo de Dientes", hint: "Boca" },
    { word: "Toalla", hint: "Secar" }, { word: "Mochila", hint: "Espalda" },
    { word: "Lápiz", hint: "Escribir" }, { word: "Tijera", hint: "Cortar" }
  ],
  [Category.BRANDS]: [
    { word: "Coca-Cola", hint: "Refresco" }, { word: "Nike", hint: "Pipa" },
    { word: "Adidas", hint: "Rayas" }, { word: "Apple", hint: "Manzana" },
    { word: "Samsung", hint: "Galaxia" }, { word: "McDonald's", hint: "M" },
    { word: "Burger King", hint: "Rey" }, { word: "Disney", hint: "Ratón" },
    { word: "Netflix", hint: "Streaming" }, { word: "Google", hint: "Buscador" },
    { word: "Toyota", hint: "Auto" }, { word: "Ferrari", hint: "Caballo" },
    { word: "Amazon", hint: "Caja" }, { word: "PlayStation", hint: "Consola" },
    { word: "Starbucks", hint: "Café" }, { word: "Zara", hint: "Ropa" },
    { word: "Gucci", hint: "Lujo" }, { word: "Rolex", hint: "Reloj" },
    { word: "Lego", hint: "Bloques" }, { word: "Marvel", hint: "Héroes" }
  ],
  [Category.NOSOTROS]: [] // Se llena dinámicamente
};

// Función para forzar pistas personalizadas (Easter Eggs)
const applyCustomOverrides = (word: string, currentHint: string): string => {
  const lowerWord = word.toLowerCase().trim();
  
  if (lowerWord === 'bull') return "Matias Velazquez";
  if (lowerWord === 'angelo') return "Ignacio Adami";
  if (lowerWord === 'barley' || lowerWord === 'barrley') return "Facundo Cabrera";
  
  return currentHint;
};

const getRandomOfflineContent = (category: Category): GameContent => {
  const list = OFFLINE_DATA[category];
  if (!list || list.length === 0) {
    return { word: "Mesa", hint: "Mueble" };
  }

  const usedWords = getUsedWords(category);
  // Filtrar palabras que ya se usaron
  const available = list.filter(item => !usedWords.includes(item.word));

  let selection;
  if (available.length === 0) {
    // Si ya usamos todas, limpiamos historial y elegimos cualquiera de la lista completa
    clearHistory(category);
    selection = list[Math.floor(Math.random() * list.length)];
  } else {
    // Elegir una de las disponibles
    selection = available[Math.floor(Math.random() * available.length)];
  }

  // Guardar en historial
  addWordToHistory(category, selection.word);
  
  // Aplicar override de pistas especiales si es necesario
  return { 
    word: selection.word, 
    hint: applyCustomOverrides(selection.word, selection.hint) 
  };
};

// Helper to get specific context for the category
const getCategoryContext = (category: Category): string => {
  switch (category) {
    case Category.ANIMALS: return "animal name";
    case Category.CLASH_ROYALE: return "Clash Royale card name";
    case Category.BRAWL_STARS: return "Brawl Stars brawler name";
    case Category.ACTORS: return "famous actor";
    case Category.ACTRESSES: return "famous popular actress";
    case Category.SOCCER: return "famous football player";
    case Category.BRANDS: return "famous global brand";
    case Category.OBJECTS: return "common everyday object";
    case Category.COLORS: return "color name";
    default: return "common object";
  }
};

interface GameContent {
  word: string;
  hint: string;
}

export const generateGameContent = async (category: Category): Promise<GameContent> => {
  try {
    const apiKey = process.env.API_KEY;
    
    // Si no hay API KEY, usamos el modo OFFLINE
    if (!apiKey || apiKey.trim() === '') {
      console.warn("Using Offline Mode (Missing API Key)");
      return getRandomOfflineContent(category);
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const context = getCategoryContext(category);
    const usedWords = getUsedWords(category);
    
    // Le decimos a la IA qué palabras NO usar
    const exclusionText = usedWords.length > 0 
      ? `DO NOT use any of these words: ${usedWords.join(', ')}.` 
      : "";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a secret word for the game category: ${category}. Also provide a 'hint' for an impostor. 
      ${exclusionText}`,
      config: {
        systemInstruction: `You are a game engine for 'The Impostor'. 
        1. Select a random ${context} in Spanish. 
        2. Generate a 'hint' for the impostor.
        3. CRITICAL: The 'hint' must be SUBTLE, VAGUE, and AMBIGUOUS. 
        4. The 'hint' MUST be in Spanish and VERY SHORT (maximum 3 words).
        5. Output MUST be valid JSON.`,
        temperature: 1.5, // Alta temperatura para variedad
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
    let data: GameContent;
    
    try {
        data = JSON.parse(jsonText) as GameContent;
    } catch (e) {
        return getRandomOfflineContent(category);
    }
    
    const finalWord = data.word || getRandomOfflineContent(category).word;
    let finalHint = data.hint || "Confía en ti";

    // Aplicar Override de Pistas especiales (Easter Eggs) incluso si viene de la IA
    finalHint = applyCustomOverrides(finalWord, finalHint);

    // Guardamos la palabra generada por IA en el historial local también
    addWordToHistory(category, finalWord);

    return { word: finalWord, hint: finalHint };

  } catch (error) {
    console.error("Error generating content, falling back to offline:", error);
    return getRandomOfflineContent(category);
  }
};

export const generateHintForCustomWord = async (word: string): Promise<string> => {
  try {
    // Verificar overrides antes de llamar a la IA
    const override = applyCustomOverrides(word, "");
    if (override) return override;

    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey.trim() === '') return "Sé discreto";

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
    return text || "Sé discreto";

  } catch (error) {
    return "Sé discreto";
  }
};