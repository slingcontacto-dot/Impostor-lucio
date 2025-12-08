import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga variables desde .env si existen localmente
  const env = loadEnv(mode, '.', '');
  
  // En Vercel, las variables de entorno están en process.env
  // Priorizamos process.env (producción) sobre el archivo .env local
  const apiKey = process.env.API_KEY || env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Inyectamos la API KEY para que esté disponible en el código del cliente (navegador)
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});