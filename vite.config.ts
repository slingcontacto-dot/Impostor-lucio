import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Al tener @types/node instalado, process está definido.
  // Usamos '.' en lugar de process.cwd() para cargar las variables del archivo .env si existe localmente.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Inyectamos la API KEY para que esté disponible en el código del cliente (navegador)
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});