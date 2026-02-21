import { useState, useRef, useEffect, useCallback } from "react";
import { Moon, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuizProfile } from "@/hooks/useQuizProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export default function Chat() {
  const { profile, loading: profileLoading } = useQuizProfile();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const welcomeSent = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Personalized welcome message
  useEffect(() => {
    if (!profileLoading && !welcomeSent.current) {
      welcomeSent.current = true;
      if (profile) {
        const sentimentoClean = profile.sentimento
          ? profile.sentimento.split("(")[0].trim().toLowerCase()
          : "um momento de transformação";
        setMessages([
          {
            role: "assistant",
            content: `Olá, **${profile.archetype}** ✨\n\nEu sou Astra, sua guia emocional. Já li seu perfil e sei que você está passando por **${sentimentoClean}**. Estou aqui para te acompanhar.\n\nO que você gostaria de conversar hoje?`,
          },
        ]);
      } else {
        setMessages([
          {
            role: "assistant",
            content: `Olá ✨ Eu sou Astra, sua guia emocional. Estou aqui para te ouvir e acompanhar. O que você gostaria de conversar hoje?`,
          },
        ]);
      }
    }
  }, [profileLoading, profile]);

  const streamChat = useCallback(
    async (allMessages: Msg[]) => {
      setIsStreaming(true);
      let assistantSoFar = "";

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.length > 1) {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
            );
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: allMessages, profile }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({ error: "Erro de conexão" }));
          toast({ title: "Erro", description: err.error || "Tente novamente.", variant: "destructive" });
          setIsStreaming(false);
          return;
        }

        const reader = resp.body!.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          let idx: number;
          while ((idx = buf.indexOf("\n")) !== -1) {
            let line = buf.slice(0, idx);
            buf = buf.slice(idx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") break;
            try {
              const parsed = JSON.parse(json);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) upsert(content);
            } catch {
              buf = line + "\n" + buf;
              break;
            }
          }
        }
      } catch (e) {
        console.error(e);
        toast({ title: "Erro", description: "Não foi possível conectar com Astra.", variant: "destructive" });
      } finally {
        setIsStreaming(false);
      }
    },
    [profile, toast]
  );

  const send = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    const userMsg: Msg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    streamChat(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border/30">
        <button onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Avatar className="h-9 w-9 bg-primary/20">
          <AvatarFallback className="bg-primary/20">
            <Moon className="w-4 h-4 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">Astra</p>
          <p className="text-[11px] text-muted-foreground leading-tight">Sua guia emocional</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="flex flex-col gap-3 pb-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
            >
              {msg.role === "assistant" && (
                <Avatar className="h-7 w-7 mt-1 shrink-0 bg-primary/20">
                  <AvatarFallback className="bg-primary/20">
                    <Moon className="w-3.5 h-3.5 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border/40 text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-2">
              <Avatar className="h-7 w-7 mt-1 shrink-0 bg-primary/20">
                <AvatarFallback className="bg-primary/20">
                  <Moon className="w-3.5 h-3.5 text-primary animate-pulse" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border/40 rounded-2xl rounded-bl-md px-3.5 py-2.5">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="shrink-0 border-t border-border/30 px-3 py-2 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escreva sua mensagem..."
          rows={1}
          className="flex-1 bg-card border border-border/40 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 max-h-32"
          style={{ minHeight: "40px" }}
          disabled={isStreaming}
        />
        <Button
          size="icon"
          onClick={send}
          disabled={!input.trim() || isStreaming}
          className="h-10 w-10 rounded-xl shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
