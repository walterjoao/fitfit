"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkoutsSubNav from "@/components/WorkoutsSubNav";
import { useRoleGuard } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { bookableTrainers, bookableGyms, bookableNutritionists } from "@/lib/workoutsData";

type Category = "trainer" | "gym" | "nutrition";

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
  const [providerId, setProviderId] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!ready) return null;

  const providers =
    category === "trainer" ? bookableTrainers : category === "gym" ? bookableGyms : bookableNutritionists;

  function reset() {
    setProviderId(null);
    setSlot(null);
    setConfirmed(false);
  }

  const provider = providers.find((p) => p.id === providerId);
  const step = confirmed ? 3 : slot ? 2 : providerId ? 1 : 0;

  function cancelBooking() {
    if (provider) {
      notifyAndEmail(provider.name, `${session?.name || "O atleta"} cancelou a marcação de ${slot}.`, "bad");
    }
    reset();
  }

  return (
    <>
      <Sidebar role="athlete" active="workouts" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Marcar Sessões</h1>
          <p>Marca sessões com personal trainers, ginásios ou nutricionistas.</p>
        </div>

        <WorkoutsSubNav />

        <div className="toggle-row">
          {(["trainer", "gym", "nutrition"] as Category[]).map((c) => (
            <button key={c} className={`toggle-btn ${category === c ? "active" : ""}`} onClick={() => { setCategory(c); reset(); }}>
              {categoryLabel[c]}
            </button>
          ))}
        </div>

        <div className="book-steps" style={{ maxWidth: 640 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={`book-step ${step > i ? "done" : step === i ? "active" : ""}`} />
          ))}
        </div>

        {confirmed && provider ? (
          <div className="dash-panel" style={{ padding: 24, maxWidth: 500 }}>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Marcação confirmada 🎉</p>
            <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 16 }}>
              {categoryLabel[category]} · {provider.name} · {slot}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" onClick={reset}>Fazer outra marcação</button>
              <button className="icon-action" title="Cancelar marcação" onClick={cancelBooking}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 640 }}>
            {!providerId && (
              <>
                <div className="field-label" style={{ marginBottom: 12 }}>Escolhe um profissional</div>
                {providers.map((p) => (
                  <div key={p.id} className="provider-card-rich" onClick={() => setProviderId(p.id)}>
                    <div className="provider-cover" style={{ background: p.cover }}>{initials(p.name)}</div>
                    <div className="provider-body-rich">
                      <div className="provider-head-row">
                        <div>
                          <div className="provider-name-rich">{p.name}</div>
                          <div className="provider-specialty">{"specialty" in p ? p.specialty : p.location}</div>
                        </div>
                        <span className="provider-price tabular">{p.price}</span>
                      </div>
                      <p className="provider-desc">&ldquo;{p.description}&rdquo;</p>
                      <div className="provider-meta-row">
                        {"rating" in p && <span>⭐ {p.rating.toFixed(1)} ({p.reviews})</span>}
                        <span>⏱ {p.durationMin} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {providerId && !slot && provider && (
              <>
                <button className="auth-back" onClick={() => setProviderId(null)}>← Voltar</button>
                <div className="provider-card-rich" style={{ cursor: "default", marginTop: 10 }}>
                  <div className="provider-cover" style={{ background: provider.cover }}>{initials(provider.name)}</div>
                  <div className="provider-body-rich">
                    <div className="provider-name-rich">{provider.name}</div>
                    <div className="provider-specialty">{"specialty" in provider ? provider.specialty : provider.location}</div>
                  </div>
                </div>
                <div className="field-label" style={{ margin: "16px 0 10px" }}>Escolhe data e hora</div>
                <div className="slot-row">
                  {provider.availability.map((a) => (
                    <button key={a} className="slot-btn" onClick={() => setSlot(a)}>{a}</button>
                  ))}
                </div>
              </>
            )}

            {providerId && slot && provider && !confirmed && (
              <div className="dash-panel" style={{ padding: 24, maxWidth: 460 }}>
                <button className="auth-back" onClick={() => setSlot(null)}>← Voltar</button>
                <p style={{ fontSize: 14, fontWeight: 700, margin: "10px 0 4px" }}>Confirmar marcação</p>
                <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 16 }}>
                  {categoryLabel[category]} · {provider.name}<br />
                  {slot} · {provider.price}
                </p>
                <button className="auth-submit" onClick={() => setConfirmed(true)}>Confirmar Marcação</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
