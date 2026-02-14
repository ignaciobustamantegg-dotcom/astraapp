import { FileText, CreditCard, BookOpen, Eye, ShieldAlert, RefreshCw, Mail } from "lucide-react";
import Orbs from "@/components/quiz/Orbs";

const sections = [
  {
    icon: FileText,
    title: "Uso do Serviço",
    content:
      "Ao utilizar a plataforma Astra, você concorda em usar o conteúdo exclusivamente para fins pessoais e não comerciais. É proibida a reprodução, distribuição ou compartilhamento do material disponibilizado sem autorização prévia. Reservamo-nos o direito de suspender ou encerrar o acesso de qualquer usuária que viole estes termos.",
  },
  {
    icon: CreditCard,
    title: "Pagamentos e Reembolsos",
    content:
      "Os pagamentos são processados de forma segura através dos nossos parceiros de pagamento. Oferecemos garantia de 7 dias — se não estiver satisfeita com o conteúdo, você pode solicitar o reembolso integral enviando um email com o assunto \"Reembolso\" e o ID do seu pedido. Após o período de 7 dias, não serão aceitos pedidos de reembolso.",
  },
  {
    icon: BookOpen,
    title: "Propriedade Intelectual",
    content:
      "Todo o conteúdo disponibilizado na plataforma Astra — incluindo textos, áudios, imagens e materiais complementares — é protegido por direitos autorais. A compra concede uma licença pessoal e intransferível de uso. A reprodução, cópia ou distribuição do conteúdo sem autorização expressa constitui violação de direitos autorais.",
  },
  {
    icon: Eye,
    title: "Privacidade",
    content:
      "Respeitamos a sua privacidade. As informações pessoais coletadas são utilizadas exclusivamente para fornecer e melhorar nossos serviços. Não compartilhamos seus dados com terceiros sem o seu consentimento, exceto quando exigido por lei. Para mais detalhes, consulte nossa Política de Privacidade.",
  },
  {
    icon: ShieldAlert,
    title: "Limitação de Responsabilidade",
    content:
      "O conteúdo oferecido pela Astra tem caráter informativo e de autoconhecimento. Não substituímos acompanhamento profissional de saúde mental, terapia ou aconselhamento médico. A plataforma não se responsabiliza por decisões pessoais tomadas com base no conteúdo disponibilizado.",
  },
  {
    icon: RefreshCw,
    title: "Alterações nos Termos",
    content:
      "Reservamo-nos o direito de atualizar estes Termos e Condições a qualquer momento. As alterações entram em vigor imediatamente após a publicação. Recomendamos que você revise esta página periodicamente para se manter informada sobre eventuais mudanças.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen px-5 py-12 bg-gradient-deep relative">
      <Orbs />
      <div className="max-w-md mx-auto relative z-10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-breathe" />
          <span className="text-primary text-xs font-medium uppercase tracking-[0.2em]">
            Termos e Condições
          </span>
        </div>

        <h1 className="text-3xl font-light text-foreground mb-8">
          Termos de <span className="text-gradient-spirit font-medium italic">uso</span>
        </h1>

        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="bg-gradient-card-glass border-glass rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <h2 className="text-foreground text-lg font-medium">{section.title}</h2>
              </div>
              <p className="text-secondary-foreground text-sm leading-relaxed font-light">
                {section.content}
              </p>
            </div>
          );
        })}

        {/* Contact */}
        <div className="bg-gradient-card-glass border-glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-foreground text-lg font-medium">Contato</h2>
          </div>
          <p className="text-secondary-foreground text-sm leading-relaxed font-light mb-4">
            Em caso de dúvidas sobre estes termos, entre em contato conosco.
          </p>
          <a
            href="mailto:brendamattos.info@gmail.com"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium glow-button hover:brightness-110 transition-all"
          >
            <Mail className="w-4 h-4" />
            brendamattos.info@gmail.com
          </a>
        </div>

        <a href="/quiz" className="block text-center text-muted-foreground text-xs mt-4 underline">
          Voltar ao início
        </a>
      </div>
    </div>
  );
};

export default Terms;
