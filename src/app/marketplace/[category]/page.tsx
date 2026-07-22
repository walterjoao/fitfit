"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import type { Role } from "@/components/Sidebar";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useSession } from "@/lib/session";
import { categoryMeta, profilesByRole, type MarketplaceCategory } from "@/lib/marketplaceData";

type SortKey = "rating" | "followers";

export default function MarketplaceCategoryPage() {
  const session = useSession();
  const params = useParams<{ category: string }>();
  const searchParams = useSearchParams();
  const category = params.category as MarketplaceCategory;
  const meta = categoryMeta[category];
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState<SortKey>("rating");

  const profiles = useMemo(() => {
    if (!meta) return [];
    return profilesByRole(category)
      .filter((p) => !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sort === "rating" ? b.rating - a.rating : b.followers - a.followers));
  }, [category, query, sort, meta]);

  if (session === undefined) return null;
  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }
  if (!meta) {
    return (
      <>
        <Sidebar role={session.role as Role} active="marketplace" />
        <Header />
        <div className="shell"><div className="page-head" style={{ paddingTop: 22 }}><h1>Categoria não encontrada</h1></div></div>
      </>
    );
  }

  return (
    <>
      <Sidebar role={session.role as Role} active="marketplace" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <Link href="/marketplace" className="auth-back" style={{ marginBottom: 8, display: "inline-block" }}>← Marketplace</Link>
          <h1>{meta.icon} {meta.plural}</h1>
          <p>Descobre e compara {meta.plural.toLowerCase()} disponíveis no FitPro.</p>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <div className="search" style={{ maxWidth: 320 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Procurar por nome ou localização…" />
          </div>
          <select className="field-input" style={{ maxWidth: 220 }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="rating">Ordenar: Melhor avaliados</option>
            <option value="followers">Ordenar: Mais populares</option>
          </select>
        </div>

        <div className="pill-row">
          {(Object.keys(categoryMeta) as MarketplaceCategory[]).map((c) => (
            <Link key={c} href={`/marketplace/${c}`} className={`pill ${c === category ? "active" : ""}`}>{categoryMeta[c].icon} {categoryMeta[c].label}</Link>
          ))}
        </div>

        <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {profiles.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem resultados.</p>}
          {profiles.map((p) => (
            <Link href={`/profile/${p.id}`} key={p.id} className="rich-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="rich-cover" style={{ background: p.cover }} />
              <div className="rich-body">
                <div className="rich-title">{p.name}</div>
                <div className="rich-meta-row"><span>📍 {p.location}</span></div>
                <div className="rich-meta-row">
                  <span>⭐ {p.rating.toFixed(1)} ({p.reviews})</span>
                  <span>{p.followers} seguidores</span>
                </div>
                {p.specialties && <div className="rich-meta-row">{p.specialties.slice(0, 2).map((s) => <span key={s}>{s}</span>)}</div>}
                {p.facilities && <div className="rich-meta-row">{p.facilities.slice(0, 2).map((s) => <span key={s}>{s}</span>)}</div>}
                <div className="rich-actions">
                  <span className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: "center" }}>Ver Perfil</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
