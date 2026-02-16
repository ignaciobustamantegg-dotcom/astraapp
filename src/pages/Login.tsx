import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/home");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Back button */}
      <div className="px-4 pt-4 safe-top">
        <button
          onClick={() => navigate("/")}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <motion.div
        className="flex-1 px-6 pt-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-[1.75rem] font-semibold text-foreground mb-8">
          Entrar
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              E-mail
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              className="h-12 bg-transparent border-border/60 rounded-xl text-base text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Senha
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                minLength={6}
                className="h-12 bg-transparent border-border/60 rounded-xl text-base text-foreground placeholder:text-muted-foreground pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] rounded-xl text-[15px] font-bold press-scale transition-all duration-300 text-primary-foreground disabled:opacity-50 mt-2"
            style={{
              background: "linear-gradient(135deg, hsl(270, 60%, 65%), hsl(270, 60%, 70%), hsl(275, 55%, 75%))",
              boxShadow: "0 0 20px hsla(270, 60%, 70%, 0.25), 0 4px 12px hsla(270, 60%, 70%, 0.15)",
              border: "1px solid hsla(270, 60%, 75%, 0.2)",
            }}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button className="text-sm text-primary font-medium">
            Esqueceu a senha?
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
