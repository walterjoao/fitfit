"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";

const upcoming = [
  { time: "Hoje · 18:00", title: "Sessão com Ana Ferreira", type: "Personal Trainer" },
  { time: "Amanhã · 07:00", title: "Aula de Funcional em Grupo", type: "Ginásio" },
  { time: "Qui · 15:00", title: "Consulta com Inês Gonçalves", type: "Nutricionista" },
];

const recommendations = [
  { text: "3 Personal Trainers perto de ti", sub: "com base na tua localização" },
  { text: "Novo programa de treino de força disponível", sub: "com base no teu objetivo" },
  { text: "Nutricionista especializada em perda de peso", sub: "perto de ti" },
];

const messages = [
  { from: "Ana Ferreira", role: "Personal Trainer", preview: "Ótimo trabalho esta semana! Vamos subir a carga.", time: "há 1 h" },
  { from: "Inês Gonçalves", role: "Nutricionista", preview: "Atualizei o teu plano alimentar para a próxima semana.", time: "há 3 h" },
  { from: "FitPro Talatona", role: "Ginásio", preview: "A tua aula de amanhã foi confirmada.", time: "ontem" },
];

const insights = [
  { text: "O teu peso aumentou 2kg este mês e a tua atividade diminuiu 15%.", tone: "warn" as const },
  { text: "Já não treinas há 5 dias. Queres agendar uma sessão?", tone: "warn" as const },
  { text: "A tua treinadora recomendou um novo treino de força.", tone: "good" as const },
];

function Card({
  href,
  className = "dash-panel",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
      {children}
    </Link>
  );
}

export default function AthleteDashboard() {
  const { session, ready } = useRoleGuard("athlete");
  if (!ready) return null;

  const firstName = session?.name?.split(" ")[0] || "Atleta";

  return (
    <>
      <Sidebar role="athlete" active="dashboard" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22, display: "flex", alignItems: "center", gap: 14 }}>
          <span className="avatar" style={{ width: 48, height: 48, fontSize: 16 }}>
            {firstName.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <h1>Bom dia, {firstName}.</h1>
            <p>Pronto para o treino de hoje? Objetivo: Ganhar massa muscular · Nível: Intermédio.</p>
          </div>
        </div>

        <div className="stat-grid">
          <Card href="/dashboard/athlete/workouts" className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Atividade de Hoje</span>
              <span className="stat-icon" style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" /></svg>
              </span>
            </div>
            <div className="stat-value tabular">420 kcal</div>
            <div className="stat-delta up">▲ 6.240 passos · 48 min</div>
          </Card>

          <Card href="/dashboard/athlete/progress" className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Progresso</span>
              <span className="stat-icon" style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8M21 7v6h-6" /></svg>
              </span>
            </div>
            <div className="stat-value tabular">68%</div>
            <div className="stat-delta up">▲ -1,2 kg este mês</div>
          </Card>

          <Card href="/dashboard/athlete/bookings" className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Próxima Marcação</span>
              <span className="stat-icon" style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
              </span>
            </div>
            <div className="stat-value" style={{ fontSize: 15 }}>Hoje · 18:00</div>
            <div className="stat-delta up">Sessão com Ana Ferreira</div>
          </Card>

          <Card href="/dashboard/athlete/membership" className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Subscrição</span>
              <span className="stat-icon" style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /></svg>
              </span>
            </div>
            <div className="stat-value" style={{ fontSize: 15 }}>FitPro Talatona</div>
            <div className="stat-delta up">Plano Premium ativo</div>
          </Card>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Plano de Hoje</h2>
              <span>Treino de Força · Superior</span>
            </div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 12 }}>
                6 exercícios · 48 min · Notas da Ana: &ldquo;Aumenta a carga no supino em 2,5kg.&rdquo;
              </p>
              <Link href="/dashboard/athlete/workouts" className="btn btn-primary">Começar Treino</Link>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Nutrição de Hoje</h2>
              <span>1.840 / 2.200 kcal</span>
            </div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <div className="ai-box" style={{ marginTop: 0 }}>
                <div className="ai-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-3 2-5 5-5 9a5 5 0 0 0 10 0c0-4-2-7-5-9Z" /></svg>
                </div>
                <p>A tua nutricionista <b>atualizou o teu plano alimentar</b> — 3 refeições registadas hoje, 2,1L de água.</p>
              </div>
              <Link href="/dashboard/athlete/nutrition" className="btn btn-ghost" style={{ marginTop: 12 }}>Ver plano completo</Link>
            </div>
          </div>
        </div>

        <div className="dash-panel" style={{ marginBottom: 20 }}>
          <div className="dash-panel-head">
            <h2>Próximas Marcações</h2>
            <span>{upcoming.length} agendadas</span>
          </div>
          <div className="dash-panel-body">
            {upcoming.map((u) => (
              <div className="schedule-item" key={u.title}>
                <span className="schedule-dot" />
                <div className="schedule-body">
                  <p>{u.title}</p>
                  <span>{u.time} · {u.type}</span>
                </div>
                <Link href="/dashboard/athlete/bookings" className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}>Ver detalhes</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="section-head">
          <h2>Recomendado para Ti</h2>
          <span>com base na IA</span>
        </div>
        <div className="dash-panel" style={{ marginBottom: 20 }}>
          <div className="dash-panel-body">
            {recommendations.map((r) => (
              <Link href="/dashboard/athlete/nearby" key={r.text} className="schedule-item" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="schedule-dot" />
                <div className="schedule-body">
                  <p>{r.text}</p>
                  <span>{r.sub}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="dash-row">
          <Card href="/dashboard/athlete/achievements">
            <div className="dash-panel-head">
              <h2>Conquistas</h2>
              <span>ver todas</span>
            </div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <div className="ai-box" style={{ marginTop: 0, background: "var(--gold-soft)" }}>
                <p style={{ color: "var(--gold-ink)" }}>🔥 <b>14 dias</b> de sequência de treino</p>
              </div>
            </div>
          </Card>

          <Card href="/dashboard/athlete/messages">
            <div className="dash-panel-head">
              <h2>Mensagens Recentes</h2>
              <span>ver tudo</span>
            </div>
            <div className="dash-panel-body">
              {messages.map((m) => (
                <div className="schedule-item" key={m.from}>
                  <span className="lb-av">{m.from.slice(0, 2).toUpperCase()}</span>
                  <div className="schedule-body">
                    <p>{m.from} <span style={{ fontWeight: 400, color: "var(--text-faint)" }}>· {m.role}</span></p>
                    <span>{m.preview}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="section-head">
          <h2>Perceções da IA</h2>
          <span>análise automática do teu progresso</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {insights.map((i, idx) => (
            <div key={idx} className="ai-box" style={{ marginTop: 0, background: i.tone === "warn" ? "var(--bad-soft)" : "var(--good-soft)" }}>
              <div className="ai-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="3.2" /></svg>
              </div>
              <p style={{ color: i.tone === "warn" ? "var(--bad)" : "var(--good)" }}>{i.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
