"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { messagesPath } from "@/lib/accountData";
import { lbData, initials, trendGlyph } from "@/lib/data";
import { slugify } from "@/lib/directory";
import {
  athleteLeaderboard,
  trainerLeaderboard,
  gymLeaderboard,
  nutritionistLeaderboard,
  shopLeaderboard,
  medal,
} from "@/lib/leaderboardData";

type LbCat = keyof typeof lbData;
type MainCategory = "athletes" | "trainers" | "gyms" | "nutritionists" | "shops";

const mainCategories: { key: MainCategory; label: string }[] = [
  { key: "athletes", label: "🏃 Atletas" },
  { key: "trainers", label: "🧑‍🏫 Personal Trainers" },
  { key: "gyms", label: "🏋️ Ginásios" },
  { key: "nutritionists", label: "🥗 Nutricionistas" },
  { key: "shops", label: "🛍️ Lojas" },
];

const scopes = ["Perto de ti", "Cidade", "País", "Global"] as const;
const periods = ["Hoje", "Semana", "Mês", "Sempre"] as const;

export default function LeaderboardView({ role }: { role: Role }) {
  const { ready } = useRoleGuard(role);
  const [main, setMain] = useState<MainCategory>("athletes");
  const [lbCat, setLbCat] = useState<LbCat | "geral">("geral");
  const [scope, setScope] = useState<(typeof scopes)[number]>("Global");
  const [period, setPeriod] = useState<(typeof periods)[number]>("Semana");

  if (!ready) return null;

  const myMessagesPath = messagesPath(role);

  return (
    <>
      <Sidebar role={role} active="leaderboard" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Leaderboard</h1>
          <p>A plataforma competitiva da comunidade FitPro — atletas, treinadores, ginásios, nutricionistas e lojas.</p>
        </div>

        <div className="lb-category-tabs">
          {mainCategories.map((c) => (
            <button key={c.key} className={`lb-category-tab ${main === c.key ? "active" : ""}`} onClick={() => setMain(c.key)}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="pill-row">
          {scopes.map((s) => (
            <button key={s} className={`pill ${scope === s ? "active" : ""}`} onClick={() => setScope(s)}>{s}</button>
          ))}
          <span className="pill-sep" />
          {periods.map((p) => (
            <button key={p} className={`pill ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>

        {main === "athletes" && (
          <>
            <div className="lb-tabs">
              {(["geral", "transformation", "consistency", "nutrition", "community"] as const).map((cat) => (
                <button key={cat} className={`lb-tab ${lbCat === cat ? "active" : ""}`} onClick={() => setLbCat(cat)}>
                  {{
                    geral: "Geral (FitPoints)",
                    transformation: "Transformação",
                    consistency: "Consistência",
                    nutrition: "Nutrição",
                    community: "Comunidade",
                  }[cat]}
                </button>
              ))}
            </div>

            {lbCat === "geral" ? (
              <div className="lb-list">
                {athleteLeaderboard.map((a, i) => (
                  <Link href={`/profile/${a.id}`} key={a.id} className="rank-row">
                    <span className="rank-medal">{medal(i)}</span>
                    <div className="rank-cover" style={{ background: a.cover }} />
                    <div className="rank-info">
                      <div className="rank-name">{a.name}</div>
                      <div className="rank-meta">
                        <span>Nível {a.level}</span>
                        <span className="tabular">{a.points.toLocaleString("pt-PT")} pts</span>
                        <span>🔥 {a.streak} dias seguidos</span>
                        <span>🏅 {a.badges} badges</span>
                      </div>
                    </div>
                    <div className="rank-actions" onClick={(e) => e.preventDefault()}>
                      <button className="btn btn-primary">Seguir</button>
                      <Link href={myMessagesPath} className="btn btn-ghost">Mensagem</Link>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <>
                <div className="podium">
                  {lbData[lbCat].podium.map((p, i) => {
                    const tier = i === 0 ? "gold" : i === 1 ? "silver" : "bronze";
                    return (
                      <Link href={`/profile/${slugify(p.n)}`} key={p.n} className={`p-card ${tier}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="p-rank">#{i + 1}</span>
                        <div className="p-medal">{medal(i)}</div>
                        <div className="p-name">{p.n}</div>
                        <div className="p-sub">{p.sub}</div>
                        <div className="p-xp tabular">{p.xp}</div>
                        <div className="p-xp-label">XP</div>
                      </Link>
                    );
                  })}
                </div>
                <div className="lb-list">
                  {lbData[lbCat].list.map((row, i) => {
                    const [name, xp, trend] = row;
                    return (
                      <Link href={`/profile/${slugify(name)}`} key={name} className="lb-row" style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="lb-pos tabular">{i + 4}</span>
                        <div className="lb-who">
                          <span className="lb-av">{initials(name)}</span>
                          <span className="lb-name">{name}</span>
                        </div>
                        <span className="lb-xp tabular">{xp} XP</span>
                        <span className={`lb-trend ${trend}`}>{trendGlyph(trend)}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            <div className="ai-box">
              <div className="ai-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="3.2" /></svg>
              </div>
              <p>Estás a <b>200 XP</b> do Top 10 em Consistência — completa mais 2 sessões esta semana para ultrapassar Nelson Sami.</p>
            </div>
          </>
        )}

        {main === "trainers" && (
          <div className="lb-list">
            {trainerLeaderboard.map((t, i) => (
              <Link href={`/profile/${t.id}`} key={t.id} className="rank-row">
                <span className="rank-medal">{medal(i)}</span>
                <div className="rank-cover" style={{ background: t.cover }} />
                <div className="rank-info">
                  <div className="rank-name">{t.name}</div>
                  <div className="rank-meta">
                    <span>{t.specialty}</span>
                    <span>⭐ {t.rating.toFixed(1)}</span>
                    <span>{t.clients} clientes</span>
                    <span>{t.sessions.toLocaleString("pt-PT")} sessões</span>
                  </div>
                </div>
                <div className="rank-actions" onClick={(e) => e.preventDefault()}>
                  <Link href="/dashboard/athlete/book" className="btn btn-primary">Reservar</Link>
                </div>
              </Link>
            ))}
          </div>
        )}

        {main === "gyms" && (
          <div className="lb-list">
            {gymLeaderboard.map((g, i) => (
              <Link href={`/profile/${g.id}`} key={g.id} className="rank-row">
                <span className="rank-medal">{medal(i)}</span>
                <div className="rank-cover" style={{ background: g.cover, borderRadius: "var(--radius-sm)" }} />
                <div className="rank-info">
                  <div className="rank-name">{g.name}</div>
                  <div className="rank-meta">
                    <span>{g.location}</span>
                    <span>⭐ {g.rating.toFixed(1)}</span>
                    <span>{g.members.toLocaleString("pt-PT")} membros</span>
                    <span>{g.classes} aulas</span>
                  </div>
                </div>
                <div className="rank-actions" onClick={(e) => e.preventDefault()}>
                  <Link href="/dashboard/athlete/nearby" className="btn btn-primary">Juntar-me</Link>
                  <Link href="/dashboard/athlete/classes" className="btn btn-ghost">Ver Aulas</Link>
                </div>
              </Link>
            ))}
          </div>
        )}

        {main === "nutritionists" && (
          <div className="lb-list">
            {nutritionistLeaderboard.map((n, i) => (
              <Link href={`/profile/${n.id}`} key={n.id} className="rank-row">
                <span className="rank-medal">{medal(i)}</span>
                <div className="rank-cover" style={{ background: n.cover }} />
                <div className="rank-info">
                  <div className="rank-name">{n.name}</div>
                  <div className="rank-meta">
                    <span>{n.specialty}</span>
                    <span>⭐ {n.rating.toFixed(1)}</span>
                    <span>{n.clients} clientes</span>
                    <span>{n.results}</span>
                  </div>
                </div>
                <div className="rank-actions" onClick={(e) => e.preventDefault()}>
                  <Link href="/dashboard/athlete/book" className="btn btn-primary">Marcar Consulta</Link>
                </div>
              </Link>
            ))}
          </div>
        )}

        {main === "shops" && (
          <div className="lb-list">
            {shopLeaderboard.map((s, i) => (
              <Link href={`/profile/${s.id}`} key={s.id} className="rank-row">
                <span className="rank-medal">{medal(i)}</span>
                <div className="rank-cover" style={{ background: s.cover, borderRadius: "var(--radius-sm)" }} />
                <div className="rank-info">
                  <div className="rank-name">{s.name}</div>
                  <div className="rank-meta">
                    <span>{s.products} produtos</span>
                    <span>⭐ {s.rating.toFixed(1)}</span>
                    <span>{s.sales.toLocaleString("pt-PT")} vendas</span>
                  </div>
                </div>
                <div className="rank-actions" onClick={(e) => e.preventDefault()}>
                  <Link href="/shop" className="btn btn-primary">Comprar</Link>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
