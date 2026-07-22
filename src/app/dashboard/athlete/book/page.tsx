"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkoutsSubNav from "@/components/WorkoutsSubNav";
import { useRoleGuard } from "@/lib/session";
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
  const { ready } = useRoleGuard("athlete");
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

        <div className="book-steps" style={{ maxWidth: 500 }}>
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
            <button className="btn btn-ghost" onClick={reset}>Fazer outra marcação</button>
          </div>
        ) : (
          <div style={{ maxWidth: 500 }}>
            {!providerId && (
              <>
                <div className="field-label" style={{ marginBottom: 10 }}>Escolhe um profissional</div>
                {providers.map((p) => (
                  <div key={p.id} className="provider-card" onClick={() => setProviderId(p.id)}>
                    <span className="lb-av">{initials(p.name)}</span>
                    <div className="provider-info">
                      <div className="provider-name">{p.name}</div>
                      <div className="provider-meta">{"specialty" in p ? p.specialty : p.location}{"rating" in p ? ` · ★ ${p.rating.toFixed(1)}` : ""}</div>
                    </div>
                    <span className="provider-price tabular">{p.price}</span>
                  </div>
                ))}
              </>
            )}

            {providerId && !slot && provider && (
              <>
                <button className="auth-back" onClick={() => setProviderId(null)}>← Voltar</button>
                <div className="field-label" style={{ margin: "10px 0" }}>Escolhe data e hora com {provider.name}</div>
                <div className="slot-row">
                  {provider.availability.map((a) => (
                    <button key={a} className="slot-btn" onClick={() => setSlot(a)}>{a}</button>
                  ))}
                </div>
              </>
            )}

            {providerId && slot && provider && !confirmed && (
              <div className="dash-panel" style={{ padding: 24 }}>
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
