"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { financeByRole, type RoleKey } from "@/lib/accountData";

export default function RoleFinance({ role, sidebarActive }: { role: RoleKey; sidebarActive: string }) {
  const { ready } = useRoleGuard(role);
  if (!ready) return null;

  const data = financeByRole[role];

  return (
    <>
      <Sidebar role={role as Role} active={sidebarActive} />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Finanças</h1>
          <p>Visão geral da tua atividade financeira na FitPro.</p>
        </div>

        <div className="stat-grid">
          {data.kpis.map((k) => (
            <div className="stat-card" key={k.label}>
              <div className="stat-top"><span className="stat-label">{k.label}</span></div>
              <div className="stat-value tabular">{k.value}</div>
              <div className="stat-delta up">{k.delta}</div>
            </div>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Transações Recentes</h2>
            <span>{data.transactions.length}</span>
          </div>
          <div className="dash-panel-body">
            {data.transactions.map((t, i) => (
              <div className="tx-row" key={i}>
                <div className="tx-info">
                  <div className="tx-label">{t.label}</div>
                  <div className="tx-sub">{t.sub}</div>
                </div>
                <span className={`tx-amount ${t.dir}`}>{t.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
