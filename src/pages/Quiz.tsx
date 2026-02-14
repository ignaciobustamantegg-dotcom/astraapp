import { useState, useCallback, useEffect, useRef } from "react";
import StartScreen from "@/components/quiz/StartScreen";
import QuestionScreen from "@/components/quiz/QuestionScreen";
import TransitionScreen from "@/components/quiz/TransitionScreen";
import EmailScreen from "@/components/quiz/EmailScreen";
import ResultsScreen from "@/components/quiz/ResultsScreen";
import { quizQuestions } from "@/data/quizQuestions";
import { useQuizSounds } from "@/hooks/useQuizSounds";
import { getSessionId, captureUtms, getVariant, trackEvent, submitLead, submitQuizAnswers } from "@/lib/session";

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
  const answersRef = useRef<Record<number, number>>({});

  // Session bootstrap on mount
  useEffect(() => {
    getSessionId();
    captureUtms();
    getVariant();
    trackEvent("view_quiz");
  }, []);

  const handleStart = useCallback(() => {
    playSwoosh();
    trackEvent("quiz_started");
    setScreen({ type: "question", index: 0 });
  }, [playSwoosh]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (screen.type !== "question") return;
      answersRef.current[screen.index] = answerIndex;
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
    // Submit lead + quiz answers in parallel
    try {
      await Promise.all([
        submitLead(email),
        submitQuizAnswers(answersRef.current),
      ]);
    } catch (e) {
      console.warn("Submit error:", e);
    }
    setScreen({ type: "transition2" });
  }, []);

  const handleTransition2Complete = useCallback(() => {
    setScreen({ type: "results" });
  }, []);

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
      return <ResultsScreen />;
  }
};

export default Quiz;
