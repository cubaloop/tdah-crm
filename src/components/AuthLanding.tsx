import React, { useState } from 'react';
import { ShieldCheck, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';

interface AuthLandingProps {
  onLogin: (user: { email: string; name: string }) => void;
}

export const AuthLanding: React.FC<AuthLandingProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (isRegister && !name.trim()) {
      setError('Por favor ingresa tu nombre o el de tu clínica.');
      return;
    }

    const userName = name.trim() || email.split('@')[0];
    onLogin({ email: email.trim().toLowerCase(), name: userName });
  };

  const handleDemoAccess = () => {
    onLogin({ email: 'demo@tdahcrm.com', name: 'Dr. Alejandro (Demo)' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-slate-950/80 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-cyan-500/20 text-xl">
            🧠
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
              TDAH Clinical CRM <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">Privado & E2EE</span>
            </h1>
            <p className="text-xs text-slate-400">Protección estricta de expedientes clínicos</p>
          </div>
        </div>
        <button
          onClick={handleDemoAccess}
          className="text-xs font-bold text-slate-300 hover:text-cyan-400 border border-white/15 px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
        >
          Probar Entorno de Muestra
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Aislamiento Estricto de Datos Clínicos y Privacidad RGPD
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Gestión clínica enfocada con <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">cero distracciones</span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Un CRM especializado para profesionales de salud mental y neurodiversidad. Los expedientes, notas de evolución y datos de contacto están completamente aislados y encriptados. 
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Cuentas Aisladas
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Al registrarte obtienes tu propio espacio privado sin acceso ni visibilidad de otros profesionales.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Sincronización Dual
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Persistencia local instantánea combinada con copias en la nube y respaldos descargables en 1 clic.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isRegister ? 'Crear Nuevo Espacio Clínico' : 'Acceso a tu Panel Clínico'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRegister ? 'Tus expedientes iniciarán limpios y privados' : 'Ingresa tus credenciales autorizadas'}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 mb-5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nombre del Especialista o Clínica</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Dra. Sofía M. / Clínica NeuroSalud"
                    className="w-full px-4 py-3 bg-slate-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="especialista@clinica.com"
                  className="w-full px-4 py-3 bg-slate-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-slate-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm mt-2"
              >
                {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {isRegister ? 'Crear Cuenta y Comenzar Vacío' : 'Entrar a mi Espacio'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {isRegister ? '¿Ya tienes un espacio registrado? Inicia sesión' : '¿No tienes cuenta? Crea un espacio clínico nuevo'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-500">
        TDAH Clinical CRM &copy; 2026. Cumplimiento de privacidad HIPAA / RGPD. Developed by Tecnoemprende.
      </footer>
    </div>
  );
};
