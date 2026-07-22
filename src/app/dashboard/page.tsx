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
} from "@/lib/trainerBusinessData";

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

        <div className="dash-panel" style={{ marginBottom: 24 }}>
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
              <button className={`pill ${metric === "earnings" ? "active" : ""}`} onClick={() => setMetric("earnings")}>Ganhos Mensais</button>
              <button className={`pill ${metric === "sessions" ? "active" : ""}`} onClick={() => setMetric("sessions")}>Sessões Concluídas</button>
              <button className={`pill ${metric === "clients" ? "active" : ""}`} onClick={() => setMetric("clients")}>Crescimento de Clientes</button>
            </div>
          </div>
          <div className="dash-panel-body">
            <div className="chart-bars">
              {trend.map((t) => <div key={t.label} className="chart-bar" style={{ height: `${(t.value / max) * 100}%` }} />)}
            </div>
            <div className="chart-bar-label" style={{ padding: "0 20px 16px" }}>
              {trend.map((t) => <span key={t.label}>{t.label}</span>)}
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
                  <Link href="/programs" className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: "center" }}>Atribuir Treino</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head"><h2>Sessões de Hoje</h2><span>{todaySessions.length}</span></div>
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
    </>
  );
}
