"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { messagesPath } from "@/lib/accountData";
import {
  trainees, todaySessions, earningsThisMonth, earningsGrowthPct,
  monthlyEarnings, sessionsCompletedTrend, clientGrowthTrend,
  aiTrainerInsights, contentPerformance,
} from "@/lib/trainerBusinessData";
import { directory } from "@/lib/directory";

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

type Period = "7d" | "30d" | "90d";

const trendByMetric = {
  earnings: monthlyEarnings.map((m) => ({ label: m.m, value: m.kz })),
  sessions: sessionsCompletedTrend.map((m) => ({ label: m.m, value: m.v })),
  clients: clientGrowthTrend.map((m) => ({ label: m.m, value: m.v })),
};

export default function TrainerDashboard() {
  const { ready } = useRoleGuard("trainer");
  const [metric, setMetric] = useState<keyof typeof trendByMetric>("earnings");
  const [period, setPeriod] = useState<Period>("30d");
  if (!ready) return null;

  const trend = trendByMetric[metric];
  const max = Math.max(...trend.map((t) => t.value));
  const activeCount = trainees.filter((t) => t.status !== "inactive").length;
  const newMessages = 3;
  const pt = directory["ana-ferreira"];

  return (
    <>
      <Sidebar role="trainer" active="dashboard" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Dashboard</h1>
          <p>Visão geral do teu negócio, clientes e sessões de hoje.</p>
        </div>

        <div className="stat-grid">
          <Link href="/clients" className="stat-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="stat-top"><span className="stat-label">👥 Clientes Ativos</span></div>
            <div className="stat-value tabular">{activeCount}</div>
            <div className="stat-delta up">▲ +2 este mês</div>
          </Link>
          <Link href="/analytics" className="stat-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="stat-top"><span className="stat-label">💰 Ganhos Este Mês</span></div>
            <div className="stat-value tabular">{earningsThisMonth.toLocaleString("pt-PT")} Kz</div>
            <div className="stat-delta up">▲ +{earningsGrowthPct}%</div>
          </Link>
          <Link href="/calendar" className="stat-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="stat-top"><span className="stat-label">📅 Sessões Hoje</span></div>
            <div className="stat-value tabular">{todaySessions.length}</div>
            <div className="stat-delta up">{todaySessions.filter((s) => s.status === "concluída").length} concluídas</div>
          </Link>
          <Link href={messagesPath("trainer")} className="stat-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="stat-top"><span className="stat-label">💬 Novas Mensagens</span></div>
            <div className="stat-value tabular">{newMessages}</div>
            <div className="stat-delta up">Por responder</div>
          </Link>
        </div>

        <div className="dash-row" style={{ marginBottom: 24, alignItems: "start" }}>
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Analítica</h2>
              <div style={{ display: "flex", gap: 6 }}>
                {(["7d", "30d", "90d"] as Period[]).map((p) => (
                  <button key={p} className={`pill ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)} style={{ padding: "4px 10px", fontSize: 11 }}>{p}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: "0 20px" }}>
              <div className="pill-row" style={{ marginBottom: 4 }}>
                <button className={`pill ${metric === "earnings" ? "active" : ""}`} onClick={() => setMetric("earnings")}>Ganhos</button>
                <button className={`pill ${metric === "sessions" ? "active" : ""}`} onClick={() => setMetric("sessions")}>Sessões</button>
                <button className={`pill ${metric === "clients" ? "active" : ""}`} onClick={() => setMetric("clients")}>Clientes</button>
              </div>
            </div>
            <div className="dash-panel-body">
              <div className="chart-bars" style={{ height: 120 }}>
                {trend.map((t) => <div key={t.label} className="chart-bar" style={{ height: `${(t.value / max) * 100}%` }} />)}
              </div>
              <div className="chart-bar-label" style={{ padding: "0 20px 16px" }}>
                {trend.map((t) => <span key={t.label}>{t.label}</span>)}
              </div>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Sessões de Hoje</h2><Link href="/calendar" style={{ fontSize: 11.5, color: "var(--accent-ink)" }}>Calendário →</Link></div>
            <div className="dash-panel-body">
              {todaySessions.map((s) => (
                <div className="schedule-item" key={s.id}>
                  <span className="lb-av">{initials(s.traineeName)}</span>
                  <div className="schedule-body">
                    <p>{s.traineeName}</p>
                    <span>{s.time} · {s.type}</span>
                  </div>
                  <span className={`badge-status ${s.status === "concluída" ? "concluída" : "confirmada"}`} style={{ marginLeft: "auto", marginRight: 10 }}>{s.status}</span>
                  {s.status !== "concluída" && <button className="btn btn-ghost btn-sm">Iniciar</button>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-head"><h2>Clientes Ativos</h2><Link href="/clients" style={{ fontSize: 12, color: "var(--accent-ink)" }}>Ver todos →</Link></div>
        <div className="rich-grid" style={{ marginBottom: 28 }}>
          {trainees.slice(0, 4).map((t) => (
            <div className="rich-card" key={t.id}>
              <Link href={`/profile/${t.profileId}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="rich-cover" style={{ background: `url(${t.avatar}) center/cover no-repeat`, height: 110 }}>
                  <span className="rich-badge">{t.goal}</span>
                </div>
              </Link>
              <div className="rich-body">
                <Link href={`/profile/${t.profileId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="rich-title">{t.name}</div>
                </Link>
                <div className="rich-meta-row"><span>Última atividade: {t.lastActivity}</span></div>
                <div className="rich-progress"><div className="rich-progress-fill" style={{ width: `${t.progress}%` }} /></div>
                <div className="rich-actions">
                  <Link href={messagesPath("trainer")} className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: "center" }}>Mensagem</Link>
                  <Link href={`/programs?athlete=${t.id}`} className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: "center" }}>Atribuir Treino</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-row" style={{ marginBottom: 24 }}>
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>🤖 Perceções da IA</h2></div>
            <div className="dash-panel-body" style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {aiTrainerInsights.map((text, i) => (
                <div className="ai-box" key={i} style={{ marginTop: 0 }}>
                  <div className="ai-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-3 2-5 5-5 9a5 5 0 0 0 10 0c0-4-2-7-5-9Z" /></svg>
                  </div>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h2>⭐ Avaliações</h2><Link href={`/profile/${pt?.id}`} style={{ fontSize: 11.5, color: "var(--accent-ink)" }}>Ver todas →</Link></div>
            <div className="dash-panel-body" style={{ padding: "14px 20px" }}>
              <p style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }} className="tabular">⭐ {pt?.rating.toFixed(1)} <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-faint)" }}>({pt?.reviews} avaliações)</span></p>
              {(pt?.reviewsList || []).slice(0, 2).map((r, i) => (
                <div className="schedule-item" key={i} style={{ paddingLeft: 0 }}>
                  <span className="lb-av">{initials(r.author)}</span>
                  <div className="schedule-body">
                    <p>{r.author} <span style={{ color: "var(--gold)" }}>{"★".repeat(r.rating)}</span></p>
                    <span>{r.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-head"><h2>Desempenho de Conteúdo</h2></div>
        <div className="rich-grid">
          <Link href={`/dashboard/athlete/workouts/${contentPerformance.topWorkout.id}`} className="rich-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="rich-body">
              <div className="rich-meta-row"><span>🏆 Treino Mais Popular</span></div>
              <div className="rich-title">{contentPerformance.topWorkout.name}</div>
              <div className="rich-meta-row"><span>{contentPerformance.topWorkout.completions} conclusões</span></div>
            </div>
          </Link>
          <div className="rich-card">
            <div className="rich-body">
              <div className="rich-meta-row"><span>💪 Exercício Mais Usado</span></div>
              <div className="rich-title">{contentPerformance.topExercise.name}</div>
              <div className="rich-meta-row"><span>{contentPerformance.topExercise.completions} execuções</span></div>
            </div>
          </div>
          <Link href="/programs" className="rich-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="rich-body">
              <div className="rich-meta-row"><span>🧑‍🤝‍🧑 Aula Mais Popular</span></div>
              <div className="rich-title">{contentPerformance.topClass.name}</div>
              <div className="rich-meta-row"><span>{contentPerformance.topClass.enrolled} inscritos</span></div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
