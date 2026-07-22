"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import {
  shopProducts, stockLabel, shopCategoryLabel, shopProductPriceLabel, shopProductOriginalPriceLabel,
  isWishlisted, toggleWishlist, addToCart,
} from "@/lib/data";

export default function ProductDetailPage() {
  const { ready } = useRoleGuard("athlete");
  const params = useParams<{ id: string }>();
  const product = useMemo(() => shopProducts.find((p) => p.id === params.id), [params.id]);
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) setWished(isWishlisted(product.id));
  }, [product]);

  if (!ready) return null;
  if (!product) {
    return (
      <>
        <Sidebar role="athlete" active="shop" />
        <Header />
        <div className="shell"><div className="page-head" style={{ paddingTop: 22 }}><h1>Produto não encontrado</h1></div></div>
      </>
    );
  }

  function addProductToCart() {
    addToCart(product!.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      <Sidebar role="athlete" active="shop" />
      <Header />
      <div className="shell">
        <Link href="/dashboard/athlete/shop" className="auth-back" style={{ marginBottom: 14, display: "inline-block" }}>← Voltar à Loja</Link>

        <div className="dash-row" style={{ marginBottom: 24 }}>
          <div>
            <div className="shop-gallery-main" style={{ backgroundImage: `url(${product.images[activeImg]})` }} />
            <div className="shop-gallery-thumbs">
              {product.images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={img} src={img} alt={product.name} className={i === activeImg ? "active" : ""} onClick={() => setActiveImg(i)} />
              ))}
            </div>
          </div>

          <div className="dash-panel" style={{ padding: 22 }}>
            <span className="rich-badge" style={{ background: "var(--accent-soft)", color: "var(--accent-ink)", display: "inline-block", marginBottom: 10 }}>
              {shopCategoryLabel[product.category]}
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{product.name}</h2>
            <p style={{ fontSize: 12.5, color: "var(--text-faint)", marginBottom: 10 }}>
              Vendido por <Link href={`/store/${product.storeId}`} style={{ color: "var(--accent-ink)", fontWeight: 700 }}>{product.storeName}</Link>
            </p>
            <div className="rich-meta-row" style={{ marginBottom: 12 }}>
              <span>⭐ {product.rating.toFixed(1)} ({product.reviews} avaliações)</span>
              <span className={`stock ${product.stock}`}>{stockLabel[product.stock]}</span>
            </div>
            <div className="shop-price-row" style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 26, fontWeight: 800 }} className="tabular">{shopProductPriceLabel(product)}</span>
              {product.discountPct && (
                <>
                  <span className="shop-price-old tabular" style={{ fontSize: 14 }}>{shopProductOriginalPriceLabel(product)}</span>
                  <span className="shop-discount-badge">-{product.discountPct}%</span>
                </>
              )}
            </div>
            <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 16 }}>{product.description}</p>
            <div className="rich-actions">
              <button className="btn btn-primary" disabled={product.stock === "out"} onClick={addProductToCart}>
                {added ? "✓ Adicionado" : "Adicionar ao Carrinho"}
              </button>
              <button className="btn btn-ghost" disabled={product.stock === "out"} onClick={addProductToCart}>Comprar Agora</button>
              <Link href="/dashboard/athlete/messages" className="btn btn-ghost">Contactar Loja</Link>
              <button
                className={`shop-wishlist-btn ${wished ? "active" : ""}`}
                onClick={() => setWished(toggleWishlist(product.id))}
                title="Wishlist"
              >
                {wished ? "♥" : "♡"}
              </button>
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Benefícios</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
              {product.benefits.map((b) => <p key={b} style={{ fontSize: 13, color: "var(--text-dim)" }}>{b}</p>)}
            </div>
          </div>
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Especificações</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              {product.specs.map((s) => (
                <div className="shop-spec-row" key={s.label}><span style={{ color: "var(--text-faint)" }}>{s.label}</span><span style={{ fontWeight: 600 }}>{s.value}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head"><h2>Avaliações</h2><span>{product.reviewList.length}</span></div>
          <div className="dash-panel-body">
            {product.reviewList.length === 0 && <p style={{ padding: "16px 20px", fontSize: 12.5, color: "var(--text-faint)" }}>Ainda sem avaliações.</p>}
            {product.reviewList.map((r, i) => (
              <div className="schedule-item" key={i}>
                <span className="schedule-dot" />
                <div className="schedule-body">
                  <p>{r.author} <span style={{ color: "var(--gold)" }}>{"★".repeat(Math.round(r.rating))}</span></p>
                  <span>{r.text} · {r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
