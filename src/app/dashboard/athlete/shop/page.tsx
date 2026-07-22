"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import {
  shopProducts, shopCategoryLabel, stockLabel, shopProductPriceLabel, shopProductOriginalPriceLabel,
  isWishlisted, toggleWishlist, type ProductCat,
} from "@/lib/data";
import { directory } from "@/lib/directory";

const categories: { key: ProductCat | "all"; label: string; icon: string }[] = [
  { key: "all", label: "Todos", icon: "🛍️" },
  { key: "ganho_massa", label: "Suplementos", icon: "💊" },
  { key: "proteinas", label: "Proteína", icon: "🥤" },
  { key: "roupa_fitness", label: "Roupa Fitness", icon: "👕" },
  { key: "equipamentos", label: "Equipamento", icon: "🏋️" },
  { key: "acessorios", label: "Acessórios", icon: "🧘" },
  { key: "energia_pre_treino", label: "Recuperação", icon: "⚡" },
  { key: "vitaminas_minerais", label: "Nutrição", icon: "🥗" },
];

function ProductCard({ p, wishlist, onToggleWishlist }: { p: typeof shopProducts[number]; wishlist: string[]; onToggleWishlist: (id: string) => void }) {
  const wished = wishlist.includes(p.id);
  return (
    <div className="rich-card">
      <Link href={`/dashboard/athlete/shop/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="rich-cover" style={{ background: `url(${p.images[0]}) center/cover no-repeat` }}>
          {p.discountPct && <span className="shop-discount-badge">-{p.discountPct}%</span>}
        </div>
      </Link>
      <div className="rich-body">
        <Link href={`/dashboard/athlete/shop/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="rich-title">{p.name}</div>
        </Link>
        <div className="rich-meta-row"><span>{p.storeName}</span></div>
        <div className="rich-meta-row">
          <span>⭐ {p.rating.toFixed(1)} ({p.reviews})</span>
          <span className={`stock ${p.stock}`}>{stockLabel[p.stock]}</span>
        </div>
        <div className="shop-price-row">
          <span className="product-price tabular">{shopProductPriceLabel(p)}</span>
          {p.discountPct && <span className="shop-price-old tabular">{shopProductOriginalPriceLabel(p)}</span>}
        </div>
        <div className="rich-actions">
          <Link href={`/dashboard/athlete/shop/${p.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: "center" }}>Ver Produto</Link>
          <button className={`shop-wishlist-btn ${wished ? "active" : ""}`} title="Wishlist" onClick={() => onToggleWishlist(p.id)}>
            {wished ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AthleteShopPage() {
  const { ready } = useRoleGuard("athlete");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCat | "all">("all");
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setWishlist(shopProducts.filter((p) => isWishlisted(p.id)).map((p) => p.id));
  }, []);

  const filtered = useMemo(
    () =>
      shopProducts.filter((p) => {
        const q = query.toLowerCase();
        const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q);
        const matchesCategory = category === "all" || p.category === category;
        return matchesQuery && matchesCategory;
      }),
    [query, category]
  );

  if (!ready) return null;

  function onToggleWishlist(id: string) {
    toggleWishlist(id);
    setWishlist(shopProducts.filter((p) => isWishlisted(p.id)).map((p) => p.id));
  }

  const recommended = shopProducts.filter((p) => !p.isNew && !p.bestseller).slice(0, 4);
  const bestsellers = shopProducts.filter((p) => p.bestseller);
  const newest = shopProducts.filter((p) => p.isNew);
  const promotions = shopProducts.filter((p) => p.discountPct);
  const nearbyStores = Object.values(directory).filter((d) => d.role === "shop");

  return (
    <>
      <Sidebar role="athlete" active="shop" />
      <Header />
      <div className="shell">
        <div className="mkt-hero">
          <h1>Loja FitPro</h1>
          <p>Descobre suplementos, roupa, equipamento e tudo o que precisas para a tua jornada fitness.</p>
          <form className="mkt-search" onSubmit={(e) => e.preventDefault()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar suplementos, roupa, equipamentos…" />
          </form>
        </div>

        <div className="pill-row">
          {categories.map((c) => (
            <button key={c.key} className={`pill ${category === c.key ? "active" : ""}`} onClick={() => setCategory(c.key)}>{c.icon} {c.label}</button>
          ))}
        </div>

        {(query || category !== "all") ? (
          <>
            <div className="section-head"><h2>Resultados</h2><span>{filtered.length}</span></div>
            <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {filtered.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem resultados.</p>}
              {filtered.map((p) => <ProductCard p={p} key={p.id} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />)}
            </div>
          </>
        ) : (
          <>
            <div className="section-head"><h2>Produtos Recomendados</h2></div>
            <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
              {recommended.map((p) => <ProductCard p={p} key={p.id} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />)}
            </div>

            <div className="section-head"><h2>Mais Vendidos</h2></div>
            <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
              {bestsellers.map((p) => <ProductCard p={p} key={p.id} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />)}
            </div>

            <div className="section-head"><h2>Novidades</h2></div>
            <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
              {newest.map((p) => <ProductCard p={p} key={p.id} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />)}
            </div>

            <div className="section-head"><h2>Promoções</h2></div>
            <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
              {promotions.map((p) => <ProductCard p={p} key={p.id} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />)}
            </div>

            <div className="section-head"><h2>Lojas Perto de Ti</h2></div>
            <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {nearbyStores.map((s) => (
                <Link href={`/store/${s.id}`} key={s.id} className="rich-card" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="rich-cover" style={{ background: s.cover }} />
                  <div className="rich-body">
                    <div className="rich-title">{s.name}</div>
                    <div className="rich-meta-row"><span>📍 {s.location}</span></div>
                    <div className="rich-meta-row"><span>⭐ {s.rating.toFixed(1)} ({s.reviews})</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
