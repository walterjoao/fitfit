"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { products, catIcon, catBg, stockLabel } from "@/lib/data";

export default function ShopProductsPage() {
  return (
    <>
      <Sidebar role="shop" active="products" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Produtos</h1>
          <p>Gere o catálogo, preços e stock dos teus produtos.</p>
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
