
import React, { useState, useRef, useEffect } from 'react';
import { Lesson, AudioItem } from '../types';
import Button from './Button';

interface ClassViewProps {
  lesson: Lesson;
  onBack: () => void;
}

const ClassView: React.FC<ClassViewProps> = ({ lesson, onBack }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'slides' | 'quiz' | 'gallery'>('video');
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<{ idx: number; player: HTMLAudioElement } | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<number, number>>({});
  
  const videoRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  // Função para garantir que o link do YouTube funcione no iframe
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  const toggleFullscreen = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      ref.current.requestFullscreen().catch(err => console.error(err));
    }
  };

  const toggleAudio = (audio: AudioItem, idx: number) => {
    if (currentAudio) {
      currentAudio.player.pause();
      if (currentAudio.idx === idx) {
        setCurrentAudio(null);
        return;
      }
    }
    const player = new Audio(audio.url);
    player.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    player.ontimeupdate = () => {
      setAudioProgress(prev => ({ ...prev, [idx]: (player.currentTime / player.duration) * 100 }));
    };
    player.onended = () => setCurrentAudio(null);
    setCurrentAudio({ idx, player });
  };

  const calculateQuizScore = () => {
    let score = 0;
    lesson.quiz.forEach((q, i) => { if (userAnswers[i] === q.correta) score++; });
    return score;
  };

  const isLocalVideo = lesson.videoUrl.match(/\.(mp4|webm|ogg)$/i);
  const finalVideoUrl = getEmbedUrl(lesson.videoUrl);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 lg:pb-0">
      {/* HEADER BILATERAL */}
      <header className="glass sticky top-0 z-50 px-4 h-20 flex items-center justify-between shadow-md border-b">
        <div className="flex items-center gap-2 w-1/4">
          <img src={lesson.logoEscola} className="h-10 w-10 md:h-12 md:w-12 object-contain" alt="Escola" />
          <Button onClick={onBack} variant="ghost" size="sm" className="hidden lg:flex ml-2">
            <i className="fas fa-arrow-left mr-2"></i> Volver
          </Button>
        </div>
        
        <div className="flex-grow text-center px-2">
          <h1 className="text-sm md:text-lg font-black text-slate-800 line-clamp-1 uppercase tracking-tight">
            {lesson.titulo}
          </h1>
        </div>

        <div className="flex items-center justify-end gap-2 w-1/4">
          <Button onClick={onBack} variant="ghost" size="sm" className="lg:hidden p-2">
             <i className="fas fa-arrow-left"></i>
          </Button>
          <img src={lesson.logoCentro} className="h-10 w-10 md:h-12 md:w-12 object-contain" alt="Centro" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 py-6 md:py-10 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA PRINCIPAL: VÍDEO, SLIDES, QUIZ, GALERIA */}
        <div className="lg:col-span-8 flex flex-col gap-6 order-1">
          <nav className="flex bg-slate-200/50 p-1.5 rounded-2xl shadow-inner w-full overflow-x-auto">
            {(['video', 'slides', 'quiz', 'gallery'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[80px] py-3 px-2 rounded-xl text-[10px] md:text-sm font-bold capitalize transition-all ${
                  activeTab === tab ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <i className={`fas fa-${tab === 'video' ? 'play-circle' : tab === 'slides' ? 'file-pdf' : tab === 'quiz' ? 'check-double' : 'images'} mr-1 md:mr-2`}></i>
                {tab === 'gallery' ? 'Galería' : tab}
              </button>
            ))}
          </nav>

          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col h-fit">
            
            {/* VÍDEO */}
            {activeTab === 'video' && (
              <div ref={videoRef} className="w-full flex flex-col bg-black group relative aspect-video">
                {isLocalVideo ? (
                  <video controls className="w-full h-full">
                    <source src={lesson.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <iframe 
                    className="w-full h-full" 
                    src={finalVideoUrl} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  ></iframe>
                )}
                <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button onClick={() => toggleFullscreen(videoRef)} variant="ghost" size="sm" className="bg-black/50 text-white hover:bg-black/70">
                    <i className="fas fa-expand"></i>
                  </Button>
                </div>
              </div>
            )}

            {/* SLIDES */}
            {activeTab === 'slides' && (
              <div ref={slideRef} className="w-full flex flex-col bg-slate-100 relative h-[450px] md:h-[600px] group">
                <iframe className="w-full h-full border-none" src={lesson.slideUrl}></iframe>
                <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button onClick={() => toggleFullscreen(slideRef)} variant="secondary" size="sm">
                     <i className="fas fa-expand"></i>
                   </Button>
                </div>
              </div>
            )}

            {/* QUIZ */}
            {activeTab === 'quiz' && (
              <div className="p-6 md:p-12">
                {lesson.quiz.length > 0 ? (
                  !quizFinished ? (
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-8">{lesson.quiz[quizIndex].pergunta}</h3>
                      <div className="grid gap-3">
                        {lesson.quiz[quizIndex].opcoes.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => setUserAnswers(prev => ({ ...prev, [quizIndex]: i }))}
                            className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${userAnswers[quizIndex] === i ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg' : 'border-slate-100 hover:border-slate-300'}`}
                          >
                            <span className="font-bold text-sm">{opt}</span>
                            {userAnswers[quizIndex] === i && <i className="fas fa-check-circle text-blue-600"></i>}
                          </button>
                        ))}
                      </div>
                      <div className="mt-8 flex justify-between items-center">
                        <Button variant="ghost" size="sm" disabled={quizIndex === 0} onClick={() => setQuizIndex(prev => prev - 1)}>Atrás</Button>
                        <Button disabled={userAnswers[quizIndex] === undefined} onClick={() => quizIndex === lesson.quiz.length - 1 ? setQuizFinished(true) : setQuizIndex(prev => prev + 1)}>
                          {quizIndex === lesson.quiz.length - 1 ? 'Finalizar' : 'Siguiente'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                        <i className="fas fa-trophy"></i>
                      </div>
                      <h2 className="text-xl font-black mb-2">¡Completado!</h2>
                      <p className="text-slate-500 mb-6 text-sm">Puntos: {calculateQuizScore()} / {lesson.quiz.length}</p>
                      <Button onClick={() => {setQuizFinished(false); setUserAnswers({}); setQuizIndex(0);}}>Reintentar</Button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest opacity-40">Sin Quiz</div>
                )}
              </div>
            )}

            {/* GALERIA (Agora central) */}
            {activeTab === 'gallery' && (
              <div className="p-6 md:p-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {lesson.galeria.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md hover:scale-[1.03] transition-transform cursor-pointer">
                      <img src={img} className="w-full h-full object-cover" alt="Galeria" />
                    </div>
                  ))}
                  {lesson.galeria.length === 0 && <div className="col-span-full text-center py-20 text-slate-300 font-bold">Galería vacía</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUNA LATERAL: MATERIAIS E ÁUDIO */}
        <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-2">
          
          {/* Materiais (Downloads) */}
          <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 h-fit">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-tighter text-sm">
              <i className="fas fa-file-download text-blue-500"></i> Materiales
            </h3>
            <div className="space-y-3">
              {lesson.materiais.map((mat, i) => (
                <a key={i} href={mat.url} download className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 group transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <i className={`fas fa-file-${mat.tipo === 'pdf' ? 'pdf text-rose-500' : 'word text-blue-500'} text-lg shrink-0`}></i>
                    <span className="text-xs font-bold truncate">{mat.titulo}</span>
                  </div>
                  <i className="fas fa-arrow-down text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </a>
              ))}
              {lesson.materiais.length === 0 && <p className="text-center text-slate-400 text-[10px] py-4 italic">Sin archivos</p>}
            </div>
          </section>

          {/* Áudio (Agora lateral) */}
          <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 h-fit">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-tighter text-sm">
              <i className="fas fa-headphones text-indigo-500"></i> Audios
            </h3>
            <div className="space-y-4">
              {lesson.audios.map((audio, idx) => (
                <div key={idx} className={`p-4 rounded-2xl transition-all ${currentAudio?.idx === idx ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleAudio(audio, idx)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${currentAudio?.idx === idx ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}
                    >
                      <i className={`fas fa-${currentAudio?.idx === idx ? 'pause' : 'play'} text-xs`}></i>
                    </button>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-[10px] font-bold truncate uppercase tracking-tighter">{audio.titulo}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="flex-grow h-1 bg-black/10 rounded-full">
                           <div className={`h-full ${currentAudio?.idx === idx ? 'bg-white' : 'bg-blue-500'}`} style={{ width: `${audioProgress[idx] || 0}%` }}></div>
                         </div>
                         <span className="text-[8px] font-mono opacity-60">{audio.duracao}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {lesson.audios.length === 0 && <p className="text-center text-slate-400 text-[10px] py-4 italic">Sin audios</p>}
            </div>
          </section>
        </div>
      </main>
      
      {/* Botão flutuante mobile para voltar */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Button onClick={onBack} variant="primary" className="shadow-2xl px-10 py-4 rounded-full">
          <i className="fas fa-home mr-2"></i> Salir de la Clase
        </Button>
      </div>
    </div>
  );
};

export default ClassView;
