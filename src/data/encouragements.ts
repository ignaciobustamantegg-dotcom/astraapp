export interface Encouragement {
  message: string;
  emoji: string;
}

const GENERIC: Encouragement[] = [
  { message: "Ótima resposta. Você está se conhecendo mais.", emoji: "✨" },
  { message: "Sua coragem de responder isso é rara.", emoji: "💎" },
  { message: "Cada resposta te aproxima da sua verdade.", emoji: "🔮" },
  { message: "Anotado. Seu perfil está ficando mais claro.", emoji: "📝" },
];

const PER_QUESTION: Record<number, Encouragement[]> = {
  1: [
    { message: "Perfeito. Ajustando a análise para o seu perfil.", emoji: "⚙️" },
  ],
  2: [
    { message: "Entendi. Isso já diz muito sobre o seu padrão.", emoji: "🔍" },
    { message: "Interessante… esse dado é mais revelador do que parece.", emoji: "👁️" },
  ],
  3: [
    { message: "Essa resposta é mais comum do que você imagina.", emoji: "💜" },
    { message: "Profundo. Seu subconsciente já sabe a resposta.", emoji: "🧠" },
  ],
  4: [
    { message: "82% das mulheres respondem da mesma forma.", emoji: "📊" },
    { message: "Padrão identificado. Continue sendo honesta.", emoji: "🎯" },
  ],
  5: [
    { message: "Esse perfil se repete por um motivo. Vamos descobrir.", emoji: "🔑" },
    { message: "Dado crucial registrado no seu mapa.", emoji: "🗺️" },
  ],
  6: [
    { message: "Isso confirma uma tendência no seu padrão.", emoji: "📈" },
  ],
  7: [
    { message: "O olhar externo revela o que a gente não vê.", emoji: "👀" },
    { message: "Suas amigas estão certas sobre mais coisas do que você pensa.", emoji: "💡" },
  ],
  8: [
    { message: "Sua honestidade aqui é poderosa.", emoji: "🔥" },
    { message: "A maioria nega. Você está sendo corajosa.", emoji: "💪" },
  ],
  9: [
    { message: "Sem julgamento. Isso é mais comum do que parece.", emoji: "🤍" },
  ],
  10: [
    { message: "Esse 'elástico emocional' tem uma causa raiz.", emoji: "🧬" },
    { message: "Dado sensível registrado com segurança.", emoji: "🔒" },
  ],
  11: [
    { message: "Seu medo revela o que você mais deseja.", emoji: "🌙" },
  ],
  12: [
    { message: "Déjà Vu emocional é um dos sinais mais fortes.", emoji: "⚡" },
  ],
  13: [
    { message: "Seu corpo nunca mente. Ele é seu maior aliado.", emoji: "🫀" },
  ],
  14: [
    { message: "Essa crença pode ser a chave de tudo.", emoji: "🗝️" },
  ],
  15: [
    { message: "Sua coragem de chegar até aqui já é transformadora.", emoji: "🦋" },
  ],
  16: [
    { message: "Decisão registrada. Seu diagnóstico está sendo gerado.", emoji: "✅" },
  ],
};

export interface MilestoneMessage {
  title: string;
  subtitle: string;
  emoji: string;
  thermometer?: {
    label: string;
    value: number;
    color: "danger" | "warning" | "accent";
  };
}

export const MILESTONES: Record<number, MilestoneMessage> = {
  3: {
    title: "Primeiros padrões detectados",
    subtitle: "Continue — as próximas respostas vão revelar ainda mais.",
    emoji: "🔍",
    thermometer: {
      label: "Nível de Padrão Repetitivo",
      value: 38,
      color: "warning",
    },
  },
  5: {
    title: "Análise comportamental em 30%",
    subtitle: "Seus dados estão formando um perfil único.",
    emoji: "📊",
    thermometer: {
      label: "Risco de Bloqueio Emocional",
      value: 62,
      color: "danger",
    },
  },
  10: {
    title: "Perfil emocional quase completo",
    subtitle: "Faltam apenas 6 respostas para o diagnóstico final.",
    emoji: "🧩",
    thermometer: {
      label: "Intensidade do Padrão Detectado",
      value: 84,
      color: "danger",
    },
  },
  13: {
    title: "Nível de profundidade: Avançado",
    subtitle: "Pouquíssimas pessoas chegam tão longe com tanta honestidade.",
    emoji: "💎",
    thermometer: {
      label: "Compatibilidade com Padrão de Bloqueio",
      value: 91,
      color: "danger",
    },
  },
};

export interface MiniRelatoData {
  name: string;
  age: number;
  city: string;
  text: string;
}

export const MINI_RELATOS: Record<number, MiniRelatoData> = {
  4: {
    name: "Camila R.",
    age: 29,
    city: "São Paulo",
    text: "Eu respondi essa mesma pergunta chorando. Depois de ver meu diagnóstico, entendi que não era 'azar no amor'. Era um padrão que eu podia quebrar.",
  },
  8: {
    name: "Juliana M.",
    age: 33,
    city: "Belo Horizonte",
    text: "Eu ignorava todas as red flags. Quando vi no relatório exatamente por que eu fazia isso, foi como se alguém acendesse a luz numa sala escura.",
  },
  12: {
    name: "Fernanda S.",
    age: 27,
    city: "Rio de Janeiro",
    text: "Achava que era Déjà Vu, mas era meu subconsciente repetindo o mesmo ciclo. Depois do plano de desbloqueio, conheci alguém completamente diferente.",
  },
  15: {
    name: "Patrícia L.",
    age: 36,
    city: "Curitiba",
    text: "Eu quase parei no meio do teste. Ainda bem que continuei. O diagnóstico mudou minha forma de ver meus relacionamentos para sempre.",
  },
};

export function getEncouragement(questionId: number): Encouragement {
  const specific = PER_QUESTION[questionId];
  if (specific && specific.length > 0) {
    return specific[Math.floor(Math.random() * specific.length)];
  }
  return GENERIC[Math.floor(Math.random() * GENERIC.length)];
}

export function getMilestone(questionId: number): MilestoneMessage | null {
  return MILESTONES[questionId] || null;
}

export function getMiniRelato(questionId: number): MiniRelatoData | null {
  return MINI_RELATOS[questionId] || null;
}
