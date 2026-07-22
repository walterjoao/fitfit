"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const kpis = [
  { label: "Total de Utilizadores", value: "1.412", icon: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></> },
  { label: "Ginásios Ativos", value: "6", icon: <><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /></> },
  { label: "Personal Trainers", value: "84", icon: <path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" /> },
  { label: "Receita Total", value: "12.480.000 Kz", icon: <path d="M12 3v3M12 18v3M6 8a3 3 0 0 1 3-3h4a3 3 0 1 1 0 6H9a3 3 0 1 0 0 6h6a3 3 0 0 0 3-3" /> },
];

const shortcuts = [
  { label: "Clientes (Trainer)", href: "/clients" },
  { label: "Membros (Ginásio)", href: "/dashboard/gym/members" },
  { label: "Treinadores", href: "/dashboard/gym/trainers" },
  { label: "Planos Alimentares", href: "/dashboard/nutritionist/meal-plans" },
  { label: "Subscrições", href: "/dashboard/gym/subscriptions" },
  { label: "Pagamentos", href: "/dashboard/gym/payments" },
];

export default function AdminDashboard() {
  return (
    <>
      <Sidebar role="admin" active="dashboard" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Dashboard · Admin</h1>
          <p>Acesso completo a todas as áreas da plataforma FitPro.</p>
        </div>

        <div className="stat-grid">
          {kpis.map((k) => (
            <div className="stat-card" key={k.label}>
              <div className="stat-top">
                <span className="stat-label">{k.label}</span>
                <span className="stat-icon" style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {k.icon}
                  </svg>
                </span>
              </div>
              <div className="stat-value tabular">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Acesso rápido</h2>
            <span>todas as áreas</span>
          </div>
          <div className="dash-panel-body" style={{ padding: "14px 20px", display: "flex", flexWrap: "wrap", gap: 10 }}>
            {shortcuts.map((s) => (
              <Link key={s.href} href={s.href} className="pill">
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
