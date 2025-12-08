export enum GamePhase {
  LOGIN = 'LOGIN',
  SETUP = 'SETUP',
  LOADING_TOPIC = 'LOADING_TOPIC',
  PASS_DEVICE = 'PASS_DEVICE',
  REVEAL_ROLE = 'REVEAL_ROLE',
  DISCUSSION = 'DISCUSSION'
}

export enum Category {
  ANIMALS = 'Animales',
  CLASH_ROYALE = 'Cartas Clash Royale',
  BRAWL_STARS = 'Cartas Brawl Stars',
  ACTORS = 'Actores',
  ACTRESSES = 'Actrices',
  SOCCER = 'Jugadores de Futbol',
  GAMES = 'Juegos',
  MOVIES = 'Películas',
  CORDOBA = 'Córdoba',
  BRANDS = 'Marcas',
  OBJECTS = 'Cosas / Objetos',
  COLORS = 'Colores',
  COUNTRIES = 'Países',
  APPLICATIONS = 'Aplicaciones',
  NOSOTROS = 'Nosotros (Custom)'
}

export interface Player {
  id: number;
  isImpostor: boolean;
  word: string;
  impostorHint?: string;
}

export interface GameConfig {
  playerCount: number;
  impostorCount: number;
  selectedCategory: Category;
  customNames: string[]; // For "Nosotros"
}