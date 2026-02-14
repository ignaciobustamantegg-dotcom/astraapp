import { useState, useCallback } from "react";
import { QuizQuestion } from "@/data/quizQuestions";
import { getEncouragement, getMilestone, getMiniRelato, type Encouragement, type MilestoneMessage, type MiniRelatoData } from "@/data/encouragements";
import Orbs from "./Orbs";
import SocialProofPopup from "./SocialProofPopup";
import ThermometerGauge from "./ThermometerGauge";
import MiniRelato from "./MiniRelato";
import { useQuizSounds } from "@/hooks/useQuizSounds";

interface QuestionScreenProps {
  question: QuizQuestion;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
}

type FeedbackState =
  | { type: "encouragement"; data: Encouragement; leaving: boolean }
  | { type: "milestone"; data: MilestoneMessage; leaving: boolean }
  | { type: "relato"; data: MiniRelatoData; leaving: boolean }
  | null;

const QuestionScreen = ({ question, totalQuestions, onAnswer }: QuestionScreenProps) => {
  const progress = (question.id / totalQuestions) * 100;
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { playClick } = useQuizSounds();

  const handleAnswer = useCallback((index: number) => {
    if (feedback) return;
    playClick();
    setSelectedIndex(index);

    const milestone = getMilestone(question.id);
    const encouragement = getEncouragement(question.id);
    const relato = getMiniRelato(question.id);

    const steps: { type: "encouragement" | "milestone" | "relato"; data: any; duration: number }[] = [];

    steps.push({ type: "encouragement", data: encouragement, duration: 2800 });

    if (relato) {
      steps.push({ type: "relato", data: relato, duration: 4500 });
    }

    if (milestone) {
      steps.push({ type: "milestone", data: milestone, duration: 3500 });
    }

    let elapsed = 0;

    steps.forEach((step, i) => {
      const showAt = elapsed;
      const leaveAt = elapsed + step.duration - 300;

      setTimeout(() => {
        setFeedback({ type: step.type, data: step.data, leaving: false } as FeedbackState);
      }, showAt);

      setTimeout(() => {
        setFeedback(prev => prev ? { ...prev, leaving: true } : null);
      }, leaveAt);

      elapsed += step.duration;
    });

    setTimeout(() => {
      setFeedback(null);
      setSelectedIndex(null);
      onAnswer(index);
    }, elapsed);
  }, [feedback, question.id, onAnswer, playClick]);

  return (
    <div className="min-h-screen flex flex-col px-5 py-6 bg-gradient-deep relative">
      <Orbs />
      <SocialProofPopup initialDelay={6000} interval={12000} />

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="flex justify-between text-xs text-muted-foreground mb-2 tracking-wide">
          <span>{question.id} / {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-[3px] bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(270 50% 72%), hsl(200 60% 65%))",
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md animate-fade-in-up" key={question.id}>
          <h2 className="text-2xl sm:text-[1.7rem] font-light text-foreground mb-10 leading-snug tracking-tight">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={feedback !== null}
                className={`w-full text-left px-5 py-4 rounded-2xl border-glass text-[0.93rem] leading-relaxed font-light transition-all duration-300 active:scale-[0.98] ${
                  selectedIndex === index
                    ? "bg-primary/20 border-primary/50 text-foreground ring-1 ring-primary/30"
                    : "bg-gradient-card-glass text-secondary-foreground hover:border-primary/40 hover:text-foreground hover:bg-secondary/60"
                } ${feedback !== null && selectedIndex !== index ? "opacity-40" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {feedback?.type === "encouragement" && (
        <div className="fixed inset-x-0 bottom-24 flex justify-center z-50 pointer-events-none px-4">
          <div
            className={`bg-gradient-card-glass border-glass rounded-2xl px-6 py-4 glow-soft max-w-sm flex items-center gap-3 ${
              feedback.leaving ? "animate-encouragement-out" : "animate-encouragement-in"
            }`}
          >
            <span className="text-2xl flex-shrink-0">{feedback.data.emoji}</span>
            <p className="text-foreground text-sm font-light leading-snug">
              {feedback.data.message}
            </p>
            <span className="absolute -top-2 -right-2 text-xs animate-sparkle" style={{ animationDelay: "0.1s" }}>✦</span>
            <span className="absolute -bottom-1 -left-1 text-xs animate-sparkle text-primary" style={{ animationDelay: "0.3s" }}>✧</span>
          </div>
        </div>
      )}

      {feedback?.type === "relato" && (
        <div className="fixed inset-x-0 bottom-20 flex justify-center z-50 pointer-events-none px-4">
          <MiniRelato
            name={feedback.data.name}
            age={feedback.data.age}
            city={feedback.data.city}
            text={feedback.data.text}
            leaving={feedback.leaving}
          />
        </div>
      )}

      {feedback?.type === "milestone" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6">
          <div
            className={`bg-gradient-card-glass border-glass rounded-3xl px-8 py-8 glow-soft max-w-sm text-center w-full ${
              feedback.leaving ? "animate-encouragement-out" : "animate-milestone-in"
            }`}
            style={{ background: "linear-gradient(135deg, hsl(230 30% 13% / 0.95), hsl(250 25% 11% / 0.9))", backdropFilter: "blur(16px)" }}
          >
            <span className="text-4xl block mb-3">{feedback.data.emoji}</span>
            <h3 className="text-xl font-light text-foreground mb-2 tracking-tight">
              {feedback.data.title}
            </h3>
            <p className="text-sm text-secondary-foreground font-light leading-relaxed mb-4">
              {feedback.data.subtitle}
            </p>

            {feedback.data.thermometer && (
              <div className="mt-3 px-2">
                <ThermometerGauge
                  label={feedback.data.thermometer.label}
                  value={feedback.data.thermometer.value}
                  color={feedback.data.thermometer.color}
                />
              </div>
            )}

            <span className="absolute top-3 left-4 text-xs animate-sparkle text-primary">✦</span>
            <span className="absolute top-4 right-5 text-xs animate-sparkle text-accent" style={{ animationDelay: "0.2s" }}>✧</span>
            <span className="absolute bottom-3 left-6 text-xs animate-sparkle text-accent" style={{ animationDelay: "0.4s" }}>✦</span>
            <span className="absolute bottom-4 right-4 text-xs animate-sparkle text-primary" style={{ animationDelay: "0.6s" }}>✧</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;
