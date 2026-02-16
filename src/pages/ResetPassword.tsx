import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { GlowButton } from "@/components/ui/glow-button";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase redirects here with access_token in the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (!hashParams.get("access_token")) {
      toast({ title: "Link inválido", description: "Este link de redefinição não é válido ou expirou.", variant: "destructive" });
      navigate("/login");
    }
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Senha atualizada!", description: "Sua senha foi alterada com sucesso." });
      navigate("/home");
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="px-4 pt-4 safe-top">
        <button onClick={() => navigate("/login")} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <motion.div className="flex-1 px-6 pt-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-[1.75rem] font-semibold text-foreground mb-2">Nova senha</h1>
        <p className="text-sm text-muted-foreground mb-8">Digite sua nova senha abaixo.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Nova senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="h-12 bg-transparent border-border/60 rounded-xl text-base text-foreground placeholder:text-muted-foreground pr-12"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground min-h-[44px] min-w-[44px] flex items-center justify-center">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <GlowButton type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar nova senha"}
          </GlowButton>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
