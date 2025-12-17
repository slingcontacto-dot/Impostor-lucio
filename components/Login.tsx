import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'LucianoDesarrollador' && pass === 'LucianoDesarrollador') {
      onLogin();
    } else {
      setError('CREDENCIALES INVÁLIDAS');
    }
  };

  const handleInstagramRedirect = () => {
    window.open('https://www.instagram.com/lucianomuruaaa/', '_blank');
  };

  const handleCopyCredentials = () => {
    const textToCopy = "LucianoDesarrollador"; // Mismo user y pass
    // Copiamos solo el string que sirve para ambos campos, o podrías copiar un formato completo.
    // Dado que user y pass son iguales, copiar una vez sirve para pegar en ambos.
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyFeedback('¡COPIADO!');
      setTimeout(() => setCopyFeedback(''), 2000);
    }).catch(err => {
      console.error('Error al copiar: ', err);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 card-enter relative overflow-hidden">
      
      {/* CÍRCULOS DE FONDO (DECORATIVOS) */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-orange-600 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-600 rounded-full blur-[80px] opacity-40 animate-pulse delay-700"></div>

      <div className="glass-panel p-8 rounded-3xl w-full max-w-sm relative z-10 border-t border-orange-500/30 shadow-[0_0_50px_rgba(234,88,12,0.3)]">
        
        {/* TÍTULO EXTREMO */}
        <div className="mb-8 text-center relative">
          <div className="absolute inset-0 bg-orange-500 blur-[40px] opacity-20 rounded-full"></div>
          <h1 className="relative text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 leading-[0.9] tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] transform -skew-x-6">
            EL IMPOSTOR<br/>
            <span className="text-white text-glow block mt-1">CORDOBÉS</span>
          </h1>
        </div>
        
        <p className="text-orange-200 text-center mb-8 font-black uppercase text-[10px] tracking-[0.2em] animate-pulse">
          PEDI LOS DATOS AL LUCIO PARA JUGAR
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="block text-[10px] font-bold text-orange-500 mb-1 uppercase tracking-widest group-focus-within:text-white transition-colors">Usuario</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-black/60 border-2 border-slate-800 rounded-xl px-4 py-4 text-white font-bold focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.5)] focus:scale-[1.02] outline-none transition-all duration-300 placeholder-slate-600"
              placeholder="USUARIO"
            />
          </div>
          <div className="group">
            <label className="block text-[10px] font-bold text-orange-500 mb-1 uppercase tracking-widest group-focus-within:text-white transition-colors">Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-black/60 border-2 border-slate-800 rounded-xl px-4 py-4 text-white font-bold focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.5)] focus:scale-[1.02] outline-none transition-all duration-300 placeholder-slate-600"
              placeholder="CONTRASEÑA"
            />
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 p-2 rounded-lg">
              <p className="text-red-400 text-xs text-center font-black uppercase tracking-wide">{error}</p>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <button
              type="submit"
              className="w-full relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.5)] transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-lg group border border-orange-400/30"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                INGRESAR
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 12h14"></path></svg>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            <div className="grid grid-cols-2 gap-2">
                <button
                type="button"
                onClick={() => setShowCredentialsModal(true)}
                className="w-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold py-3 rounded-xl transition-colors uppercase tracking-widest text-[10px] border border-slate-700 flex flex-col items-center justify-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    VER DATOS
                </button>
                
                <button
                type="button"
                onClick={handleCopyCredentials}
                className="w-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold py-3 rounded-xl transition-colors uppercase tracking-widest text-[10px] border border-slate-700 flex flex-col items-center justify-center gap-1 active:bg-orange-500/20 active:border-orange-500"
                >
                    {copyFeedback ? (
                        <span className="text-orange-400 animate-pulse">{copyFeedback}</span>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            COPIAR DATOS
                        </>
                    )}
                </button>
            </div>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/50">
          <button
            type="button"
            onClick={handleInstagramRedirect}
            className="w-full flex items-center justify-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 duration-300"
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

      {/* MODAL EXTREMO */}
      {showCredentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="glass-panel border-2 border-orange-500/50 p-8 rounded-3xl relative max-w-sm w-full shadow-[0_0_50px_rgba(234,88,12,0.4)]">
            <button 
              onClick={() => setShowCredentialsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-8 text-center uppercase tracking-wider italic">
              Access Granted
            </h3>
            
            <div className="space-y-6">
              <div className="bg-black/80 p-5 rounded-2xl border border-orange-900/50 shadow-inner">
                <p className="text-[10px] text-orange-500 uppercase font-black mb-2 tracking-widest">Usuario</p>
                <p className="text-lg font-mono text-white font-bold break-all select-all tracking-wider">LucianoDesarrollador</p>
              </div>
              
              <div className="bg-black/80 p-5 rounded-2xl border border-orange-900/50 shadow-inner">
                <p className="text-[10px] text-orange-500 uppercase font-black mb-2 tracking-widest">Contraseña</p>
                <p className="text-lg font-mono text-white font-bold break-all select-all tracking-wider">LucianoDesarrollador</p>
              </div>
            </div>

            <button 
              onClick={() => setShowCredentialsModal(false)}
              className="w-full mt-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-widest text-xs border-t border-slate-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;