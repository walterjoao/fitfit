"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { toggleFollow, isFollowing } from "@/lib/directory";
import { nearbyEntries, nearbyTypeLabel, nearbyTypeColor, pinPosition, type NearbyType } from "@/lib/nearbyData";

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const typeFilters: { key: NearbyType | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "athlete", label: "👤 Atletas" },
  { key: "trainer", label: "🧑‍🏫 PTs" },
  { key: "gym", label: "🏋️ Ginásios" },
  { key: "nutritionist", label: "🥗 Nutricionistas" },
];

export default function NearbyPage() {
  const { session, ready } = useRoleGuard("athlete");
  const [status, setStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [typeFilter, setTypeFilter] = useState<NearbyType | "all">("all");
  const [maxDistance, setMaxDistance] = useState(25);
  const [minRating, setMinRating] = useState(0);
  const [, forceRerender] = useState(0);

  function useMyLocation() {
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
      },
      () => setStatus("denied"),
      { timeout: 8000 }
    );
  }

  if (!ready) return null;

  const filtered = nearbyEntries
    .filter((e) => (typeFilter === "all" || e.type === typeFilter) && e.distanceKm <= maxDistance && (e.rating === undefined || e.rating >= minRating))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const popularTrainers = [...nearbyEntries].filter((e) => e.type === "trainer").sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  const topGym = [...nearbyEntries].filter((e) => e.type === "gym").sort((a, b) => (b.reviews || 0) - (a.reviews || 0))[0];
  const similarAthlete = nearbyEntries.find((e) => e.type === "athlete" && e.goal === "Consistência");

  function follow(id: string, name: string) {
    const now = toggleFollow(id);
    forceRerender((n) => n + 1);
    if (now) notifyAndEmail(name, `${session?.name || "Um atleta"} começou a seguir-te.`, "good", "events", `/profile/${id}`);
  }

  return (
    <>
      <Sidebar role="athlete" active="nearby" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Perto de Ti</h1>
          <p>Atletas, ginásios, personal trainers e nutricionistas perto da tua localização.</p>
        </div>

        {status !== "granted" ? (
          <div className="nearby-hero">
            <div className="nearby-hero-icon">📍</div>
            <h2>Ativa a tua localização</h2>
            <p>Descobre atletas, personal trainers, ginásios e nutricionistas perto de ti e começa a conectar-te com o ecossistema fitness local.</p>
            <div className="nearby-hero-list">
              <span>👤 Atletas</span>
              <span>🧑‍🏫 Personal Trainers</span>
              <span>🏋️ Ginásios</span>
              <span>🥗 Nutricionistas</span>
            </div>
            <button className="btn btn-primary" onClick={useMyLocation} disabled={status === "loading"}>
              {status === "loading" ? "A localizar…" : "📍 Usar a minha localização"}
            </button>
            {status === "denied" && (
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 14 }}>
                Não conseguimos aceder à tua localização. Permite o acesso nas definições do navegador e tenta novamente.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="section-head"><h2>Sugestões Inteligentes</h2><span>com base na tua zona</span></div>
            <div className="rich-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 24 }}>
              {popularTrainers && (
                <Link href={`/profile/${popularTrainers.id}`} className="ai-box" style={{ marginTop: 0, textDecoration: "none" }}>
                  <div className="ai-icon">🔥</div>
                  <p>PTs populares perto de ti: <b>{popularTrainers.name}</b> ({popularTrainers.rating?.toFixed(1)}⭐)</p>
                </Link>
              )}
              {topGym && (
                <Link href={`/profile/${topGym.id}`} className="ai-box" style={{ marginTop: 0, textDecoration: "none" }}>
                  <div className="ai-icon">🏋️</div>
                  <p>Ginásio com mais avaliações: <b>{topGym.name}</b> ({topGym.reviews} avaliações)</p>
                </Link>
              )}
              {similarAthlete && (
                <Link href={`/profile/${similarAthlete.id}`} className="ai-box" style={{ marginTop: 0, textDecoration: "none" }}>
                  <div className="ai-icon">🤝</div>
                  <p>Atleta com objetivo semelhante: <b>{similarAthlete.name}</b> ({similarAthlete.goal})</p>
                </Link>
              )}
            </div>

            <Link href="/leaderboard" className="dash-panel" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", marginBottom: 24, textDecoration: "none", color: "inherit" }}>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>🏆 Top Atletas na Tua Zona</span>
              <span className="btn btn-ghost btn-sm">Ver Leaderboard Local →</span>
            </Link>

            <div className="pill-row">
              {typeFilters.map((f) => (
                <button key={f.key} className={`pill ${typeFilter === f.key ? "active" : ""}`} onClick={() => setTypeFilter(f.key)}>{f.label}</button>
              ))}
              <span className="pill-sep" />
              <select className="field-input" style={{ width: "auto", padding: "6.5px 13px", fontSize: 12.5 }} value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))}>
                <option value={1}>Até 1km</option>
                <option value={5}>Até 5km</option>
                <option value={10}>Até 10km</option>
                <option value={25}>Até 25km</option>
              </select>
              <select className="field-input" style={{ width: "auto", padding: "6.5px 13px", fontSize: 12.5 }} value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value={0}>Qualquer rating</option>
                <option value={4.5}>4.5⭐ ou mais</option>
                <option value={4.8}>4.8⭐ ou mais</option>
              </select>
            </div>

            <div className="nearby-layout">
              <div>
                {filtered.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem resultados para estes filtros.</p>}
                {filtered.map((e) => {
                  const following = isFollowing(e.id);
                  return (
                    <Link href={`/profile/${e.id}`} key={e.id} className="nearby-card" style={{ textDecoration: "none", color: "inherit" }}>
                      <div className="nearby-card-cover" style={{ background: e.cover }} />
                      <div className="nearby-card-body">
                        <div className="nearby-card-top">
                          <div>
                            <div className="nearby-card-type">{nearbyTypeLabel[e.type]}</div>
                            <div className="nearby-card-name">{e.name}</div>
                          </div>
                          <span className="distance-chip">{e.distanceKm.toFixed(1)} km</span>
                        </div>
                        <div className="nearby-card-meta">
                          {e.specialty && <span>{e.specialty}</span>}
                          {e.location && <span>{e.location}</span>}
                          {e.goal && <span>🎯 {e.goal}</span>}
                          {e.level && <span>{e.level}</span>}
                          {e.rating && <span>⭐ {e.rating.toFixed(1)} ({e.reviews})</span>}
                          {e.price && <span className="tabular">{e.price}</span>}
                          {e.followers !== undefined && <span>{e.followers} seguidores</span>}
                        </div>
                        <div className="nearby-card-actions" onClick={(ev) => ev.preventDefault()}>
                          <button className={`btn ${following ? "btn-ghost" : "btn-primary"}`} onClick={() => follow(e.id, e.name)}>
                            {following ? "A Seguir ✓" : "Seguir"}
                          </button>
                          {(e.type === "trainer" || e.type === "nutritionist") && (
                            <Link href="/dashboard/athlete/book" className="btn btn-ghost">Reservar</Link>
                          )}
                          {e.type === "gym" && (
                            <Link href="/dashboard/athlete/classes" className="btn btn-ghost">Ver Aulas</Link>
                          )}
                          <Link href="/dashboard/athlete/messages" className="btn btn-ghost">Mensagem</Link>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="nearby-map">
                <div className="map-pin-you" style={{ left: "50%", top: "50%" }} title="A tua localização" />
                {filtered.map((e) => {
                  const pos = pinPosition(e.id);
                  return (
                    <div
                      key={e.id}
                      className="map-pin"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: nearbyTypeColor[e.type] }}
                      title={`${e.name} · ${e.distanceKm.toFixed(1)}km`}
                    >
                      <span>{e.type === "athlete" ? "👤" : e.type === "trainer" ? "🧑‍🏫" : e.type === "gym" ? "🏋️" : "🥗"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {coords && (
              <p style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 16 }} className="tabular">
                Localização detetada: {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)} · mapa ilustrativo
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
