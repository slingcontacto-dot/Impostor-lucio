import { GoogleGenAI, Type } from "@google/genai";
import { Category, Difficulty } from "../types";

// --- GESTIÓN DE HISTORIAL (Evitar Repeticiones) ---
const MAX_HISTORY = 30; // Aumentado para recordar más palabras
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
// Lista MASIVA para garantizar variedad
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
    { word: "Perro", hint: "Amigo" }, { word: "Mariposa", hint: "Oruga" },
    { word: "Hipopótamo", hint: "Río" }, { word: "Rinoceronte", hint: "Cuerno" },
    { word: "Koala", hint: "Eucalipto" }, { word: "Zorro", hint: "Astuto" },
    { word: "Caballo", hint: "Montar" }, { word: "Vaca", hint: "Leche" },
    { word: "Cerdo", hint: "Barro" }, { word: "Mono", hint: "Banana" },
    { word: "Serpiente", hint: "Veneno" }, { word: "Ballena", hint: "Océano" }
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
    { word: "Valquiria", hint: "Giro" }, { word: "Mosquetera", hint: "Disparo" },
    { word: "Gigante", hint: "Tanque" }, { word: "Espejo", hint: "Copia" },
    { word: "Furia", hint: "Morado" }, { word: "Cementerio", hint: "Larrys" },
    { word: "Tronco", hint: "Rueda" }, { word: "Descarga", hint: "Reset" },
    { word: "Sabueso de Lava", hint: "Aéreo" }, { word: "Globo Bombástico", hint: "Bomba" }
  ],
  [Category.BRAWL_STARS]: [
    { word: "Bull", hint: "Matias Velazquez" }, 
    { word: "Angelo", hint: "Ignacio Adami" },   
    { word: "Barley", hint: "Facundo Cabrera" },
    { word: "Shelly", hint: "Básica" }, { word: "El Primo", hint: "Meteorito" },
    { word: "Spike", hint: "Silencio" }, { word: "Crow", hint: "Dagas" },
    { word: "Leon", hint: "Camuflaje" }, { word: "Colt", hint: "Balas" },
    { word: "Jessie", hint: "Torreta" }, { word: "Dynamike", hint: "Explosivo" }, 
    { word: "Mortis", hint: "Pala" }, { word: "Tara", hint: "Cartas" }, 
    { word: "Gene", hint: "Mano" }, { word: "Piper", hint: "Paraguas" }, 
    { word: "Frank", hint: "Martillo" }, { word: "Bibi", hint: "Bate" }, 
    { word: "Bea", hint: "Abeja" }, { word: "Edgar", hint: "Bufanda" }, 
    { word: "Surge", hint: "Mejora" }, { word: "Tick", hint: "Mina" },
    { word: "8-Bit", hint: "Arcade" }, { word: "Emz", hint: "Spray" },
    { word: "Poco", hint: "Guitarra" }, { word: "Rosa", hint: "Escudo" },
    { word: "Rico", hint: "Rebote" }, { word: "Darryl", hint: "Barril" },
    { word: "Penny", hint: "Monedas" }, { word: "Carl", hint: "Pico" }
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
    { word: "Vin Diesel", hint: "Familia" }, { word: "Joaquin Phoenix", hint: "Payaso" },
    { word: "Morgan Freeman", hint: "Dios" }, { word: "Tom Hanks", hint: "Náufrago" },
    { word: "Hugh Jackman", hint: "Garras" }, { word: "Ryan Gosling", hint: "Ken" },
    { word: "Chris Hemsworth", hint: "Martillo" }, { word: "Zac Efron", hint: "Musical" }
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
    { word: "Jennifer Aniston", hint: "Amigos" }, { word: "Sandra Bullock", hint: "Gravedad" },
    { word: "Nicole Kidman", hint: "Australia" }, { word: "Charlize Theron", hint: "Furia" },
    { word: "Anya Taylor-Joy", hint: "Ajedrez" }, { word: "Florence Pugh", hint: "Solsticio" }
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
    { word: "Buffon", hint: "Eterno" }, { word: "Dibu Martínez", hint: "Bailecito" },
    { word: "Kun Agüero", hint: "Twitch" }, { word: "Di María", hint: "Fideo" },
    { word: "Julián Álvarez", hint: "Araña" }, { word: "Dybala", hint: "Joya" },
    { word: "De Paul", hint: "Motor" }, { word: "Harry Kane", hint: "Huracán" }
  ],
  [Category.GAMES]: [
    { word: "Minecraft", hint: "Bloques" }, { word: "FIFA", hint: "EA Sports" },
    { word: "Fortnite", hint: "Bus" }, { word: "GTA V", hint: "Estrellas" },
    { word: "League of Legends", hint: "Grieta" }, { word: "Call of Duty", hint: "Guerra" },
    { word: "Counter Strike", hint: "Bomba" }, { word: "Super Mario Bros", hint: "Hongo" },
    { word: "Among Us", hint: "Nave" }, { word: "Roblox", hint: "Cuadrado" },
    { word: "Clash Royale", hint: "Torres" }, { word: "Rocket League", hint: "Autos" },
    { word: "Pokemon", hint: "Captura" }, { word: "Zelda", hint: "Princesa" },
    { word: "God of War", hint: "Esparta" }, { word: "The Sims", hint: "Vida" },
    { word: "Free Fire", hint: "Isla" }, { word: "Mortal Kombat", hint: "Fatality" },
    { word: "Red Dead Redemption", hint: "Vaquero" }, { word: "Pac-Man", hint: "Fantasmas" },
    { word: "Valorant", hint: "Agentes" }, { word: "Overwatch", hint: "Héroes" },
    { word: "Tetris", hint: "Líneas" }, { word: "Candy Crush", hint: "Dulces" },
    { word: "Elden Ring", hint: "Anillo" }, { word: "Cyberpunk 2077", hint: "Bug" }
  ],
  [Category.MOVIES]: [
    { word: "Rápidos y Furiosos", hint: "Familia" }, { word: "Harry Potter", hint: "Magia" },
    { word: "Avengers", hint: "Gemas" }, { word: "Titanic", hint: "Barco" },
    { word: "Star Wars", hint: "Fuerza" }, { word: "El Rey León", hint: "Ciclo" },
    { word: "Toy Story", hint: "Juguetes" }, { word: "Spider-Man", hint: "Sentido" },
    { word: "Batman", hint: "Noche" }, { word: "Avatar", hint: "Azul" },
    { word: "Shrek", hint: "Pantano" }, { word: "Jurassic Park", hint: "Dino" },
    { word: "El Padrino", hint: "Oferta" }, { word: "Matrix", hint: "Pastilla" },
    { word: "Frozen", hint: "Hielo" }, { word: "Piratas del Caribe", hint: "Perla" },
    { word: "Joker", hint: "Risa" }, { word: "Terminator", hint: "Futuro" },
    { word: "Rocky", hint: "Boxeo" }, { word: "Volver al Futuro", hint: "Auto" },
    { word: "Coco", hint: "Recuérdame" }, { word: "Buscando a Nemo", hint: "Pez" },
    { word: "Los Increíbles", hint: "Traje" }, { word: "Intensamente", hint: "Emociones" },
    { word: "Minions", hint: "Banana" }, { word: "Oppenheimer", hint: "Nuclear" }
  ],
  [Category.CORDOBA]: [
    { word: "Mate", hint: "Verde" }, { word: "Vino con Pritty", hint: "Sodeado" },
    { word: "Fernet con Coca", hint: "70/30" }, { word: "Asado", hint: "Domingo" },
    { word: "Cuarteto", hint: "Tunga Tunga" }, { word: "La Mona Jiménez", hint: "Mandamás" },
    { word: "Rodrigo Bueno", hint: "El Potro" }, { word: "Joda", hint: "Noche" },
    { word: "Baile", hint: "Sargento" }, { word: "Choripán", hint: "Dante" },
    { word: "Talleres", hint: "Matador" }, { word: "Belgrano", hint: "Pirata" },
    { word: "Instituto", hint: "Gloria" }, { word: "Sierras", hint: "Río" },
    { word: "Criollitos", hint: "Panadería" }, { word: "Culiado", hint: "Amigo" },
    { word: "Nueva Córdoba", hint: "Estudiantes" }, { word: "Cañada", hint: "Piedras" },
    { word: "Arco de Córdoba", hint: "Entrada" }, { word: "Barrio Güemes", hint: "Cheto" },
    { word: "Carlos Paz", hint: "Reloj" }, { word: "Cosquín", hint: "Rock" },
    { word: "Jesús María", hint: "Doma" }, { word: "Kempes", hint: "Estadio" },
    { word: "Peperina", hint: "Yuyo" }, { word: "Alberdi", hint: "Barrio" }
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
    { word: "Fucsia", hint: "Intenso" }, { word: "Cian", hint: "Impresora" },
    { word: "Crema", hint: "Café" }, { word: "Coral", hint: "Arrecife" },
    { word: "Índigo", hint: "Jeans" }, { word: "Lima", hint: "Ácido" },
    { word: "Oliva", hint: "Aceite" }, { word: "Salmón", hint: "Pez" }
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
    { word: "Lápiz", hint: "Escribir" }, { word: "Tijera", hint: "Cortar" },
    { word: "Computadora", hint: "Teclado" }, { word: "Televisor", hint: "Canales" },
    { word: "Sartén", hint: "Cocina" }, { word: "Microondas", hint: "Calentar" },
    { word: "Ventilador", hint: "Viento" }, { word: "Paraguas", hint: "Lluvia" }
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
    { word: "Lego", hint: "Bloques" }, { word: "Marvel", hint: "Héroes" },
    { word: "Tesla", hint: "Eléctrico" }, { word: "Microsoft", hint: "Ventanas" },
    { word: "Pepsi", hint: "Azul" }, { word: "Ford", hint: "Camioneta" },
    { word: "Honda", hint: "H" }, { word: "Louis Vuitton", hint: "Bolsos" }
  ],
  [Category.COUNTRIES]: [
    { word: "Argentina", hint: "Asado" }, { word: "Brasil", hint: "Samba" },
    { word: "Italia", hint: "Pasta" }, { word: "Francia", hint: "Torre" },
    { word: "España", hint: "Paella" }, { word: "México", hint: "Tacos" },
    { word: "Estados Unidos", hint: "Hamburguesa" }, { word: "Japón", hint: "Sushi" },
    { word: "China", hint: "Arroz" }, { word: "Alemania", hint: "Cerveza" },
    { word: "Inglaterra", hint: "Té" }, { word: "Rusia", hint: "Vodka" },
    { word: "Colombia", hint: "Café" }, { word: "Perú", hint: "Ceviche" },
    { word: "Venezuela", hint: "Arepa" }, { word: "Chile", hint: "Vino" },
    { word: "Uruguay", hint: "Mate" }, { word: "Egipto", hint: "Pirámide" },
    { word: "Australia", hint: "Canguro" }, { word: "Canadá", hint: "Arce" },
    { word: "India", hint: "Curry" }, { word: "Turquía", hint: "Kebab" },
    { word: "Grecia", hint: "Yogur" }, { word: "Sudáfrica", hint: "Safari" },
    { word: "Corea del Sur", hint: "K-Pop" }, { word: "Cuba", hint: "Habano" }
  ],
  [Category.APPLICATIONS]: [
    { word: "WhatsApp", hint: "Mensaje" }, { word: "Instagram", hint: "Stories" },
    { word: "TikTok", hint: "Baila" }, { word: "Facebook", hint: "Azul" },
    { word: "YouTube", hint: "Video" }, { word: "Spotify", hint: "Playlist" },
    { word: "Twitter", hint: "Pájaro" }, { word: "Snapchat", hint: "Fantasma" },
    { word: "Netflix", hint: "Películas" }, { word: "Tinder", hint: "Match" },
    { word: "Google Maps", hint: "Ubicación" }, { word: "Uber", hint: "Auto" },
    { word: "PedidosYa", hint: "Delivery" }, { word: "Mercado Libre", hint: "Envío" },
    { word: "Zoom", hint: "Reunión" }, { word: "Pinterest", hint: "Tablero" },
    { word: "Telegram", hint: "Avión" }, { word: "Discord", hint: "Gamer" },
    { word: "Duolingo", hint: "Búho" }, { word: "Gmail", hint: "Correo" },
    { word: "Twitch", hint: "Vivo" }, { word: "LinkedIn", hint: "Trabajo" },
    { word: "Waze", hint: "Policía" }, { word: "Canva", hint: "Diseño" },
    { word: "Shazam", hint: "Música" }, { word: "CapCut", hint: "Edición" }
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

// Mezclador de Array (Fisher-Yates Shuffle) para aleatoriedad real
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

const getRandomOfflineContent = (category: Category, difficulty: Difficulty): GameContent => {
  const list = OFFLINE_DATA[category];
  // Fallback si no hay lista
  if (!list || list.length === 0) {
    return { word: "Mesa", hint: "Mueble" };
  }

  const usedWords = getUsedWords(category);
  // Filtrar palabras ya usadas
  let available = list.filter(item => !usedWords.includes(item.word));

  // Si nos quedamos sin palabras, reseteamos el historial y usamos toda la lista de nuevo
  if (available.length === 0) {
    clearHistory(category);
    available = [...list];
  }

  // BARAJAR las disponibles para evitar que siempre salgan en el mismo orden (e.g. Rojo primero)
  // Esto soluciona el problema de "siempre sale lo mismo al reiniciar"
  available = shuffleArray(available);

  // Elegir la primera del array ya barajado
  const selection = available[0];

  // Guardar en historial
  addWordToHistory(category, selection.word);
  
  let finalHint = selection.hint;

  // Ajustar pista según dificultad (simulado para offline)
  if (difficulty === 'hard') {
    // En difícil offline, a veces ocultamos la pista o la hacemos genérica
    if (Math.random() > 0.5) finalHint = "Confía en tu instinto"; 
  }

  return { 
    word: selection.word, 
    hint: applyCustomOverrides(selection.word, finalHint) 
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
    case Category.CORDOBA: return "cultural reference, slang, place or person from Córdoba, Argentina";
    case Category.GAMES: return "famous video game title";
    case Category.MOVIES: return "famous movie title";
    case Category.COLORS: return "color name";
    case Category.COUNTRIES: return "famous country name";
    case Category.APPLICATIONS: return "famous mobile app name";
    default: return "common object";
  }
};

interface GameContent {
  word: string;
  hint: string;
}

export const generateGameContent = async (category: Category, difficulty: Difficulty): Promise<GameContent> => {
  try {
    const apiKey = process.env.API_KEY;
    
    // Si no hay API KEY, usamos el modo OFFLINE
    if (!apiKey || apiKey.trim() === '') {
      console.warn("Using Offline Mode (Missing API Key)");
      return getRandomOfflineContent(category, difficulty);
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const context = getCategoryContext(category);
    const usedWords = getUsedWords(category);
    
    // Le decimos a la IA qué palabras NO usar
    const exclusionText = usedWords.length > 0 
      ? `DO NOT use any of these words: ${usedWords.join(', ')}.` 
      : "";

    // Instrucción de dificultad
    let difficultyInstruction = "";
    switch (difficulty) {
      case 'easy':
        difficultyInstruction = "The 'hint' must be VERY EASY, direct, and obvious. A clear synonym or description.";
        break;
      case 'medium':
        difficultyInstruction = "The 'hint' must be SUBTLE but helpful. A related concept.";
        break;
      case 'hard':
        difficultyInstruction = "The 'hint' must be VERY ABSTRACT, VAGUE, and misleading. Almost impossible to guess the word from it.";
        break;
      case 'none':
        difficultyInstruction = "The 'hint' is irrelevant.";
        break;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a secret word for the game category: ${category}. Also provide a 'hint' for an impostor. 
      ${exclusionText}`,
      config: {
        systemInstruction: `You are a game engine for 'The Impostor'. 
        1. Select a random ${context} in Spanish. 
        2. Generate a 'hint' for the impostor based on difficulty: ${difficulty}.
        3. The 'hint' MUST be in Spanish and VERY SHORT (maximum 3 words).
        4. Output MUST be valid JSON.`,
        temperature: 1.6, // Muy alta temperatura para máxima aleatoriedad
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
        return getRandomOfflineContent(category, difficulty);
    }
    
    const finalWord = data.word || getRandomOfflineContent(category, difficulty).word;
    let finalHint = data.hint || "Confía en ti";

    // Aplicar Override de Pistas especiales (Easter Eggs) incluso si viene de la IA
    finalHint = applyCustomOverrides(finalWord, finalHint);

    // Guardamos la palabra generada por IA en el historial local también
    addWordToHistory(category, finalWord);

    return { word: finalWord, hint: finalHint };

  } catch (error) {
    console.error("Error generating content, falling back to offline:", error);
    return getRandomOfflineContent(category, difficulty);
  }
};

export const generateHintForCustomWord = async (word: string, difficulty: Difficulty): Promise<string> => {
  try {
    // Verificar overrides antes de llamar a la IA
    const override = applyCustomOverrides(word, "");
    if (override) return override;

    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey.trim() === '') return "Sé discreto";

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    let difficultyPrompt = "Provide a subtle clue.";
    if (difficulty === 'easy') difficultyPrompt = "Provide an OBVIOUS clue.";
    if (difficulty === 'hard') difficultyPrompt = "Provide a very VAGUE and ABSTRACT clue.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate an impostor hint for the word: "${word}".`,
      config: {
        systemInstruction: `You are a game helper. ${difficultyPrompt} Spanish. Max 3 words.`,
        temperature: 1.0,
      }
    });

    const text = response.text ? response.text.trim() : "";
    return text || "Sé discreto";

  } catch (error) {
    return "Sé discreto";
  }
};