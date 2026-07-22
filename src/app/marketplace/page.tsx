"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Role } from "@/components/Sidebar";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useSession } from "@/lib/session";
import { categoryMeta, topRated, popularThisWeek, newestProfessionals, type MarketplaceCategory } from "@/lib/marketplaceData";

const roleLabel: Record<string, string> = { trainer: "Personal Trainer", nutritionist: "Nutricionista", gym: "Ginásio", shop: "Loja" };

function ProfileCard({ p }: { p: ReturnType<typeof topRated>[number] }) {
  return (
    <Link href={`/profile/${p.id}`} className="rich-card" style={{ textDecoration: "none", color: "inherit" }}>
      <div className="rich-cover" style={{ background: p.cover }}>
        <span className="rich-badge">{roleLabel[p.role] || p.role}</span>
      </div>
      <div className="rich-body">
        <div className="rich-title">{p.name}</div>
        <div className="rich-meta-row"><span>📍 {p.location}</span></div>
        <div className="rich-meta-row">
          <span>⭐ {p.rating.toFixed(1)} ({p.reviews})</span>
          <span>{p.followers} seguidores</span>
        </div>
      </div>
    </Link>
  );
}

export default function MarketplacePage() {
  const session = useSession();
  const [query, setQuery] = useState("");

  const recommended = useMemo(() => topRated(4), []);
  const rated = useMemo(() => topRated(6), []);
  const popular = useMemo(() => popularThisWeek(6), []);
  const fresh = useMemo(() => newestProfessionals(4), []);

  if (session === undefined) return null;
  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  return (
    <>
      <Sidebar role={session.role as Role} active="marketplace" />
      <Header />
      <div className="shell">
        <div className="mkt-hero">
          <h1>Marketplace FitPro</h1>
          <p>Descobre, compara e reserva os melhores profissionais e negócios de fitness.</p>
          <form
            className="mkt-search"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) window.location.href = `/marketplace/trainer?q=${encodeURIComponent(query)}`;
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Procura PTs, ginásios, nutricionistas, lojas…" />
          </form>
        </div>

        <div className="section-head"><h2>Categorias</h2></div>
        <div className="mkt-cat-grid" style={{ marginBottom: 28 }}>
          {(Object.keys(categoryMeta) as MarketplaceCategory[]).map((c) => (
            <Link href={`/marketplace/${c}`} key={c} className="mkt-cat-card">
              <div className="mkt-cat-icon">{categoryMeta[c].icon}</div>
              <div className="mkt-cat-label">{categoryMeta[c].label}</div>
            </Link>
          ))}
        </div>

        <div className="section-head"><h2>Recomendados perto de ti</h2></div>
        <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
          {recommended.map((p) => <ProfileCard p={p} key={p.id} />)}
        </div>

        <div className="section-head"><h2>Melhor Avaliados</h2></div>
        <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
          {rated.map((p) => <ProfileCard p={p} key={p.id} />)}
        </div>

        <div className="section-head"><h2>Populares esta Semana</h2></div>
        <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
          {popular.map((p) => <ProfileCard p={p} key={p.id} />)}
        </div>

        <div className="section-head"><h2>Novos Profissionais</h2></div>
        <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {fresh.map((p) => <ProfileCard p={p} key={p.id} />)}
        </div>
      </div>
    </>
  );
}
