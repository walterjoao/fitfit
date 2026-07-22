"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { bookableTrainers, bookableNutritionists } from "@/lib/workoutsData";

export default function SessionDetailPage() {
  const { session, ready } = useRoleGuard("athlete");
  const params = useParams<{ id: string }>();
  const provider = useMemo(
    () => bookableTrainers.find((p) => p.id === params.id) || bookableNutritionists.find((p) => p.id === params.id),
    [params.id]
  );
  const isTrainer = provider ? bookableTrainers.some((p) => p.id === provider.id) : false;
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!ready) return null;
  if (!provider) {
    return (
      <>
        <Sidebar role="athlete" active="workouts" />
        <Header />
        <div className="shell"><div className="page-head" style={{ paddingTop: 22 }}><h1>Profissional não encontrado</h1></div></div>
      </>
    );
  }

  function confirmBooking() {
    setConfirmed(true);
    notifyAndEmail(provider!.name, `${session?.name || "O atleta"} reservou uma sessão com ${provider!.name} (${slot}).`, "good");
  }

  return (
    <>
      <Sidebar role="athlete" active="workouts" />
      <Header />
      <div className="shell">
        <div className="dash-panel" style={{ display: "flex", alignItems: "center", gap: 18, padding: 22, marginBottom: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={provider.photo} alt={provider.name} className="mk-profile-photo" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 800 }}>{provider.name}</div>
            <div className="rich-meta-row" style={{ marginTop: 4 }}>
              <span>{provider.specialty}</span>
              <span>⭐ {provider.rating.toFixed(1)} ({provider.reviews})</span>
              <span>👥 {provider.followers} seguidores</span>
            </div>
            <div style={{ marginTop: 8 }}>
              {provider.certifications.map((c) => <span className="mk-cert-chip" key={c}>{c}</span>)}
            </div>
          </div>
          <Link href={`/profile/${provider.id}`} className="btn btn-ghost">Ver Perfil</Link>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Sobre esta sessão</div>
          <div className="wk-desc-grid">
            <div className="wk-desc-card">
              <h4>Descrição</h4>
              <p>{provider.description}</p>
            </div>
            <div className="wk-desc-card">
              <h4>Estilo de treino</h4>
              <p>{provider.specialty} · {provider.sessionType} · {provider.durationMin} min</p>
            </div>
            <div className="wk-desc-card">
              <h4>Perfeito para</h4>
              <p>{provider.perfectFor.join(" · ")}</p>
            </div>
          </div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Benefícios</div>
          <div className="wk-benefits">
            {provider.benefits.map((b) => <div className="wk-benefit" key={b}>{b}</div>)}
          </div>
        </div>

        {provider.photos.length > 0 && (
          <div className="wk-section">
            <div className="wk-section-title">Fotos e Transformações</div>
            <div className="mk-gallery">
              {provider.photos.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p} alt={provider.name} key={p} />
              ))}
            </div>
          </div>
        )}

        <div className="wk-section">
          <div className="wk-section-title">Marcar Sessão</div>
          {confirmed ? (
            <div className="dash-panel" style={{ padding: 24, maxWidth: 460 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Marcação confirmada 🎉</p>
              <p style={{ fontSize: 12.5, color: "var(--text-dim)" }}>{provider.name} · {slot} · {provider.price}</p>
            </div>
          ) : (
            <div className="dash-panel" style={{ padding: 20, maxWidth: 500 }}>
              <div className="mk-slot-grid" style={{ marginBottom: 16 }}>
                {provider.availability.map((a) => (
                  <button key={a} className={`slot-btn ${slot === a ? "selected" : ""}`} onClick={() => setSlot(a)}>{a}</button>
                ))}
              </div>
              <div className="rich-meta-row" style={{ marginBottom: 14 }}>
                <span>⏱ Duração: {provider.durationMin} min</span>
                <span className="product-price tabular">{provider.price}</span>
              </div>
              <button className="auth-submit" disabled={!slot} onClick={confirmBooking}>Confirmar Marcação</button>
            </div>
          )}
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Avaliações</div>
          {provider.reviewList.map((r) => (
            <div className="mk-review" key={r.name + r.text}>
              <div className="mk-review-head"><span>{r.name}</span><span>⭐ {r.rating.toFixed(1)}</span></div>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
