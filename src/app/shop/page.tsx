"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { catIcon, catBg, products, stockLabel, type ProductCat } from "@/lib/data";

const shopCats: { key: ProductCat | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "proteinas", label: "Proteínas" },
  { key: "ganho_massa", label: "Ganho de Massa" },
  { key: "energia_pre_treino", label: "Pré-treino" },
  { key: "perda_peso", label: "Perda de Peso" },
  { key: "vitaminas_minerais", label: "Vitaminas" },
];

export default function ShopPage() {
  const [shopCat, setShopCat] = useState<ProductCat | "all">("all");
  const recommended = useMemo(() => products.filter((p) => p.rec), []);
  const filteredProducts = useMemo(
    () => (shopCat === "all" ? products : products.filter((p) => p.c === shopCat)),
    [shopCat]
  );

  return (
    <>
      <Sidebar role="trainer" active="" />
      <Header />
      <div className="shell">
        <section className="panel active">
          <div className="page-head" style={{ paddingTop: 22 }}>
            <h1>Loja</h1>
            <p>Suplementos, equipamento e produtos de lojas parceiras.</p>
          </div>

          <div className="search" style={{ maxWidth: 360, marginBottom: 14 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input type="text" placeholder="Procurar produtos…" />
          </div>

          <div className="pill-row">
            {shopCats.map((c) => (
              <button key={c.key} className={`pill ${shopCat === c.key ? "active" : ""}`} onClick={() => setShopCat(c.key)}>
                {c.label}
              </button>
            ))}
            <span className="pill-sep" />
            <button className="pill">Emagrecimento</button>
            <button className="pill">Massa Muscular</button>
            <button className="pill">Performance</button>
          </div>

          <div className="section-head">
            <h2>Recomendado para si · IA</h2>
            <span>com base no teu objetivo</span>
          </div>
          <div className="card-row">
            {recommended.map((p) => (
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

          <div className="section-head">
            <h2>Mais vendidos</h2>
            <span>{filteredProducts.length} produtos</span>
          </div>
          <div className="grid">
            {filteredProducts.map((p) => (
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

          <div className="section-head">
            <h2>Lojas parceiras</h2>
            <span>3 lojas</span>
          </div>
          <div className="partners">
            <div className="partner-chip"><span className="partner-dot">NM</span>NutriMax Luanda</div>
            <div className="partner-chip"><span className="partner-dot">SF</span>SupleForte</div>
            <div className="partner-chip"><span className="partner-dot">CA</span>Corpo Ativo Shop</div>
          </div>
        </section>
      </div>
    </>
  );
}
