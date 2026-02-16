import { Shield, Database, Cookie, UserCheck, Mail } from "lucide-react";
import Orbs from "@/components/quiz/Orbs";

const sections = [
  {
    icon: Database,
    title: "Dados Coletados",
    content: "Coletamos apenas as informações necessárias para fornecer nossos serviços: endereço de e-mail, nome de usuário e dados de uso da plataforma. Não coletamos dados sensíveis sem o seu consentimento explícito.",
  },
  {
    icon: Shield,
    title: "Proteção de Dados",
    content: "Seus dados são armazenados de forma segura com criptografia. Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração ou destruição.",
  },
  {
    icon: Cookie,
    title: "Cookies e Rastreamento",
    content: "Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para melhorar sua experiência. Você pode gerenciar suas preferências de cookies a qualquer momento nas configurações do seu navegador.",
  },
  {
    icon: UserCheck,
    title: "Seus Direitos",
    content: "Você tem direito a acessar, corrigir, excluir ou exportar seus dados pessoais a qualquer momento. Para exercer seus direitos, entre em contato conosco pelo e-mail abaixo.",
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen px-5 py-12 bg-gradient-deep relative">
      <Orbs />
      <div className="max-w-md mx-auto relative z-10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-breathe" />
          <span className="text-primary text-xs font-medium uppercase tracking-[0.2em]">Privacidade</span>
        </div>
        <h1 className="text-3xl font-light text-foreground mb-8">
          Política de <span className="text-gradient-spirit font-medium italic">privacidade</span>
        </h1>
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="bg-gradient-card-glass border-glass rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <h2 className="text-foreground text-lg font-medium">{section.title}</h2>
              </div>
              <p className="text-secondary-foreground text-sm leading-relaxed font-light">{section.content}</p>
            </div>
          );
        })}
        <div className="bg-gradient-card-glass border-glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-foreground text-lg font-medium">Contato</h2>
          </div>
          <p className="text-secondary-foreground text-sm leading-relaxed font-light mb-4">
            Para questões sobre privacidade, entre em contato conosco.
          </p>
          <a href="mailto:negociossbmarketing@gmail.com" className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium glow-button hover:brightness-110 transition-all">
            <Mail className="w-4 h-4" />
            negociossbmarketing@gmail.com
          </a>
        </div>
        <a href="/quiz" className="block text-center text-muted-foreground text-xs mt-4 underline">Voltar ao início</a>
      </div>
    </div>
  );
};

export default Privacy;
