"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Role } from "@/components/Sidebar";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useSession } from "@/lib/session";
import { isFollowing, toggleFollow } from "@/lib/directory";
import { directory } from "@/lib/directory";
import { shopProducts, shopCategoryLabel, stockLabel, shopProductPriceLabel, shopProductOriginalPriceLabel, type ProductCat } from "@/lib/data";

export default function StoreProfilePage() {
  const session = useSession();
  const params = useParams<{ id: string }>();
  const store = directory[params.id];
  const [following, setFollowing] = useState(store ? isFollowing(store.id) : false);
  const [category, setCategory] = useState<ProductCat | "all">("all");
  const [sort, setSort] = useState<"popularity" | "price">("popularity");

  const storeProducts = useMemo(() => shopProducts.filter((p) => p.storeId === params.id), [params.id]);
  const filtered = useMemo(
    () =>
      storeProducts
        .filter((p) => category === "all" || p.category === category)
        .sort((a, b) => (sort === "popularity" ? b.reviews - a.reviews : a.price - b.price)),
    [storeProducts, category, sort]
  );
  const availableCategories = useMemo(() => [...new Set(storeProducts.map((p) => p.category))], [storeProducts]);

  if (session === undefined) return null;
  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }
  if (!store || store.role !== "shop") {
    return (
      <>
        <Sidebar role={session.role as Role} active="" />
        <Header />
        <div className="shell"><div className="page-head" style={{ paddingTop: 22 }}><h1>Loja não encontrada</h1></div></div>
      </>
    );
  }

  return (
    <>
      <Sidebar role={session.role as Role} active="" />
      <Header />
      <div className="shell">
        <div className="store-header">
          <div className="store-cover" style={{ background: store.cover }} />
          <div className="dash-panel" style={{ borderRadius: 0, padding: "0 22px 22px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
              <div className="store-logo" style={{ background: store.cover }} />
              <div style={{ flex: 1, minWidth: 200, paddingBottom: 4 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>{store.name}</h2>
                <div className="rich-meta-row" style={{ marginTop: 4 }}>
                  <span>📍 {store.location}</span>
                  <span>⭐ {store.rating.toFixed(1)} ({store.reviews})</span>
                  <span>{store.followers} seguidores</span>
                </div>
              </div>
              <div className="rich-actions" style={{ marginTop: 0 }}>
                <button className={`btn ${following ? "btn-ghost" : "btn-primary"}`} onClick={() => setFollowing(toggleFollow(store.id))}>
                  {following ? "A Seguir ✓" : "Seguir Loja"}
                </button>
                <Link href="/dashboard/athlete/messages" className="btn btn-ghost">Mensagem</Link>
                {store.whatsapp && (
                  <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">WhatsApp</a>
                )}
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginTop: 14, maxWidth: 640 }}>{store.bio}</p>
          </div>
        </div>

        <div className="section-head"><h2>Produtos</h2><span>{filtered.length}</span></div>
        <div className="pill-row">
          <button className={`pill ${category === "all" ? "active" : ""}`} onClick={() => setCategory("all")}>Todos</button>
          {availableCategories.map((c) => (
            <button key={c} className={`pill ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{shopCategoryLabel[c]}</button>
          ))}
          <span className="pill-sep" />
          <select className="field-input" style={{ width: "auto", padding: "6.5px 13px", fontSize: 12.5 }} value={sort} onChange={(e) => setSort(e.target.value as "popularity" | "price")}>
            <option value="popularity">Popularidade</option>
            <option value="price">Preço</option>
          </select>
        </div>

        <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
          {filtered.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem produtos nesta categoria.</p>}
          {filtered.map((p) => (
            <Link href={`/dashboard/athlete/shop/${p.id}`} key={p.id} className="rich-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="rich-cover" style={{ background: `url(${p.images[0]}) center/cover no-repeat` }}>
                {p.discountPct && <span className="shop-discount-badge">-{p.discountPct}%</span>}
              </div>
              <div className="rich-body">
                <div className="rich-title">{p.name}</div>
                <div className="rich-meta-row">
                  <span>⭐ {p.rating.toFixed(1)}</span>
                  <span className={`stock ${p.stock}`}>{stockLabel[p.stock]}</span>
                </div>
                <div className="shop-price-row">
                  <span className="product-price tabular">{shopProductPriceLabel(p)}</span>
                  {p.discountPct && <span className="shop-price-old tabular">{shopProductOriginalPriceLabel(p)}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head"><h2>Avaliações da Loja</h2><span>{store.reviewsList.length}</span></div>
          <div className="dash-panel-body">
            {store.reviewsList.length === 0 && <p style={{ padding: "16px 20px", fontSize: 12.5, color: "var(--text-faint)" }}>Ainda sem avaliações.</p>}
            {store.reviewsList.map((r, i) => (
              <div className="schedule-item" key={i}>
                <span className="schedule-dot" />
                <div className="schedule-body">
                  <p>{r.author} <span style={{ color: "var(--gold)" }}>{"★".repeat(r.rating)}</span></p>
                  <span>{r.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
