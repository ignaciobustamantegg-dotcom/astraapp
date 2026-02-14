export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual é a sua faixa etária?",
    options: [
      "18 a 24 anos",
      "25 a 34 anos",
      "35 a 44 anos",
      "45+ anos",
    ],
  },
  {
    id: 2,
    question: "Qual é o seu status amoroso no momento?",
    options: [
      "Solteira e exausta de tentar.",
      'Presa em uma "situação" que não vai pra frente (enrolada).',
      "Tentando superar um término recente.",
      "Em um relacionamento, mas sentindo que algo está errado.",
    ],
  },
  {
    id: 3,
    question: "Quando você pensa na sua vida amorosa hoje, qual palavra define melhor o que você sente?",
    options: [
      "Confusão (Não entendo por que não dá certo).",
      "Frustração (Sempre dou azar).",
      "Cansaço (Preguiça de recomeçar e conhecer alguém do zero).",
      "Esperança (Ainda acho que minha hora vai chegar).",
    ],
  },
  {
    id: 4,
    question: 'O quanto você concorda com esta frase: "Eu sempre me entrego mais do que recebo nas relações."',
    options: [
      "Concordo totalmente. É a história da minha vida.",
      "Concordo em partes.",
      "Discordo. Eu sou a pessoa mais fria da relação.",
    ],
  },
  {
    id: 5,
    question: "Olhando para os seus últimos envolvimentos, qual perfil de homem mais se repete?",
    options: [
      "O Frio/Indisponível: Nunca demonstra o que sente e foge de compromisso.",
      'O "Promessa": Começa intenso, promete o mundo, e depois some do nada.',
      'O "Problema": Precisa ser salvo ou ajudado o tempo todo.',
      'O "Metade": Só quer os benefícios, mas nunca assume nada sério.',
    ],
  },
  {
    id: 6,
    question: "Como as suas relações costumam terminar?",
    options: [
      "Ele se afasta sem dar muitas explicações (o famoso ghosting).",
      "Eu acabo terminando porque não aguento mais a falta de reciprocidade.",
      'Fica num "vai e volta" infinito e desgastante.',
    ],
  },
  {
    id: 7,
    question: "O que as suas amigas costumam dizer sobre as suas escolhas amorosas?",
    options: [
      'Dizem que eu tenho "dedo podre".',
      "Falam que eu sou muito boazinha e deixo montarem em mim.",
      "Dizem que eu escolho homens que não me merecem.",
      "Eu nem conto mais tudo para elas para não ser julgada.",
    ],
  },
  {
    id: 8,
    question: 'Sinceramente, você já ignorou "bandeiras vermelhas" (sinais de que ia dar errado) logo no começo, só porque queria muito que desse certo?',
    options: [
      "Sim, eu sempre vejo os sinais, mas finjo que não vi.",
      "Às vezes. Eu tento focar nas qualidades da pessoa.",
      "Não, eu corto na mesma hora.",
    ],
  },
  {
    id: 9,
    question: 'Você já se pegou checando o "online" dele no WhatsApp de madrugada ou olhando os Stories com perfis falsos, mesmo sabendo que isso te faz mal?',
    options: [
      "Sim, infelizmente faço muito isso.",
      "Já fiz no passado, hoje tento evitar.",
      "Nunca fiz.",
    ],
  },
  {
    id: 10,
    question: 'Existe uma pessoa específica do seu passado (ou presente) que você sente que ainda exerce um poder emocional sobre você, como se existisse um "elástico" te puxando de volta?',
    options: [
      "Sim. Por mais que eu tente, não consigo tirar ele da cabeça.",
      "Sim, mas já estou conseguindo me libertar.",
      "Não, quando eu corto, é para sempre.",
    ],
  },
  {
    id: 11,
    question: "No fundo, qual é o seu maior medo quando conhece alguém novo hoje?",
    options: [
      "Medo de ser abandonada ou trocada de novo.",
      "Medo de perder meu tempo e me frustrar mais uma vez.",
      "Medo de me apegar e perder o controle das minhas emoções.",
    ],
  },
  {
    id: 12,
    question: 'Você já teve a sensação de "Déjà Vu" emocional? (Sentir que já viveu exatamente aquela mesma dor e aquela mesma conversa, só que com outro homem).',
    options: [
      "Sim! É assustador, parece que a história apenas repete.",
      "Algumas vezes.",
      "Nunca parei para pensar nisso.",
    ],
  },
  {
    id: 13,
    question: "A sua intuição costuma te avisar quando algo está errado, gerando uma ansiedade repentina ou um aperto no peito?",
    options: [
      "Sim, meu corpo sempre avisa antes de tudo acontecer.",
      "Às vezes sinto, mas acho que é só paranoia minha.",
      "Não costumo sentir nada físico.",
    ],
  },
  {
    id: 14,
    question: 'Você acredita que traumas e rejeições do passado podem criar "bloqueios energéticos" que te impedem de viver um amor de verdade hoje?',
    options: [
      "Com certeza. Sinto que minha energia está travada.",
      "Faz sentido, estou aberta a entender melhor isso.",
      "Não acredito muito nisso.",
    ],
  },
  {
    id: 15,
    question: "O sistema está finalizando a leitura do seu padrão. Você está pronta para ouvir a verdade, mesmo que seja dura?",
    options: [
      "Sim, eu preciso dessa clareza.",
      "Estou com um pouco de medo, mas sim.",
    ],
  },
  {
    id: 16,
    question: "Se você descobrisse a raiz exata desse bloqueio hoje, você se comprometeria a quebrar esse padrão para não repetir essa história no próximo ano?",
    options: [
      "Sim. Eu não aguento mais viver nesse ciclo. Estou decidida.",
    ],
  },
];
