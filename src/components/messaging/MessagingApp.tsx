"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { loadConversations, saveConversations, type Conversation, type ChatMsg } from "@/lib/messagesData";

type Filter = "all" | "unread" | "pinned" | "archived";

export default function MessagingApp({ role }: { role: Role }) {
  const { ready } = useRoleGuard(role);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [input, setInput] = useState("");
  const [aiMode, setAiMode] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Olá! Sou o assistente FitPro. Em que posso ajudar hoje?" },
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = loadConversations(role);
    const initialId = list.find((c) => c.pinned)?.id || list[0]?.id || null;
    const cleared = initialId ? list.map((c) => (c.id === initialId ? { ...c, unread: 0 } : c)) : list;
    setConversations(cleared);
    setSelectedId(initialId);
    if (initialId) saveConversations(role, cleared);
  }, [role]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [selectedId, conversations, aiMessages, aiMode]);

  function update(list: Conversation[]) {
    setConversations(list);
    saveConversations(role, list);
  }

  function togglePin(id: string) {
    update(conversations.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  }
  function toggleArchive(id: string) {
    update(conversations.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c)));
  }
  function markUnread(id: string) {
    update(conversations.map((c) => (c.id === id ? { ...c, unread: c.unread > 0 ? 0 : 1 } : c)));
  }

  const selected = conversations.find((c) => c.id === selectedId) || null;

  function selectConversation(id: string) {
    setAiMode(false);
    setSelectedId(id);
    update(conversations.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function sendMessage() {
    const text = input.trim();
    if (!text || !selected) return;
    const msg: ChatMsg = { id: Math.random().toString(36).slice(2), from: "me", text, time: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }), type: "text" };
    const nextList = conversations.map((c) => (c.id === selected.id ? { ...c, messages: [...c.messages, msg], lastMessage: text, lastTime: "agora" } : c));
    update(nextList);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply: ChatMsg = { id: Math.random().toString(36).slice(2), from: "them", text: "Recebido! Já te respondo com mais detalhe. 👍", time: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }), type: "text" };
      setConversations((prev) => {
        const next = prev.map((c) => (c.id === selected.id ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text, lastTime: "agora" } : c));
        saveConversations(role, next);
        return next;
      });
      setTyping(false);
    }, 1600);
  }

  async function sendAiMessage() {
    const text = input.trim();
    if (!text || aiLoading) return;
    const next = [...aiMessages, { role: "user" as const, content: text }];
    setAiMessages(next);
    setInput("");
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, role, userName: "Utilizador" }),
      });
      const data = await res.json();
      setAiMessages((m) => [...m, { role: "assistant", content: data.content || "Não consegui responder agora." }]);
    } catch {
      setAiMessages((m) => [...m, { role: "assistant", content: "Ocorreu um erro a contactar o assistente." }]);
    } finally {
      setAiLoading(false);
    }
  }

  if (!ready) return null;

  const filtered = conversations
    .filter((c) => {
      if (filter === "unread") return c.unread > 0 && !c.archived;
      if (filter === "pinned") return c.pinned && !c.archived;
      if (filter === "archived") return c.archived;
      return !c.archived;
    })
    .filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <>
      <Sidebar role={role} active="messages" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Mensagens</h1>
          <p>As tuas conversas com clientes, treinadores, ginásios e a comunidade FitPro.</p>
        </div>

        <div className="chat-shell">
          <div className="chat-list">
            <div className="chat-list-head">
              <div className="search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Procurar conversas…" />
              </div>
              <div className="chat-list-filters">
                {(["all", "unread", "pinned", "archived"] as Filter[]).map((f) => (
                  <button key={f} className={`chat-list-filter ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                    {f === "all" ? "Todas" : f === "unread" ? "Não lidas" : f === "pinned" ? "Fixadas" : "Arquivadas"}
                  </button>
                ))}
              </div>
            </div>
            <div className="chat-list-body">
              <div className={`conv-row ${aiMode ? "selected" : ""}`} onClick={() => setAiMode(true)}>
                <div className="conv-cover" style={{ background: "linear-gradient(155deg,#14171A,#0E7C6B)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>🤖</div>
                <div className="conv-info">
                  <div className="conv-top-row"><span className="conv-name">Assistente FitPro (IA)</span></div>
                  <div className="conv-preview"><span className="conv-last">Pergunta-me qualquer coisa sobre a plataforma</span></div>
                </div>
              </div>
              {filtered.map((c) => (
                <div key={c.id} className={`conv-row ${!aiMode && selectedId === c.id ? "selected" : ""}`} onClick={() => selectConversation(c.id)}>
                  {c.pinned && <span className="conv-pin">📌</span>}
                  <div className="conv-cover" style={{ background: c.cover }}>
                    {c.online && <span className="conv-online-dot" />}
                  </div>
                  <div className="conv-info">
                    <div className="conv-top-row">
                      <span className="conv-name">{c.name}</span>
                      <span className="conv-time">{c.lastTime}</span>
                    </div>
                    <div className="conv-preview">
                      <span className="conv-last">{c.accountType} · {c.lastMessage}</span>
                      {c.unread > 0 && <span className="conv-unread">{c.unread}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p style={{ padding: 20, fontSize: 12.5, color: "var(--text-faint)" }}>Sem conversas aqui.</p>}
            </div>
          </div>

          <div className="chat-active">
            {aiMode ? (
              <>
                <div className="chat-active-head">
                  <div className="chat-active-user">
                    <div className="conv-cover" style={{ background: "linear-gradient(155deg,#14171A,#0E7C6B)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>🤖</div>
                    <div><div className="chat-active-name">Assistente FitPro</div><div className="chat-active-status">IA · sempre disponível</div></div>
                  </div>
                </div>
                <div className="chat-active-body" ref={bodyRef}>
                  {aiMessages.map((m, i) => (
                    <div key={i} className={`msg-bubble ${m.role === "user" ? "me" : "them"}`}>{m.content}</div>
                  ))}
                  {aiLoading && <div className="typing-indicator">Assistente a escrever…</div>}
                </div>
                <div className="chat-active-input">
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendAiMessage()} placeholder="Escreve a tua pergunta…" />
                  <button className="chat-send-btn" onClick={sendAiMessage} disabled={aiLoading}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" /></svg>
                  </button>
                </div>
              </>
            ) : selected ? (
              <>
                <div className="chat-active-head">
                  <div className="chat-active-user">
                    <div className="conv-cover" style={{ background: selected.cover }}>{selected.online && <span className="conv-online-dot" />}</div>
                    <div>
                      <div className="chat-active-name">{selected.name}</div>
                      <div className="chat-active-status">{selected.accountType} · {selected.online ? "Online" : "Offline"}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="icon-action" title={selected.pinned ? "Desafixar" : "Fixar"} onClick={() => togglePin(selected.id)}>📌</button>
                    <button className="icon-action" title={selected.archived ? "Desarquivar" : "Arquivar"} onClick={() => toggleArchive(selected.id)}>🗄️</button>
                    <button className="icon-action" title="Marcar como não lida" onClick={() => markUnread(selected.id)}>✉️</button>
                  </div>
                </div>
                <div className="chat-active-body" ref={bodyRef}>
                  {selected.messages.map((m) => (
                    <div key={m.id} className={`msg-bubble ${m.from}`}>
                      {m.text}
                      <span className="msg-time">{m.time}</span>
                    </div>
                  ))}
                  {typing && <div className="typing-indicator">{selected.name} está a escrever…</div>}
                </div>
                <div className="chat-active-input">
                  <label className="chat-attach-btn" title="Anexar ficheiro" style={{ cursor: "pointer" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.4 11.1 12.4 20a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 1 1-3-3l8-8" /></svg>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file || !selected) return;
                        const msg: ChatMsg = { id: Math.random().toString(36).slice(2), from: "me", text: `📎 ${file.name}`, time: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }), type: "text" };
                        update(conversations.map((c) => (c.id === selected.id ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, lastTime: "agora" } : c)));
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Escreve uma mensagem…" />
                  <button className="chat-send-btn" onClick={sendMessage}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" /></svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="chat-empty">
                <span style={{ fontSize: 32 }}>💬</span>
                <p>Seleciona uma conversa para começar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
