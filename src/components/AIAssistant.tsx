"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/ai/types";

type Msg = { role: "user" | "assistant"; content: string };

const roleLabel: Record<Role, string> = {
  athlete: "Atleta",
  trainer: "Personal Trainer",
  nutritionist: "Nutricionista",
  gym: "Ginásio",
  shop: "Lojista",
};

function toAIRole(role: string): Role {
  return role === "athlete" || role === "trainer" || role === "nutritionist" || role === "gym" || role === "shop"
    ? role
    : "trainer";
}

export default function AIAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>("trainer");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Olá! Sou o assistente FitPro. Pergunta-me como criar um treino, adicionar um cliente, ver o teu progresso e mais." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent).detail as { role?: string } | undefined;
      if (detail?.role) setRole(toAIRole(detail.role));
      setOpen(true);
    }
    window.addEventListener("fitpro:open-ai", onOpen);
    return () => window.removeEventListener("fitpro:open-ai", onOpen);
  }, []);

  if (pathname === "/" || pathname === "/login") return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, role, userName: "Ana" }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.content || "Não consegui responder agora." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Ocorreu um erro a contactar o assistente." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-widget">
      {open && (
        <div className="ai-panel">
          <div className="ai-panel-head">
            <div>
              <p className="ai-panel-title">Assistente FitPro</p>
              <span className="ai-panel-sub">Sempre disponível para ajudar</span>
            </div>
            <span className="ai-role-select">{roleLabel[role]}</span>
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Fechar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="ai-panel-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-bubble ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="ai-bubble assistant ai-typing">A escrever…</div>}
          </div>

          <div className="ai-panel-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escreve a tua pergunta…"
            />
            <button onClick={send} disabled={loading} aria-label="Enviar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" /></svg>
            </button>
          </div>
        </div>
      )}

      <button className="ai-fab" onClick={() => setOpen((o) => !o)} aria-label="Abrir assistente">
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="3.2" /></svg>
        )}
      </button>
    </div>
  );
}
