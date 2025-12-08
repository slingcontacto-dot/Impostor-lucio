import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.toLowerCase() === 'lucionazi' && pass === 'lucionazi') {
      onLogin();
    } else {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  const handleInstagramRedirect = () => {
    window.open('https://www.instagram.com/lucianomuruaaa/', '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 card-enter">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700 relative z-10">
        {/* TÍTULO EN DOS LÍNEAS PARA QUE ENTRE BIEN EN MÓVIL */}
        <h1 className="text-3xl md:text-4xl font-black text-red-600 mb-4 text-center tracking-widest uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] leading-tight">
          EL IMPOSTOR<br/>CORDOBÉS
        </h1>
        
        {/* TEXTO EN MAYUSCULAS */}
        <p className="text-slate-400 text-center mb-6 font-bold uppercase text-xs tracking-widest">
          PEDI LOS DATOS AL LUCIO PARA JUGAR
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1 uppercase tracking-wide">Usuario</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg px-4 py-3 text-white font-bold focus:border-red-500 focus:ring-0 outline-none transition-colors"
              placeholder="INGRESE USUARIO"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1 uppercase tracking-wide">Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg px-4 py-3 text-white font-bold focus:border-red-500 focus:ring-0 outline-none transition-colors"
              placeholder="INGRESE CONTRASEÑA"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center font-bold bg-red-900/20 p-2 rounded">{error}</p>}

          <div className="space-y-3 pt-4">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition-transform active:scale-95 uppercase tracking-widest shadow-lg text-lg border-b-4 border-red-800"
            >
              Ingresar
            </button>

            <button
              type="button"
              onClick={handleInstagramRedirect}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors uppercase tracking-wider shadow-md text-xs border-b-4 border-slate-800"
            >
              Pedir datos para jugar
            </button>
          </div>
        </form>

        {/* BOTON SUGERIR CAMBIOS */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <button
            type="button"
            onClick={handleInstagramRedirect}
            className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            Sugerir Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;