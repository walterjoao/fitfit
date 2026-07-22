"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { lbData, initials, trendGlyph } from "@/lib/data";

type LbCat = keyof typeof lbData;

export default function LeaderboardPage() {
  const [lbCat, setLbCat] = useState<LbCat>("transformation");
  const [lbScope, setLbScope] = useState<"Global" | "Cidade" | "Amigos" | "Ginásio">("Global");
  const lb = lbData[lbCat];

  return (
    <>
      <Sidebar role="trainer" active="" />
      <Header />
      <div className="shell">
        <section className="panel active">
          <div className="page-head" style={{ paddingTop: 22 }}>
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
      </div>
    </>
  );
}
