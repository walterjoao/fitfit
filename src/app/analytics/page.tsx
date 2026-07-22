"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { earningsThisMonth, earningsGrowthPct, monthlyEarnings, payments } from "@/lib/trainerBusinessData";

export default function AnalyticsPage() {
  const { ready } = useRoleGuard("trainer");
  if (!ready) return null;

  const max = Math.max(...monthlyEarnings.map((m) => m.kz));
  const received = payments.filter((p) => p.status === "recebido");
  const pending = payments.filter((p) => p.status === "pendente");
  const totalReceived = received.reduce((a, p) => a + p.amount, 0);
  const totalPending = pending.reduce((a, p) => a + p.amount, 0);

  return (
    <>
      <Sidebar role="trainer" active="analytics" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Ganhos & Analítica</h1>
          <p>Receita, pagamentos recebidos e pendentes.</p>
        </div>

        <div className="finance-total">
          <div className="finance-total-label">Ganhos Este Mês</div>
          <div className="finance-total-value tabular">{earningsThisMonth.toLocaleString("pt-PT")} Kz</div>
          <div className="stat-delta up" style={{ marginTop: 6 }}>▲ +{earningsGrowthPct}% face ao mês anterior</div>
        </div>

        <div className="stat-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card"><div className="stat-top"><span className="stat-label">Recebido</span></div><div className="stat-value tabular">{totalReceived.toLocaleString("pt-PT")} Kz</div></div>
          <div className="stat-card"><div className="stat-top"><span className="stat-label">Pendente</span></div><div className="stat-value tabular">{totalPending.toLocaleString("pt-PT")} Kz</div></div>
          <div className="stat-card"><div className="stat-top"><span className="stat-label">Pagamentos</span></div><div className="stat-value tabular">{payments.length}</div></div>
        </div>

        <div className="dash-panel" style={{ marginBottom: 24 }}>
          <div className="dash-panel-head"><h2>Receita ao Longo do Tempo</h2><span>últimos 6 meses</span></div>
          <div className="dash-panel-body">
            <div className="chart-bars">
              {monthlyEarnings.map((m) => <div key={m.m} className="chart-bar" style={{ height: `${(m.kz / max) * 100}%` }} />)}
            </div>
            <div className="chart-bar-label" style={{ padding: "0 20px 16px" }}>
              {monthlyEarnings.map((m) => <span key={m.m}>{m.m}</span>)}
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Pagamentos Recebidos</h2><span>{received.length}</span></div>
            <div className="dash-panel-body">
              {received.map((p) => (
                <div className="schedule-item" key={p.id}>
                  <span className="schedule-dot" style={{ background: "var(--good)" }} />
                  <div className="schedule-body"><p>{p.from} · {p.service}</p><span>{p.date}</span></div>
                  <span className="tabular" style={{ marginLeft: "auto", fontWeight: 700 }}>{p.amount.toLocaleString("pt-PT")} Kz</span>
                </div>
              ))}
            </div>
          </div>
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Pagamentos Pendentes</h2><span>{pending.length}</span></div>
            <div className="dash-panel-body">
              {pending.length === 0 && <p style={{ padding: 20, fontSize: 12.5, color: "var(--text-faint)" }}>Sem pagamentos pendentes.</p>}
              {pending.map((p) => (
                <div className="schedule-item" key={p.id}>
                  <span className="schedule-dot" style={{ background: "var(--gold)" }} />
                  <div className="schedule-body"><p>{p.from} · {p.service}</p><span>{p.date}</span></div>
                  <span className="tabular" style={{ marginLeft: "auto", fontWeight: 700 }}>{p.amount.toLocaleString("pt-PT")} Kz</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
