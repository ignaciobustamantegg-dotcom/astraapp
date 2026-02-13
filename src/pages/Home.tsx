import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-5 pt-8 pb-6 flex flex-col items-center"
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
        style={{
          background: "linear-gradient(135deg, hsl(270, 50%, 35%), hsl(260, 40%, 20%))",
          boxShadow: "0 0 30px hsla(270, 80%, 65%, 0.25)",
        }}
      >
        <Sparkles className="w-6 h-6 text-primary" />
      </div>

      <h1 className="text-2xl font-medium text-foreground text-center mb-3">
        Tu resultado
      </h1>

      <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-[320px] mb-8">
        Tienes un perfil de alta sensibilidad emocional con tendencia a la sobreexigencia.
        Tu patrón dominante es la evitación del conflicto interno, lo que genera ciclos de
        agotamiento y desconexión. La auditoría de 7 días te ayudará a identificar y
        transformar estos patrones.
      </p>

      <button
        onClick={() => navigate("/journey")}
        className="w-full max-w-[300px] h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground press-scale transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, hsl(270, 50%, 45%), hsl(270, 60%, 55%))",
          boxShadow: "0 4px 20px hsla(270, 80%, 55%, 0.3)",
        }}
      >
        Continuar mi viaje
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Home;
