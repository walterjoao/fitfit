"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  lbData,
  initials,
  trendGlyph,
  catIcon,
  catBg,
  products,
  stockLabel,
  evtArt,
  evtLabel,
  events,
  type ProductCat,
} from "@/lib/data";

type View = "leaderboard" | "shop" | "events";
type LbCat = keyof typeof lbData;

const shopCats: { key: ProductCat | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "proteinas", label: "Proteínas" },
  { key: "ganho_massa", label: "Ganho de Massa" },
  { key: "energia_pre_treino", label: "Pré-treino" },
  { key: "perda_peso", label: "Perda de Peso" },
  { key: "vitaminas_minerais", label: "Vitaminas" },
];

export default function Home() {
  const [view, setView] = useState<View>("leaderboard");

  const [lbCat, setLbCat] = useState<LbCat>("transformation");
  const [lbScope, setLbScope] = useState<"Global" | "Cidade" | "Amigos" | "Ginásio">("Global");
  const lb = lbData[lbCat];

  const [shopCat, setShopCat] = useState<ProductCat | "all">("all");
  const recommended = useMemo(() => products.filter((p) => p.rec), []);
  const filteredProducts = useMemo(
    () => (shopCat === "all" ? products : products.filter((p) => p.c === shopCat)),
    [shopCat]
  );

  const [evtType, setEvtType] = useState<"all" | "run" | "class" | "workshop" | "competition">("all");
  const [evtWhen, setEvtWhen] = useState<"all" | "week" | "month">("all");
  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) => (evtType === "all" || e.t === evtType) && (evtWhen === "all" || e.w === evtWhen)
      ),
    [evtType, evtWhen]
  );

  return (
    <>
      <Sidebar active="leaderboard" />
      <Header />
      <div className="shell">
        <nav className="views">
          <button className={`view-btn ${view === "leaderboard" ? "active" : ""}`} onClick={() => setView("leaderboard")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" /></svg>
            Leaderboard
          </button>
          <button className={`view-btn ${view === "shop" ? "active" : ""}`} onClick={() => setView("shop")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9 12 4l9 5-9 5-9-5Z" /><path d="M3 9v6l9 5 9-5V9" /></svg>
            Loja
          </button>
          <button className={`view-btn ${view === "events" ? "active" : ""}`} onClick={() => setView("events")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
            Eventos
          </button>
        </nav>

        {/* ================= LEADERBOARD ================= */}
        <section className={`panel ${view === "leaderboard" ? "active" : ""}`}>
          <div className="page-head">
            <h1>Leaderboard</h1>
            <p>Vê como te comparas com a comunidade FitPro esta semana.</p>
          </div>

          <div className="lb-tabs">
            {(["transformation", "consistency", "nutrition", "community"] as LbCat[]).map((cat) => (
              <button
                key={cat}
                className={`lb-tab ${lbCat === cat ? "active" : ""}`}
                onClick={() => setLbCat(cat)}
              >
                {{
                  transformation: "Transformação",
                  consistency: "Consistência",
                  nutrition: "Nutrição",
                  community: "Comunidade",
                }[cat]}
              </button>
            ))}
          </div>

          <div className="pill-row">
            {(["Global", "Cidade", "Amigos", "Ginásio"] as const).map((s) => (
              <button key={s} className={`pill ${lbScope === s ? "active" : ""}`} onClick={() => setLbScope(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="podium">
            {lb.podium.map((p, i) => {
              const tier = i === 0 ? "gold" : i === 1 ? "silver" : "bronze";
              const medal = tier === "gold" ? "🥇" : tier === "silver" ? "🥈" : "🥉";
              return (
                <div key={p.n} className={`p-card ${tier}`}>
                  <span className="p-rank">#{i + 1}</span>
                  <div className="p-medal">{medal}</div>
                  <div className="p-name">{p.n}</div>
                  <div className="p-sub">{p.sub}</div>
                  <div className="p-xp tabular">{p.xp}</div>
                  <div className="p-xp-label">XP</div>
                </div>
              );
            })}
          </div>

          <div className="lb-list">
            {lb.list.map((row, i) => {
              const [name, xp, trend] = row;
              return (
                <div key={name} className="lb-row">
                  <span className="lb-pos tabular">{i + 4}</span>
                  <div className="lb-who">
                    <span className="lb-av">{initials(name)}</span>
                    <span className="lb-name">{name}</span>
                  </div>
                  <span className="lb-xp tabular">{xp} XP</span>
                  <span className={`lb-trend ${trend}`}>{trendGlyph(trend)}</span>
                </div>
              );
            })}
          </div>

          <div className="ai-box">
            <div className="ai-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="3.2" /></svg>
            </div>
            <p>Estás a <b>200 XP</b> do Top 10 em Consistência — completa mais 2 sessões esta semana para ultrapassar Nelson Sami.</p>
          </div>
        </section>

        {/* ================= SHOP ================= */}
        <section className={`panel ${view === "shop" ? "active" : ""}`}>
          <div className="page-head">
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

        {/* ================= EVENTS ================= */}
        <section className={`panel ${view === "events" ? "active" : ""}`}>
          <div className="page-head">
            <h1>Eventos</h1>
            <p>Corridas, aulas e desafios da comunidade perto de ti.</p>
          </div>

          <div className="featured">
            <div className="featured-art"><span className="featured-badge">Em destaque</span></div>
            <div className="featured-body">
              <span className="featured-type">Competição</span>
              <h3>HYROX Luanda 2026</h3>
              <div className="featured-meta">
                <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>15 Ago · 07:00</span>
                <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>Talatona, Luanda</span>
                <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></svg>240 participantes</span>
              </div>
              <div className="featured-actions">
                <button className="btn btn-primary">Participar</button>
                <button className="btn btn-ghost">Ver detalhes</button>
              </div>
            </div>
          </div>

          <div className="pill-row">
            {(["all", "run", "class", "workshop", "competition"] as const).map((t) => (
              <button key={t} className={`pill ${evtType === t ? "active" : ""}`} onClick={() => setEvtType(t)}>
                {t === "all" ? "Todos os tipos" : evtLabel[t]}
              </button>
            ))}
            <span className="pill-sep" />
            {(["all", "week", "month"] as const).map((w) => (
              <button key={w} className={`pill ${evtWhen === w ? "active" : ""}`} onClick={() => setEvtWhen(w)}>
                {w === "all" ? "Todas as datas" : w === "week" ? "Esta semana" : "Este mês"}
              </button>
            ))}
          </div>

          <div className="grid">
            {filteredEvents.map((e) => (
              <div className="event-card" key={e.n}>
                <div className="event-art" style={{ background: evtArt[e.t] }}>
                  <span className="event-type-tag">{evtLabel[e.t]}</span>
                </div>
                <div className="event-body">
                  <div className="event-title">{e.n}</div>
                  <div className="event-meta">
                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>{e.when}</span>
                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>{e.where}</span>
                  </div>
                  <div className="event-foot">
                    <div className="avatars-stack"><span className="lb-av">{e.ppl}</span></div>
                    <button className="btn btn-primary btn-sm">Participar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
