import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Orbs from "@/components/quiz/Orbs";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";

const CreateAccount = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email") || "";
  const token = params.get("token") || "";

  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email não encontrado. Volte ao início e tente novamente.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || undefined },
        },
      });

      if (signUpError) {
        if (signUpError.message?.includes("already registered")) {
          // User already exists — try to sign in instead
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) {
            setError("Este email já possui uma conta. Tente fazer login com sua senha.");
            setLoading(false);
            return;
          }
        } else {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
      }

      // Link order to user if we have a token and user_id
      const userId = data?.user?.id;
      if (userId && token) {
        // Fire and forget — non-blocking
        supabase.functions.invoke("link-order", {
          body: { token, user_id: userId },
        }).catch(() => {});
      }

      navigate("/home", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-deep relative">
      <Orbs />
      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-light text-foreground mb-2">
            Pagamento confirmado!
          </h1>
          <p className="text-muted-foreground text-sm">
            Crie sua conta para acessar todo o conteúdo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Email
            </label>
            <Input
              type="email"
              value={email}
              disabled
              className="bg-secondary/50 opacity-70 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Seu nome
            </label>
            <Input
              type="text"
              placeholder="Como quer ser chamada?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              className="bg-secondary/30 border-border"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Crie uma senha
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="bg-secondary/30 border-border pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-destructive text-xs bg-destructive/10 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="flex items-center justify-center gap-2 w-full px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-medium glow-button hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar minha conta"
            )}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Já tem uma conta?{" "}
          <a href="/login" className="text-primary underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
