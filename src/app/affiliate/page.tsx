"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useSession } from "@/lib/session";

const kpis = [
  { label: "Cliques totais", value: "1.284" },
  { label: "Utilizadores registados", value: "96" },
  { label: "Conversões", value: "41" },
  { label: "Comissão ganha", value: "184.500 Kz" },
];

const history = [
  { label: "Novo Personal Trainer registado", sub: "via o teu link", amount: "+4.500 Kz" },
  { label: "Nova Atleta registada", sub: "via o teu link", amount: "+1.200 Kz" },
  { label: "Levantamento", sub: "Conta bancária ·· 4821", amount: "-50.000 Kz" },
];

export default function AffiliatePage() {
  const session = useSession();
  if (session === undefined) return null;
  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  const link = `https://fitpro.ancoia.com/?ref=${session.email.split("@")[0] || "utilizador"}`;

  return (
    <>
      <Sidebar role={session.role as Role} active="" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Afiliados</h1>
          <p>Convida Personal Trainers, Nutricionistas, Ginásios e Atletas e ganha comissão.</p>
        </div>

        <div className="field-label" style={{ marginBottom: 8 }}>O teu link de afiliado</div>
        <div className="affiliate-link-box" style={{ marginBottom: 24 }}>
          <input readOnly value={link} />
          <button className="btn btn-primary btn-sm" onClick={() => navigator.clipboard?.writeText(link)}>Copiar</button>
        </div>

        <div className="stat-grid">
          {kpis.map((k) => (
            <div className="stat-card" key={k.label}>
              <div className="stat-top"><span className="stat-label">{k.label}</span></div>
              <div className="stat-value tabular">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="dash-panel" style={{ marginBottom: 20 }}>
          <div className="dash-panel-head">
            <h2>Histórico de Afiliados</h2>
            <span>últimos eventos</span>
          </div>
          <div className="dash-panel-body">
            {history.map((h, i) => (
              <div className="tx-row" key={i}>
                <div className="tx-info">
                  <div className="tx-label">{h.label}</div>
                  <div className="tx-sub">{h.sub}</div>
                </div>
                <span className={`tx-amount ${h.amount.startsWith("+") ? "in" : "out"}`}>{h.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-ghost">Pedir Levantamento</button>
      </div>
    </>
  );
}
