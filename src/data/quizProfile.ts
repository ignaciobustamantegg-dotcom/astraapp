import { quizQuestions } from "./quizQuestions";

// Answers format: { "0": 2, "1": 1, "2": 0, ... } where key = question index, value = selected option index

export interface QuizProfile {
  archetype: string;
  archetypeSubtitle: string;
  summary: string;
  highlights: { label: string; value: string }[];
  statusAmoroso: string;
  sentimento: string;
  entrega: string;
  perfilHomem: string;
  comoTermina: string;
  amigas: string;
  bandeirasVermelhas: string;
  stalking: string;
  elastico: string;
  medoPrincipal: string;
  dejaVu: string;
  intuicao: string;
  bloqueio: string;
}

// Get the exact text the user selected for a given question index
function getAnswerText(answers: Record<string, number>, questionIndex: number): string {
  const optionIndex = answers[String(questionIndex)];
  if (optionIndex === undefined) return "";
  const question = quizQuestions[questionIndex];
  if (!question) return "";
  return question.options[optionIndex] || "";
}

// Short label for archetype based on dominant man profile (question 5, index 4)
function getArchetype(answers: Record<string, number>): { name: string; subtitle: string } {
  const perfilIndex = answers["4"]; // question index 4 = question id 5
  const statusIndex = answers["1"]; // question index 1 = question id 2

  const archetypes: Record<number, { name: string; subtitle: string }> = {
    0: {
      name: "A Doadora Invisível",
      subtitle: "Você dá tudo de si, mas atrai quem nunca demonstra o que sente.",
    },
    1: {
      name: "A Esperançosa Ferida",
      subtitle: "Você acredita nas promessas, mas sempre fica com as mãos vazias.",
    },
    2: {
      name: "A Salvadora Emocional",
      subtitle: "Você tenta consertar quem não quer ser consertado.",
    },
    3: {
      name: "A Que Merece Mais",
      subtitle: "Você aceita migalhas de quem deveria te dar o mundo.",
    },
  };

  const fallback = { name: "Perfil em Análise", subtitle: "Seu padrão emocional foi identificado." };
  return archetypes[perfilIndex] || fallback;
}

export function buildProfile(answers: Record<string, number>): QuizProfile {
  const statusAmoroso = getAnswerText(answers, 1);
  const sentimento = getAnswerText(answers, 2);
  const entrega = getAnswerText(answers, 3);
  const perfilHomem = getAnswerText(answers, 4);
  const comoTermina = getAnswerText(answers, 5);
  const amigas = getAnswerText(answers, 6);
  const bandeirasVermelhas = getAnswerText(answers, 7);
  const stalking = getAnswerText(answers, 8);
  const elastico = getAnswerText(answers, 9);
  const medoPrincipal = getAnswerText(answers, 10);
  const dejaVu = getAnswerText(answers, 11);
  const intuicao = getAnswerText(answers, 12);
  const bloqueio = getAnswerText(answers, 13);

  const { name: archetype, subtitle: archetypeSubtitle } = getArchetype(answers);

  // Build dynamic summary using exact quiz words
  const summaryParts: string[] = [];

  if (statusAmoroso) {
    summaryParts.push(`Você se identifica como quem está "${statusAmoroso.toLowerCase()}"`);
  }
  if (sentimento) {
    const sentimentoClean = sentimento.split("(")[0].trim().toLowerCase();
    summaryParts.push(`O sentimento que mais define sua vida amorosa hoje é ${sentimentoClean}`);
  }
  if (perfilHomem) {
    summaryParts.push(`Seu padrão dominante é atrair o perfil: "${perfilHomem}"`);
  }
  if (comoTermina) {
    summaryParts.push(`Suas relações costumam terminar assim: "${comoTermina}"`);
  }

  const summary = summaryParts.join(". ") + ".";

  // Highlights — key insights from specific questions
  const highlights: { label: string; value: string }[] = [];

  if (medoPrincipal) {
    highlights.push({ label: "Medo principal", value: medoPrincipal });
  }
  if (dejaVu) {
    highlights.push({ label: "Padrão de repetição", value: dejaVu });
  }
  if (intuicao) {
    highlights.push({ label: "Sua intuição", value: intuicao });
  }
  if (bloqueio) {
    highlights.push({ label: "Bloqueio energético", value: bloqueio });
  }
  if (bandeirasVermelhas) {
    highlights.push({ label: "Bandeiras vermelhas", value: bandeirasVermelhas });
  }
  if (elastico) {
    highlights.push({ label: "Vínculo emocional", value: elastico });
  }

  return {
    archetype,
    archetypeSubtitle,
    summary,
    highlights,
    statusAmoroso,
    sentimento,
    entrega,
    perfilHomem,
    comoTermina,
    amigas,
    bandeirasVermelhas,
    stalking,
    elastico,
    medoPrincipal,
    dejaVu,
    intuicao,
    bloqueio,
  };
}
