export interface GuidedReading {
  id: string;
  category: string;
  title: string;
  duration: string;
  guide: string;
  image: string;
  paragraphs: string[];
}

export const GUIDED_READINGS: GuidedReading[] = [
  {
    id: "intuicao",
    category: "Leitura Guiada",
    title: "Despertando Sua Intuição",
    duration: "3–5 minutos",
    guide: "selene",
    image: "reading-intuition",
    paragraphs: [
      "Existe dentro de você uma voz que não precisa de palavras.",
      "Ela se manifesta como uma sensação no peito, um arrepio sutil, uma certeza que nasce antes do pensamento.",
      "É a sua intuição — o canal mais antigo de conexão com você mesma.",
      "Muitas vezes, a vida moderna nos ensina a ignorá-la. Somos treinadas a racionalizar tudo, a buscar provas antes de confiar.",
      "Mas a intuição não precisa de provas. Ela é a prova.",
      "Pense em um momento em que você sentiu algo antes de entender. Talvez um aviso silencioso que você ignorou. Ou uma atração que não fazia sentido lógico, mas era real.",
      "Esses momentos não foram coincidência. Foram sinais da sua inteligência mais profunda.",
      "Para despertar sua intuição, comece pelo silêncio. Não o silêncio vazio — mas o silêncio fértil, onde você permite que as respostas venham sem forçar.",
      "Respire fundo agora. Feche os olhos por um instante.",
      "Pergunte-se: o que eu preciso ouvir hoje? E espere. Sem julgamento, sem pressa.",
      "A resposta pode vir como uma imagem, uma palavra, uma emoção. Confie no que surgir.",
      "Sua intuição nunca esteve adormecida. Ela apenas esperava que você parasse para ouvir.",
    ],
  },
  {
    id: "silencio",
    category: "Meditação Guiada",
    title: "O Poder do Silêncio Interior",
    duration: "4–6 minutos",
    guide: "luana",
    image: "reading-silence",
    paragraphs: [
      "O barulho do mundo é constante. Notificações, conversas, expectativas, pensamentos que não param.",
      "Mas existe um lugar dentro de você que nenhum ruído consegue alcançar.",
      "Um espaço de silêncio que não é ausência — é presença pura.",
      "O silêncio interior não significa parar de pensar. Significa criar um espaço entre você e seus pensamentos.",
      "Um espaço onde você pode observar sem reagir. Sentir sem se perder.",
      "Imagine um lago em uma noite calma. A superfície é um espelho perfeito, refletindo as estrelas.",
      "Cada pensamento é como uma pedra jogada nessa água. Cria ondas, distorce o reflexo.",
      "Mas quando as ondas se acalmam — e elas sempre se acalmam — o reflexo volta. Mais claro que antes.",
      "Esse é o poder do silêncio: ele não apaga suas dores ou dúvidas. Ele permite que você as veja com clareza.",
      "E na clareza, nasce a escolha consciente.",
      "Hoje, permita-se cinco minutos de quietude real. Sem tela, sem música, sem distração.",
      "Apenas você e o ritmo da sua respiração.",
      "Dentro desse silêncio, você vai encontrar algo que estava lá o tempo todo: a sua própria sabedoria.",
    ],
  },
  {
    id: "soltar",
    category: "Reflexão Guiada",
    title: "Soltar o Que Não Te Pertence",
    duration: "3–5 minutos",
    guide: "rafael",
    image: "reading-soltar",
    paragraphs: [
      "Você carrega mais do que deveria.",
      "Expectativas que não são suas. Culpas que alguém depositou em você. Medos que herdou sem perceber.",
      "E esse peso, mesmo invisível, cansa. Ocupa espaço. Rouba leveza.",
      "Soltar não é abandonar. Não é fingir que não importa. É reconhecer que nem tudo que você sente é seu para resolver.",
      "Pense agora: existe algo que você carrega que não escolheu? Uma cobrança, uma mágoa, uma responsabilidade que nunca foi sua?",
      "Dê um nome a isso. Não precisa ser perfeito. Apenas reconheça.",
      "Agora imagine que esse peso tem forma — talvez uma pedra, talvez uma mala velha. Você o segura há tanto tempo que seus dedos já se moldaram a ele.",
      "Mas seus dedos podem abrir. Devagar, com gentileza.",
      "Soltar é um ato de coragem, não de fraqueza. É dizer: eu mereço caminhar mais leve.",
      "Respire fundo. A cada expiração, imagine essa carga se dissolvendo no ar.",
      "Você não precisa resolver tudo. Você não precisa carregar tudo.",
      "O que é verdadeiramente seu permanece. O resto pode ir.",
      "E quando suas mãos estiverem livres, você vai perceber: elas sempre estiveram prontas para receber algo melhor.",
    ],
  },
];
