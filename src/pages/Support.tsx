import { Mail, HelpCircle, ShieldCheck } from "lucide-react";
import Orbs from "@/components/quiz/Orbs";

const faqs = [
  {
    q: "Quanto tempo leva para receber o acesso?",
    a: "O acesso é liberado automaticamente em até 5 minutos após a confirmação do pagamento. Se não recebeu, tente o botão 'Verificar novamente' na página de pós-checkout.",
  },
  {
    q: "Posso acessar de outro dispositivo?",
    a: "Sim! Basta usar o mesmo link de acesso enviado por email. Seu token é válido em qualquer dispositivo.",
  },
  {
    q: "Como solicitar reembolso?",
    a: "Envie um email para nosso suporte com o assunto 'Reembolso' e o ID do seu pedido. Processamos em até 7 dias úteis.",
  },
];

const Support = () => {
  return (
    <div className="min-h-screen px-5 py-12 bg-gradient-deep relative">
      <Orbs />
      <div className="max-w-md mx-auto relative z-10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-breathe" />
          <span className="text-primary text-xs font-medium uppercase tracking-[0.2em]">
            Suporte
          </span>
        </div>

        <h1 className="text-3xl font-light text-foreground mb-8">
          Como podemos <span className="text-gradient-spirit font-medium italic">ajudar?</span>
        </h1>

        {/* Contact */}
        <div className="bg-gradient-card-glass border-glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-foreground text-lg font-medium">Contato</h2>
          </div>
          <p className="text-secondary-foreground text-sm leading-relaxed font-light mb-4">
            Envie um email para nosso time de suporte. Respondemos em até 24 horas úteis.
          </p>
          <a
            href="mailto:suporte@astraapp.com.br"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium glow-button hover:brightness-110 transition-all"
          >
            <Mail className="w-4 h-4" />
            suporte@astraapp.com.br
          </a>
        </div>

        {/* Refund Policy */}
        <div className="bg-gradient-card-glass border-glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-foreground text-lg font-medium">Política de Reembolso</h2>
          </div>
          <p className="text-secondary-foreground text-sm leading-relaxed font-light">
            Oferecemos garantia de 7 dias. Se não estiver satisfeita com o conteúdo, solicite o reembolso integral enviando um email com o assunto "Reembolso" e o ID do seu pedido.
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-gradient-card-glass border-glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-foreground text-lg font-medium">Perguntas Frequentes</h2>
          </div>
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-foreground text-sm font-medium mb-1">{faq.q}</h3>
                <p className="text-secondary-foreground text-sm font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <a href="/quiz" className="block text-center text-muted-foreground text-xs mt-4 underline">
          Voltar ao início
        </a>
      </div>
    </div>
  );
};

export default Support;
