
import { Lesson } from './types';

/**
 * 🎓 GUIA PARA O PROFESSOR (COMO EDITAR AS AULAS)
 * 
 * 1. ARQUIVOS LOCAIS:
 *    Se você tem uma pasta chamada "auxiliar" na raiz do app com seus arquivos:
 *    - Vídeo local: "auxiliar/minha_aula.mp4"
 *    - Slide local: "auxiliar/apresentacao.pdf"
 *    - Áudio local: "auxiliar/podcast.mp3"
 * 
 * 2. LINKS DO YOUTUBE:
 *    - Pode colar o link normal (ex: https://www.youtube.com/watch?v=...) 
 *    - O sistema tentará converter para o formato correto automaticamente.
 * 
 * 3. LOGOS:
 *    - logoEscola: Aparece no topo à esquerda.
 *    - logoCentro: Aparece no topo à direita.
 */

export const LESSONS: Lesson[] = [
  {
    id: 1,
    titulo: "Física Cuántica: El Comienzo",
    subtitulo: "Explorando a dualidade onda-partícula.",
    descricao: "Uma aula fundamental sobre o comportamento da matéria em escalas microscópicas.",
    materia: "Ciências",
    nivel: "Intermedio",
    tempo: "45 min",
    imagem: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    logoEscola: "https://cdn-icons-png.flaticon.com/512/3841/3841519.png", 
    logoCentro: "https://cdn-icons-png.flaticon.com/512/2830/2830305.png",
    videoUrl: "https://www.youtube.com/watch?v=S20m0X3Cunw", 
    slideUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    audios: [
      { titulo: "Introdução Sonora", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duracao: "05:30" }
    ],
    materiais: [
      { titulo: "Apostila PDF", url: "auxiliar/apostila.pdf", tipo: "pdf" }
    ],
    galeria: [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"
    ],
    quiz: [
      {
        pergunta: "¿Qué demuestra el experimento de la doble rendija?",
        opcoes: ["Luz es partícula", "Luz es onda", "Dualidad onda-partícula", "Nada"],
        correta: 2
      }
    ],
    senha: "123"
  }
];
