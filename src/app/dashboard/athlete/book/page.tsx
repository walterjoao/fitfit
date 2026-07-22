"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkoutsSubNav from "@/components/WorkoutsSubNav";
import { useRoleGuard } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { bookableTrainers, bookableGyms, bookableNutritionists } from "@/lib/workoutsData";

type Category = "trainer" | "gym" | "nutrition";
type SessionFilter = "all" | "Presencial" | "Online";
type SortKey = "rating" | "price";

const categoryLabel: Record<Category, string> = {
  trainer: "Personal Trainer",
  gym: "Ginásio",
  nutrition: "Nutricionista",
};

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function BookSessionsPage() {
  const { session, ready } = useRoleGuard("athlete");
  const [category, setCategory] = useState<Category>("trainer");
  const [query, setQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("all");
  const [sort, setSort] = useState<SortKey>("rating");

  // Gym booking keeps the simple inline flow (facility access, not a 1:1 session)
  const [gymId, setGymId] = useState<string | null>(null);
  const [gymSlot, setGymSlot] = useState<string | null>(null);
  const [gymConfirmed, setGymConfirmed] = useState(false);

  if (!ready) return null;

  const richProviders = category === "trainer" ? bookableTrainers : bookableNutritionists;

  const visibleRich = richProviders
    .filter((p) => {
      const q = query.toLowerCase();
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.specialty.toLowerCase().includes(q);
      const matchesSession = sessionFilter === "all" || p.sessionType === sessionFilter;
      return matchesQuery && matchesSession;
    })
    .sort((a, b) => (sort === "rating" ? b.rating - a.rating : parseInt(a.price) - parseInt(b.price)));

  const gymProvider = bookableGyms.find((g) => g.id === gymId);

  function resetGym() {
    setGymId(null);
    setGymSlot(null);
    setGymConfirmed(false);
  }

  function cancelGymBooking() {
    if (gymProvider) notifyAndEmail(gymProvider.name, `${session?.name || "O atleta"} cancelou a marcação de ${gymSlot}.`, "bad");
    resetGym();
  }

  return (
    <>
      <Sidebar role="athlete" active="workouts" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Marcar Sessões</h1>
          <p>Descobre, compara e reserva sessões com personal trainers, ginásios ou nutricionistas.</p>
        </div>

        <WorkoutsSubNav />

        <div className="toggle-row">
          {(["trainer", "gym", "nutrition"] as Category[]).map((c) => (
            <button key={c} className={`toggle-btn ${category === c ? "active" : ""}`} onClick={() => { setCategory(c); resetGym(); }}>
              {categoryLabel[c]}
            </button>
          ))}
        </div>

        {category !== "gym" ? (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <div className="search" style={{ maxWidth: 320 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Procurar por nome ou especialidade…" />
              </div>
              <select className="field-input" style={{ maxWidth: 200 }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                <option value="rating">Ordenar: Melhor avaliados</option>
                <option value="price">Ordenar: Mais baratos</option>
              </select>
            </div>
            <div className="pill-row">
              <button className={`pill ${sessionFilter === "all" ? "active" : ""}`} onClick={() => setSessionFilter("all")}>Todos</button>
              <button className={`pill ${sessionFilter === "Presencial" ? "active" : ""}`} onClick={() => setSessionFilter("Presencial")}>Presencial</button>
              <button className={`pill ${sessionFilter === "Online" ? "active" : ""}`} onClick={() => setSessionFilter("Online")}>Online</button>
            </div>

            <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {visibleRich.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem resultados.</p>}
              {visibleRich.map((p) => (
                <div className="rich-card" key={p.id}>
                  <div className="rich-cover" style={{ background: p.cover }}>
                    <span className="rich-badge">{p.sessionType}</span>
                  </div>
                  <div className="rich-body">
                    <div className="mk-card-avatar-row">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.photo} alt={p.name} className="mk-avatar-sm" />
                      <div className="rich-title" style={{ fontSize: 14.5 }}>{p.name}</div>
                    </div>
                    <div className="rich-meta-row"><span>{p.specialty}</span></div>
                    <div className="rich-meta-row">
                      <span>⭐ {p.rating.toFixed(1)} ({p.reviews})</span>
                      <span>{p.experienceYears} anos exp.</span>
                    </div>
                    <div className="rich-meta-row" style={{ justifyContent: "space-between" }}>
                      <span>⏱ {p.durationMin} min</span>
                      <span className="product-price tabular">{p.price}</span>
                    </div>
                    <div className="rich-actions">
                      <Link href={`/profile/${p.id}`} className="btn btn-ghost btn-sm">Ver Perfil</Link>
                      <Link href={`/dashboard/athlete/book/${p.id}`} className="btn btn-primary btn-sm">Reservar</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ maxWidth: 640 }}>
            {gymConfirmed && gymProvider ? (
              <div className="dash-panel" style={{ padding: 24, maxWidth: 500 }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Marcação confirmada 🎉</p>
                <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 16 }}>{gymProvider.name} · {gymSlot}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost" onClick={resetGym}>Fazer outra marcação</button>
                  <button className="icon-action" title="Cancelar marcação" onClick={cancelGymBooking}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ) : gymId && gymProvider ? (
              gymSlot ? (
                <div className="dash-panel" style={{ padding: 24, maxWidth: 460 }}>
                  <button className="auth-back" onClick={() => setGymSlot(null)}>← Voltar</button>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: "10px 0 4px" }}>Confirmar marcação</p>
                  <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 16 }}>{gymProvider.name}<br />{gymSlot} · {gymProvider.price}</p>
                  <button className="auth-submit" onClick={() => setGymConfirmed(true)}>Confirmar Marcação</button>
                </div>
              ) : (
                <>
                  <button className="auth-back" onClick={() => setGymId(null)}>← Voltar</button>
                  <div className="provider-card-rich" style={{ cursor: "default", marginTop: 10 }}>
                    <div className="provider-cover" style={{ background: gymProvider.cover }}>{initials(gymProvider.name)}</div>
                    <div className="provider-body-rich">
                      <div className="provider-name-rich">{gymProvider.name}</div>
                      <div className="provider-specialty">{gymProvider.location}</div>
                    </div>
                  </div>
                  <div className="field-label" style={{ margin: "16px 0 10px" }}>Escolhe horário</div>
                  <div className="slot-row">
                    {gymProvider.availability.map((a) => <button key={a} className="slot-btn" onClick={() => setGymSlot(a)}>{a}</button>)}
                  </div>
                </>
              )
            ) : (
              <>
                <div className="field-label" style={{ marginBottom: 12 }}>Escolhe um ginásio</div>
                {bookableGyms.map((g) => (
                  <div key={g.id} className="provider-card-rich" onClick={() => setGymId(g.id)}>
                    <div className="provider-cover" style={{ background: g.cover }}>{initials(g.name)}</div>
                    <div className="provider-body-rich">
                      <div className="provider-head-row">
                        <div>
                          <div className="provider-name-rich">{g.name}</div>
                          <div className="provider-specialty">{g.location}</div>
                        </div>
                        <span className="provider-price tabular">{g.price}</span>
                      </div>
                      <p className="provider-desc">&ldquo;{g.description}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
