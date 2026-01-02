
import React, { useState, useEffect } from 'react';
import Portal from './components/Portal';
import ClassView from './components/ClassView';
import { Lesson, UserSession } from './types';
import Button from './components/Button';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loginStep, setLoginStep] = useState<'name' | 'password' | null>('name');
  const [pendingLesson, setPendingLesson] = useState<Lesson | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('edu_session');
    if (saved) {
      setSession(JSON.parse(saved));
      setLoginStep(null);
    }
  }, []);

  const handleStart = () => {
    if (!nameInput.trim()) return;
    const s = { nome: nameInput };
    setSession(s);
    sessionStorage.setItem('edu_session', JSON.stringify(s));
    setLoginStep(null);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setPendingLesson(lesson);
    setLoginStep('password');
  };

  const handleUnlock = () => {
    if (passInput === pendingLesson?.senha) {
      setSelectedLesson(pendingLesson);
      setLoginStep(null);
      setError('');
      setPassInput('');
    } else {
      setError('Clave incorrecta.');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('edu_session');
    setSession(null);
    setSelectedLesson(null);
    setLoginStep('name');
    setNameInput('');
    setPassInput('');
  };

  if (loginStep === 'name') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl max-w-md w-full border border-slate-100 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl mb-8 mx-auto shadow-2xl rotate-3">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Bienvenido</h1>
          <p className="text-slate-500 mb-10 font-medium">Ingrese su nombre para continuar.</p>
          <div className="space-y-6">
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all text-xl font-bold text-center"
              placeholder="Su Nombre"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            />
            <Button onClick={handleStart} className="w-full py-5 text-lg" disabled={!nameInput.trim()}>
              Entrar <i className="fas fa-chevron-right ml-2"></i>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loginStep === 'password') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full animate-in slide-in-from-bottom-10">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-2xl mb-6 mx-auto">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Clase Protegida</h2>
          <div className="space-y-4">
            <input 
              type="password" 
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all text-center text-2xl tracking-[0.5em] font-bold"
              placeholder="••••"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
              autoFocus
            />
            {error && <p className="text-rose-500 text-xs font-bold text-center bg-rose-50 p-2 rounded-lg">{error}</p>}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button onClick={() => {setLoginStep(null); setError('');}} variant="ghost">Cancelar</Button>
              <Button onClick={handleUnlock}>Acceder</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {!selectedLesson ? (
        <>
          <nav className="glass sticky top-0 z-50 px-6 h-20 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <i className="fas fa-university text-xl"></i>
              </div>
              <span className="font-black text-xl md:text-2xl tracking-tighter">EDU<span className="text-blue-600">STREAM</span></span>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-black uppercase text-slate-400">Estudante</p>
                <p className="font-bold text-slate-800">{session?.nome}</p>
              </div>
              <button onClick={logout} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center">
                <i className="fas fa-power-off"></i>
              </button>
            </div>
          </nav>
          <Portal onSelectLesson={handleLessonSelect} userName={session?.nome || ''} />
        </>
      ) : (
        <ClassView lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />
      )}
    </div>
  );
};

export default App;
