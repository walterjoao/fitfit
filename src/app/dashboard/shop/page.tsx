"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { products, catIcon, catBg, stockLabel } from "@/lib/data";

const kpis = [
  { label: "Produtos ativos", value: String(products.length), delta: "+2 este mês", icon: <><path d="M3 9 12 4l9 5-9 5-9-5Z" /><path d="M3 9v6l9 5 9-5V9" /></> },
  { label: "Encomendas hoje", value: "14", delta: "+3 vs. ontem", icon: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M3 11h18M9 3v4M15 3v4" /></> },
  { label: "Receita mensal", value: "620.400 Kz", delta: "+8,1%", icon: <path d="M12 3v3M12 18v3M6 8a3 3 0 0 1 3-3h4a3 3 0 1 1 0 6H9a3 3 0 1 0 0 6h6a3 3 0 0 0 3-3" /> },
  { label: "Avaliação média", value: "4.7", delta: "+0,1 este mês", icon: <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" /> },
];

export default function ShopDashboard() {
  return (
    <>
      <Sidebar role="shop" active="dashboard" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Dashboard</h1>
          <p>Bem-vindo de volta, aqui está a atividade da tua loja.</p>
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
              <div className="stat-delta up">▲ {k.delta}</div>
            </div>
          ))}
        </div>

        <div className="section-head">
          <h2>Os meus produtos</h2>
          <span>{products.length} produtos</span>
        </div>
        <div className="grid">
          {products.map((p) => (
            <div className="product" key={p.n}>
              <div className="product-img" style={{ background: catBg[p.c] }}>
                <span style={{ fontSize: 30 }}>{catIcon[p.c]}</span>
              </div>
              <div className="product-body">
                <div className="product-cat">{p.c.replace(/_/g, " ")}</div>
                <div className="product-name">{p.n}</div>
                <div className="product-meta"><span className="stars">★</span>{p.r.toFixed(1)}</div>
                <div className="product-foot">
                  <span className="product-price tabular">{p.p}</span>
                  <span className={`stock ${p.s}`}>{stockLabel[p.s]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
