
import React, { useState, useMemo } from 'react';
import { LESSONS } from '../constants.tsx';
import { Lesson, LessonLevel } from '../types';
import Button from './Button';

interface PortalProps {
  onSelectLesson: (lesson: Lesson) => void;
  userName: string;
}

const Portal: React.FC<PortalProps> = ({ onSelectLesson, userName }) => {
  const [search, setSearch] = useState('');
  const [filterMateria, setFilterMateria] = useState('');
  const [filterNivel, setFilterNivel] = useState('');

  const materias = useMemo(() => Array.from(new Set(LESSONS.map(l => l.materia))), []);

  const filteredLessons = useMemo(() => {
    return LESSONS.filter(l => {
      const matchSearch = l.titulo.toLowerCase().includes(search.toLowerCase()) || 
                          l.descricao.toLowerCase().includes(search.toLowerCase());
      const matchMateria = !filterMateria || l.materia === filterMateria;
      const matchNivel = !filterNivel || l.nivel === filterNivel;
      return matchSearch && matchMateria && matchNivel;
    });
  }, [search, filterMateria, filterNivel]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <header className="mb-12 text-center">
        <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          Plataforma Educativa
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          ¡Hola, {userName}! 👋
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Bienvenido a tu panel de aprendizaje. Explora las lecciones interactivas diseñadas para potenciar tu conocimiento.
        </p>
      </header>

      {/* Filter Bar */}
      <section className="glass sticky top-4 z-30 mb-12 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-xl">
        <div className="relative w-full md:flex-grow">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Buscar lecciones..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500"
            value={filterMateria}
            onChange={(e) => setFilterMateria(e.target.value)}
          >
            <option value="">Todas las Materias</option>
            {materias.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select 
            className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500"
            value={filterNivel}
            onChange={(e) => setFilterNivel(e.target.value)}
          >
            <option value="">Todos los Niveles</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLessons.map((lesson) => (
          <div 
            key={lesson.id} 
            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={lesson.imagem} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={lesson.titulo}
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-white/90 text-blue-600 backdrop-blur shadow-sm">
                  {lesson.materia}
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  lesson.nivel === 'Principiante' ? 'bg-emerald-50 text-emerald-600' : 
                  lesson.nivel === 'Intermedio' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {lesson.nivel}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  <i className="far fa-clock mr-1"></i> {lesson.tempo}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                {lesson.titulo}
              </h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                {lesson.descricao}
              </p>
              <div className="mt-auto">
                <Button 
                  onClick={() => onSelectLesson(lesson)} 
                  variant="secondary" 
                  className="w-full"
                >
                  Acceder a la Clase <i className="fas fa-arrow-right ml-2 text-xs"></i>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-800">No hay resultados</h3>
          <p className="text-slate-500">Prueba con otros filtros o términos de búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default Portal;
