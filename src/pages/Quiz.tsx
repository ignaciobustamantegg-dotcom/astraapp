import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StartScreen from "@/components/quiz/StartScreen";
import QuestionScreen from "@/components/quiz/QuestionScreen";
import TransitionScreen from "@/components/quiz/TransitionScreen";
import EmailScreen from "@/components/quiz/EmailScreen";
import ResultsScreen from "@/components/quiz/ResultsScreen";
import { quizQuestions } from "@/data/quizQuestions";
import { useQuizSounds } from "@/hooks/useQuizSounds";
import {
  getOrCreateSessionId,
  captureUtms,
  getUtms,
  getVariant,
  storeAnswer,
  getAnswers,
  clearAnswers,
} from "@/lib/session";
import { submitLead, submitQuiz, trackEvent } from "@/lib/api";

type Screen =
  | { type: "start" }
  | { type: "question"; index: number }
  | { type: "transition1" }
  | { type: "email" }
  | { type: "transition2" }
  | { type: "results" };

const Quiz = () => {
  const [screen, setScreen] = useState<Screen>({ type: "start" });
  const { playSwoosh } = useQuizSounds();
  const navigate = useNavigate();
  const sessionBootstrapped = useRef(false);

  // Bootstrap session on mount
  useEffect(() => {
    if (sessionBootstrapped.current) return;
    sessionBootstrapped.current = true;
    const sid = getOrCreateSessionId();
    captureUtms();
    trackEvent(sid, "view_quiz").catch(console.error);
  }, []);

  const handleStart = useCallback(() => {
    playSwoosh();
    clearAnswers();
    setScreen({ type: "question", index: 0 });
  }, [playSwoosh]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (screen.type !== "question") return;

      storeAnswer(screen.index, answerIndex);
      const nextIndex = screen.index + 1;

      if (screen.index === 6) {
        setScreen({ type: "transition1" });
        return;
      }

      if (screen.index === 15) {
        setScreen({ type: "email" });
        return;
      }

      if (nextIndex < quizQuestions.length) {
        setScreen({ type: "question", index: nextIndex });
      }
    },
    [screen]
  );

  const handleTransition1Complete = useCallback(() => {
    playSwoosh();
    setScreen({ type: "question", index: 7 });
  }, [playSwoosh]);

  const handleEmailSubmit = useCallback(async (email: string) => {
    const sid = getOrCreateSessionId();
    const utms = getUtms();
    const variant = getVariant();

    try {
      await submitLead({
        session_id: sid,
        email,
        ...utms,
        variant: variant || undefined,
        user_agent: navigator.userAgent,
      });
    } catch (e) {
      console.error("Lead submit error:", e);
    }

    setScreen({ type: "transition2" });
  }, []);

  const handleTransition2Complete = useCallback(async () => {
    const sid = getOrCreateSessionId();
    const answers = getAnswers();

    try {
      await submitQuiz(sid, answers);
    } catch (e) {
      console.error("Quiz submit error:", e);
    }

    setScreen({ type: "results" });
  }, []);

  const handleCheckout = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  switch (screen.type) {
    case "start":
      return <StartScreen onStart={handleStart} />;
    case "question":
      return (
        <QuestionScreen
          question={quizQuestions[screen.index]}
          totalQuestions={quizQuestions.length}
          onAnswer={handleAnswer}
        />
      );
    case "transition1":
      return (
        <TransitionScreen
          text="⚙️ Analisando seu histórico de respostas e ajustando as próximas perguntas para o seu perfil comportamental..."
          duration={3500}
          onComplete={handleTransition1Complete}
        />
      );
    case "email":
      return <EmailScreen onSubmit={handleEmailSubmit} />;
    case "transition2":
      return (
        <TransitionScreen
          text="🔄 Cruzando dados comportamentais... Mapeando travas energéticas... Gerando o Relatório do seu Arquétipo de Bloqueio..."
          duration={4500}
          onComplete={handleTransition2Complete}
        />
      );
    case "results":
      return <ResultsScreen onCheckout={handleCheckout} />;
  }
};

export default Quiz;
