
export type LessonLevel = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface QuizQuestion {
  pergunta: string;
  opcoes: string[];
  correta: number;
}

export interface AudioItem {
  titulo: string;
  url: string;
  duracao: string;
}

export interface MaterialItem {
  titulo: string;
  url: string;
  tipo: 'pdf' | 'doc' | 'ppt' | 'xls' | 'link';
}

export interface Lesson {
  id: number;
  titulo: string;
  subtitulo: string;
  descricao: string;
  materia: string;
  nivel: LessonLevel;
  tempo: string;
  imagem: string;
  logoEscola: string;
  logoCentro: string;
  videoUrl: string;
  slideUrl: string;
  audios: AudioItem[];
  materiais: MaterialItem[];
  galeria: string[];
  quiz: QuizQuestion[];
  senha?: string;
}

export interface UserSession {
  nome: string;
  lastLessonId?: number;
}
