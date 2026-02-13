import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const [displayName, setDisplayName] = useState("");
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { display_name: displayName },
        },
      });
      if (error) throw error;

      toast({
        title: "Revisa tu correo",
        description: "Te hemos enviado un enlace de verificación para completar tu registro.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
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
          Crear cuenta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Nombre de usuario
            </Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              className="h-12 bg-transparent border-border/60 rounded-xl text-base text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Correo electrónico
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Escribe tu correo electrónico"
              required
              className="h-12 bg-transparent border-border/60 rounded-xl text-base text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escribe la contraseña"
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

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Al crear una cuenta, aceptas las{" "}
            <span className="text-primary font-semibold">Condiciones de uso</span> y la{" "}
            <span className="text-primary font-semibold">Política de confidencialidad</span>.
          </p>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] rounded-full text-[0.9rem] font-semibold tracking-wide bg-muted text-muted-foreground hover:bg-muted/80 press-scale"
          >
            {loading ? "Cargando..." : "Crear cuenta"}
          </Button>
        </form>
      </motion.div>

      {/* Bottom link */}
      <div className="text-center pb-8 px-6 safe-bottom">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-semibold"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
