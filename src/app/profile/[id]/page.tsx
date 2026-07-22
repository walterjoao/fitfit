"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useSession } from "@/lib/session";
import { getProfile, isFollowing, toggleFollow } from "@/lib/directory";
import { bookableTrainers, bookableGyms, bookableNutritionists, availableClasses } from "@/lib/workoutsData";
import { products, catIcon, catBg, stockLabel } from "@/lib/data";
import { plansByRole } from "@/lib/accountData";

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

const tabsByRole: Record<string, string[]> = {
  athlete: ["Overview", "Treinos", "Conteúdo", "Progresso", "Conquistas"],
  trainer: ["Overview", "Serviços", "Agenda", "Preços", "Reviews", "Conteúdo"],
  nutritionist: ["Overview", "Planos", "Agenda", "Preços", "Reviews", "Conteúdo"],
  gym: ["Overview", "Galeria", "Serviços", "Treinadores", "Aulas", "Planos", "Reviews"],
  shop: ["Overview", "Produtos", "Categorias", "Reviews"],
};

export default function ProfilePage() {
  const session = useSession();
  const params = useParams<{ id: string }>();
  const profile = getProfile(params.id);
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState("Overview");
  const [shared, setShared] = useState(false);

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

  const tabs = tabsByRole[profile.role] || tabsByRole.athlete;
  const trainerInfo = bookableTrainers.find((t) => t.name === profile.name);
  const nutritionistInfo = bookableNutritionists.find((n) => n.name === profile.name);
  const gymInfo = bookableGyms.find((g) => g.name === profile.name);
  const gymClasses = availableClasses.filter((c) => c.gym === profile.name);
  const gymPlans = plansByRole.gym;
  const shopProducts = profile.role === "shop" ? products.slice(0, 6) : [];

  function share() {
    navigator.clipboard?.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
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
              <Link href="/messages" className="btn btn-ghost">Mensagem</Link>
              {profile.whatsapp && (
                <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  WhatsApp
                </a>
              )}
              <button className="btn btn-ghost" onClick={share}>{shared ? "Link copiado ✓" : "Partilhar"}</button>
            </div>
          </div>
        </div>

        <div className="subnav">
          {tabs.map((t) => (
            <button key={t} className={`subnav-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === "Overview" && (
          <div className="dash-row">
            <div className="dash-panel">
              <div className="dash-panel-head"><h2>{profile.role === "gym" ? "Descrição" : profile.role === "shop" ? "Sobre a Loja" : "Especialidades"}</h2></div>
              <div className="dash-panel-body" style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(profile.specialties || profile.facilities || []).map((s) => (
                  <span key={s} className="pill" style={{ cursor: "default" }}>{s}</span>
                ))}
                {!(profile.specialties || profile.facilities) && (
                  <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{profile.bio}</p>
                )}
              </div>
            </div>

            <div className="dash-panel">
              <div className="dash-panel-head"><h2>Atividade Recente</h2></div>
              <div className="dash-panel-body">
                {(profile.recentActivity || []).map((a, i) => (
                  <div className="schedule-item" key={i}>
                    <span className="schedule-dot" />
                    <div className="schedule-body"><p>{a}</p></div>
                  </div>
                ))}
                {!profile.recentActivity && <p style={{ padding: 20, fontSize: 12.5, color: "var(--text-faint)" }}>Sem atividade recente.</p>}
              </div>
            </div>
          </div>
        )}

        {tab === "Treinos" && profile.role === "athlete" && (
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Estatísticas de Treino</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px", display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div><p style={{ fontSize: 11, color: "var(--text-faint)" }}>Nível</p><p style={{ fontWeight: 700 }}>Intermédio</p></div>
              <div><p style={{ fontSize: 11, color: "var(--text-faint)" }}>Consistência</p><p style={{ fontWeight: 700 }} className="tabular">{Math.round(profile.rating * 18)}%</p></div>
              <div><p style={{ fontSize: 11, color: "var(--text-faint)" }}>Treinos este mês</p><p style={{ fontWeight: 700 }} className="tabular">{Math.round(profile.followers / 12)}</p></div>
            </div>
          </div>
        )}

        {tab === "Conteúdo" && (
          <div className="grid">
            {(profile.gallery || []).map((g, i) => (
              <div key={i} className="product-img" style={{ background: g, height: 160, borderRadius: "var(--radius-lg)", border: "1px solid var(--line)" }} />
            ))}
            {!(profile.gallery && profile.gallery.length) && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Ainda sem conteúdo publicado.</p>}
          </div>
        )}

        {tab === "Progresso" && profile.role === "athlete" && (
          <div className="ai-box"><div className="ai-icon">📈</div><p>O progresso detalhado deste atleta é privado. Segue-o para veres atualizações públicas na tua timeline.</p></div>
        )}

        {tab === "Conquistas" && (
          <div className="badge-grid">
            <div className="badge-card"><div className="badge-card-icon">🔥</div><div className="badge-card-label">Sequência ativa</div></div>
            <div className="badge-card"><div className="badge-card-icon">🏅</div><div className="badge-card-label">{profile.reviews}+ avaliações</div></div>
          </div>
        )}

        {tab === "Serviços" && (profile.role === "trainer" || profile.role === "gym") && (
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Serviços</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.role === "trainer"
                ? ["Personal Training", "Online Coaching", "Sessões Privadas"].map((s) => <span key={s} className="pill" style={{ cursor: "default" }}>{s}</span>)
                : (profile.facilities || []).map((s) => <span key={s} className="pill" style={{ cursor: "default" }}>{s}</span>)}
            </div>
          </div>
        )}

        {tab === "Planos" && profile.role === "nutritionist" && (
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Planos Alimentares</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: 12.5, color: "var(--text-dim)" }}>Planos personalizados de acordo com o teu objetivo — consulta necessária para receberes o plano completo.</p>
            </div>
          </div>
        )}

        {tab === "Planos" && profile.role === "gym" && (
          <div className="plan-grid">
            {gymPlans.map((p) => (
              <div key={p.id} className={`plan-card ${p.highlighted ? "highlighted" : ""}`}>
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">{p.price}</div>
                <ul className="plan-features">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                <Link href="/dashboard/athlete/nearby" className="btn btn-primary btn-sm">Juntar-me ao Ginásio</Link>
              </div>
            ))}
          </div>
        )}

        {tab === "Galeria" && profile.role === "gym" && (
          <div className="grid">
            {(profile.gallery || []).map((g, i) => (
              <div key={i} style={{ background: g, height: 160, borderRadius: "var(--radius-lg)", border: "1px solid var(--line)" }} />
            ))}
          </div>
        )}

        {tab === "Treinadores" && profile.role === "gym" && (
          <div className="dash-panel">
            <div className="dash-panel-body">
              {bookableTrainers.map((t) => (
                <Link href={`/profile/${t.id === "t1" ? "ana-ferreira" : t.id === "t2" ? "rui-ferreira" : "nelson-sami"}`} key={t.id} className="client-row" style={{ textDecoration: "none", color: "inherit" }}>
                  <span className="lb-av">{initials(t.name)}</span>
                  <div className="client-info"><span className="client-name">{t.name}</span><span className="client-plan">{t.specialty}</span></div>
                  <span className="lb-xp tabular">⭐ {t.rating.toFixed(1)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === "Aulas" && profile.role === "gym" && (
          <div className="rich-grid">
            {gymClasses.map((c) => (
              <div className="rich-card" key={c.id}>
                <div className="rich-cover" style={{ background: c.cover }}><span className="rich-badge">{c.difficulty}</span></div>
                <div className="rich-body">
                  <div className="rich-title">{c.name}</div>
                  <div className="rich-meta-row"><span>{c.trainer}</span><span>{c.date} · {c.time}</span></div>
                </div>
              </div>
            ))}
            {gymClasses.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem aulas agendadas.</p>}
          </div>
        )}

        {tab === "Agenda" && (trainerInfo || nutritionistInfo) && (
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Disponibilidade</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <div className="slot-row">
                {(trainerInfo?.availability || nutritionistInfo?.availability || []).map((a) => (
                  <span key={a} className="slot-btn">{a}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Preços" && (trainerInfo || nutritionistInfo || gymInfo) && (
          <div className="dash-panel" style={{ padding: 24, maxWidth: 420 }}>
            <p style={{ fontSize: 24, fontWeight: 700 }} className="tabular">{(trainerInfo || nutritionistInfo || gymInfo)?.price}</p>
            <p style={{ fontSize: 12.5, color: "var(--text-faint)", marginBottom: 16 }}>{(trainerInfo || nutritionistInfo || gymInfo)?.durationMin} min por sessão</p>
            <Link href="/dashboard/athlete/book" className="btn btn-primary">
              {profile.role === "nutritionist" ? "Marcar Consulta" : "Reservar Sessão"}
            </Link>
          </div>
        )}

        {tab === "Reviews" && (
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Avaliações</h2><span>{profile.reviewsList.length}</span></div>
            <div className="dash-panel-body">
              {profile.reviewsList.length === 0 && <p style={{ padding: "16px 20px", fontSize: 12.5, color: "var(--text-faint)" }}>Ainda sem avaliações.</p>}
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
        )}

        {tab === "Produtos" && profile.role === "shop" && (
          <div className="grid">
            {shopProducts.map((p) => (
              <div className="product" key={p.n}>
                <div className="product-img" style={{ background: catBg[p.c] }}><span style={{ fontSize: 30 }}>{catIcon[p.c]}</span></div>
                <div className="product-body">
                  <div className="product-cat">{p.c.replace(/_/g, " ")}</div>
                  <div className="product-name">{p.n}</div>
                  <div className="product-foot">
                    <span className="product-price tabular">{p.p}</span>
                    <span className={`stock ${p.s}`}>{stockLabel[p.s]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Categorias" && profile.role === "shop" && (
          <div className="pill-row">
            {[...new Set(shopProducts.map((p) => p.c))].map((c) => (
              <span key={c} className="pill" style={{ cursor: "default" }}>{catIcon[c]} {c.replace(/_/g, " ")}</span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
