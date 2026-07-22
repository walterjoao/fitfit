"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useSession } from "@/lib/session";
import { getProfile, isFollowing, toggleFollow } from "@/lib/directory";

const roleLabel: Record<string, string> = {
  athlete: "Atleta",
  trainer: "Personal Trainer",
  nutritionist: "Nutricionista",
  gym: "Ginásio",
  shop: "Loja",
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function ProfilePage() {
  const session = useSession();
  const params = useParams<{ id: string }>();
  const profile = getProfile(params.id);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (profile) setFollowing(isFollowing(profile.id));
  }, [profile]);

  if (session === undefined) return null;
  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }
  if (!profile) {
    return (
      <>
        <Sidebar role={session.role as Role} active="" />
        <Header />
        <div className="shell"><div className="page-head" style={{ paddingTop: 22 }}><h1>Perfil não encontrado</h1></div></div>
      </>
    );
  }

  return (
    <>
      <Sidebar role={session.role as Role} active="" />
      <Header />
      <div className="shell">
        <div className="featured" style={{ marginBottom: 24, gridTemplateColumns: "1fr" }}>
          <div className="featured-art" style={{ background: profile.cover, minHeight: 160 }}>
            <span className="featured-badge">{roleLabel[profile.role]}</span>
          </div>
          <div className="featured-body">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="avatar" style={{ width: 56, height: 56, fontSize: 18, marginTop: -48, border: "3px solid var(--surface)" }}>
                {initials(profile.name)}
              </span>
              <div>
                <h3>{profile.name}</h3>
                <div className="featured-meta"><span>📍 {profile.location}</span></div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, maxWidth: 560 }}>{profile.bio}</p>
            <div className="featured-meta">
              <span><b className="tabular">{profile.followers}</b> seguidores</span>
              <span><b className="tabular">{profile.following}</b> a seguir</span>
              <span>⭐ {profile.rating.toFixed(1)} ({profile.reviews} avaliações)</span>
            </div>
            <div className="featured-actions">
              <button
                className={`btn ${following ? "btn-ghost" : "btn-primary"}`}
                onClick={() => setFollowing(toggleFollow(profile.id))}
              >
                {following ? "A Seguir ✓" : "Seguir"}
              </button>
              <span className="btn btn-ghost">Mensagem</span>
              {profile.role !== "athlete" && (
                <span className="btn btn-ghost">
                  {profile.role === "gym" ? "Juntar-me" : profile.role === "shop" ? "Ver Produtos" : "Reservar"}
                </span>
              )}
              {profile.whatsapp && (
                <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>{profile.role === "gym" ? "Instalações" : "Especialidades"}</h2>
            </div>
            <div className="dash-panel-body" style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(profile.specialties || profile.facilities || []).map((s) => (
                <span key={s} className="pill" style={{ cursor: "default" }}>{s}</span>
              ))}
              {!(profile.specialties || profile.facilities) && (
                <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem informação adicional.</p>
              )}
            </div>
          </div>

          {profile.certifications && (
            <div className="dash-panel">
              <div className="dash-panel-head"><h2>Certificações</h2></div>
              <div className="dash-panel-body">
                {profile.certifications.map((c) => (
                  <div className="schedule-item" key={c}>
                    <span className="schedule-dot" />
                    <div className="schedule-body"><p>{c}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Avaliações</h2>
            <span>{profile.reviewsList.length}</span>
          </div>
          <div className="dash-panel-body">
            {profile.reviewsList.length === 0 && (
              <p style={{ padding: "16px 20px", fontSize: 12.5, color: "var(--text-faint)" }}>Ainda sem avaliações.</p>
            )}
            {profile.reviewsList.map((r, i) => (
              <div className="schedule-item" key={i}>
                <span className="lb-av">{initials(r.author)}</span>
                <div className="schedule-body">
                  <p>{r.author} <span style={{ color: "var(--gold)" }}>{"★".repeat(r.rating)}</span></p>
                  <span>{r.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
