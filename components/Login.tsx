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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 card-enter">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700">
        <h1 className="text-3xl font-bold text-red-500 mb-2 text-center tracking-widest uppercase">Privado</h1>
        <p className="text-slate-400 text-center mb-6 font-medium">pedile los datos al gordo lucio para jugar</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Usuario</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Ingrese usuario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Ingrese contraseña"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors mt-4 uppercase tracking-wider"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;