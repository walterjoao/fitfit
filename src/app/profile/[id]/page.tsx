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
import { plansByRole, messagesPath } from "@/lib/accountData";
import { nutritionistBusiness } from "@/lib/nutritionistBusiness";
import { seedWeightLog, exercisePRs as seedPRs, type ExercisePR } from "@/lib/progressData";
import {
  getProfileOverride, saveProfileOverride, goalOptions, levelOptions,
  getPRs, addPR, removePR,
  getFeed, addFeedPost, removeFeedPost, toggleLike, type FeedPost,
  allBadgesWithVisibility, toggleBadgeVisibility,
} from "@/lib/athleteProfileData";
import { myClasses } from "@/lib/workoutsData";
import { shopProducts, isWishlisted } from "@/lib/data";

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
  athlete: ["Overview", "Atividade", "Treinos", "Recordes", "Conteúdo", "Progresso", "Conquistas", "Marcações", "Loja"],
  trainer: ["Overview", "Serviços", "Agenda", "Preços", "Reviews", "Conteúdo"],
  nutritionist: ["Overview", "Sobre", "Serviços", "Planos", "Receitas", "Resultados", "Agenda", "Reviews", "Contacto"],
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
  const [editingHeader, setEditingHeader] = useState(false);
  const [override, setOverride] = useState(getProfileOverride());
  const [prs, setPrs] = useState<ExercisePR[]>(seedPRs);
  const [newPR, setNewPR] = useState({ exercise: "", before: "", after: "" });
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [badgeList, setBadgeList] = useState(allBadgesWithVisibility());

  useEffect(() => {
    if (profile) setFollowing(isFollowing(profile.id));
    setPrs(getPRs());
    setFeed(getFeed());
  }, [profile]);

  const isOwner = !!session && !!profile && profile.role === "athlete" && session.name === profile.name;

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
  const business = nutritionistInfo ? nutritionistBusiness[nutritionistInfo.id] : undefined;

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
              {nutritionistInfo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={nutritionistInfo.photo} alt={profile.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", marginTop: -48, border: "3px solid var(--surface)" }} />
              ) : (
                <span className="avatar" style={{ width: 56, height: 56, fontSize: 18, marginTop: -48, border: "3px solid var(--surface)" }}>
                  {initials(profile.name)}
                </span>
              )}
              <div>
                <h3>{profile.name}</h3>
                {nutritionistInfo ? (
                  <div className="featured-meta">
                    <span>{nutritionistInfo.specialty}</span>
                    <span>📍 {override.location || profile.location}</span>
                    <span className="rich-badge" style={{ background: "var(--accent-soft)", color: "var(--accent-ink)" }}>{nutritionistInfo.sessionType}</span>
                  </div>
                ) : (
                  <div className="featured-meta">
                    <span>📍 {override.location || profile.location}</span>
                    {isOwner && (override.goal || "Cutting") && <span className="rich-badge" style={{ background: "var(--accent-soft)", color: "var(--accent-ink)" }}>🎯 {override.goal || "Cutting"}</span>}
                    {isOwner && <span className="rich-badge">{override.level || "Intermédio"}</span>}
                  </div>
                )}
              </div>
            </div>

            {isOwner && editingHeader ? (
              <div className="dash-panel" style={{ padding: 18, maxWidth: 560 }}>
                <div className="form-grid">
                  <label className="field" style={{ gridColumn: "1 / -1" }}>
                    <span className="field-label">Bio</span>
                    <input className="field-input" value={override.bio ?? profile.bio} onChange={(e) => setOverride((o) => ({ ...o, bio: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Localização</span>
                    <input className="field-input" value={override.location ?? profile.location} onChange={(e) => setOverride((o) => ({ ...o, location: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Objetivo</span>
                    <select className="field-input" value={override.goal || goalOptions[0]} onChange={(e) => setOverride((o) => ({ ...o, goal: e.target.value }))}>
                      {goalOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    <span className="field-label">Nível</span>
                    <select className="field-input" value={override.level || levelOptions[1]} onChange={(e) => setOverride((o) => ({ ...o, level: e.target.value }))}>
                      {levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </label>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { saveProfileOverride(override); setEditingHeader(false); }}>Guardar</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditingHeader(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, maxWidth: 560 }}>{override.bio ?? profile.bio}</p>
            )}
            <div className="featured-meta">
              {nutritionistInfo && business ? (
                <>
                  <span>⭐ {profile.rating.toFixed(1)} ({profile.reviews} avaliações)</span>
                  <span><b className="tabular">{business.clients}</b> clientes</span>
                  <span><b className="tabular">{business.consultations}</b> consultas realizadas</span>
                  <span><b className="tabular">{profile.followers}</b> seguidores</span>
                </>
              ) : (
                <>
                  <span><b className="tabular">{profile.followers}</b> seguidores</span>
                  <span><b className="tabular">{profile.following}</b> a seguir</span>
                  <span>⭐ {profile.rating.toFixed(1)} ({profile.reviews} avaliações)</span>
                </>
              )}
            </div>
            <div className="featured-actions">
              {isOwner ? (
                <button className="btn btn-primary" onClick={() => setEditingHeader((v) => !v)}>Editar Perfil</button>
              ) : nutritionistInfo ? (
                <Link href={`/dashboard/athlete/book/${nutritionistInfo.id}`} className="btn btn-primary">Marcar Consulta</Link>
              ) : (
                <button
                  className={`btn ${following ? "btn-ghost" : "btn-primary"}`}
                  onClick={() => setFollowing(toggleFollow(profile.id))}
                >
                  {following ? "A Seguir ✓" : "Seguir"}
                </button>
              )}
              <Link href={session ? messagesPath(session.role) : "/dashboard/athlete/messages"} className="btn btn-ghost">Mensagem</Link>
              {nutritionistInfo && (
                <button className={`btn ${following ? "btn-ghost" : "btn-ghost"}`} onClick={() => setFollowing(toggleFollow(profile.id))}>
                  {following ? "A Seguir ✓" : "Seguir"}
                </button>
              )}
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

        {tab === "Overview" && profile.role === "nutritionist" && business && session?.role === "nutritionist" && (
          <div className="ai-box" style={{ marginBottom: 20 }}>
            <div className="ai-icon">🤖</div>
            <p>O teu perfil está 85% completo. Adiciona mais fotos da galeria para aumentar as marcações em até 20%. O preço da tua consulta inicial está competitivo face à média do mercado.</p>
          </div>
        )}

        {tab === "Overview" && profile.role === "athlete" && (
          <div className="stat-grid" style={{ marginBottom: 20 }}>
            {isOwner && editingHeader ? (
              <div className="dash-panel" style={{ gridColumn: "1 / -1", padding: 16 }}>
                <div className="form-grid">
                  <label className="field"><span className="field-label">Peso (kg)</span><input className="field-input" type="number" defaultValue={override.weightKg ?? seedWeightLog[seedWeightLog.length - 1]?.kg} onChange={(e) => setOverride((o) => ({ ...o, weightKg: Number(e.target.value) }))} /></label>
                  <label className="field"><span className="field-label">Altura (cm)</span><input className="field-input" type="number" defaultValue={override.heightCm ?? 178} onChange={(e) => setOverride((o) => ({ ...o, heightCm: Number(e.target.value) }))} /></label>
                  <label className="field"><span className="field-label">% Gordura Corporal</span><input className="field-input" type="number" defaultValue={override.bodyFatPct ?? 16} onChange={(e) => setOverride((o) => ({ ...o, bodyFatPct: Number(e.target.value) }))} /></label>
                  <label className="field"><span className="field-label">Treinos/semana</span><input className="field-input" type="number" defaultValue={override.trainingFreq ?? 5} onChange={(e) => setOverride((o) => ({ ...o, trainingFreq: Number(e.target.value) }))} /></label>
                </div>
              </div>
            ) : (
              <>
                <div className="stat-card"><div className="stat-top"><span className="stat-label">⚖️ Peso</span></div><div className="stat-value tabular">{override.weightKg ?? seedWeightLog[seedWeightLog.length - 1]?.kg}kg</div></div>
                <div className="stat-card"><div className="stat-top"><span className="stat-label">📏 Altura</span></div><div className="stat-value tabular">{override.heightCm ?? 178}cm</div></div>
                <div className="stat-card"><div className="stat-top"><span className="stat-label">🔥 Sequência Ativa</span></div><div className="stat-value tabular">{Math.round(profile.followers / 30)} dias</div></div>
                <div className="stat-card"><div className="stat-top"><span className="stat-label">📅 Frequência</span></div><div className="stat-value tabular">{override.trainingFreq ?? 5}x / semana</div></div>
              </>
            )}
          </div>
        )}

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

        {tab === "Atividade" && profile.role === "athlete" && (
          <div style={{ maxWidth: 640 }}>
            {isOwner && (
              <div className="dash-panel" style={{ padding: 16, marginBottom: 16 }}>
                <label className="field" style={{ marginBottom: 10 }}>
                  <span className="field-label">Nova publicação</span>
                  <input className="field-input" value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Partilha um treino, foto ou conquista…" />
                </label>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!newPost.trim()}
                  onClick={() => { setFeed(addFeedPost(newPost.trim(), "update")); setNewPost(""); }}
                >
                  Publicar
                </button>
              </div>
            )}
            {feed.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Ainda sem publicações.</p>}
            {feed.map((p) => (
              <div className="dash-panel" style={{ padding: 16, marginBottom: 12 }} key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{p.date}</span>
                  {isOwner && (
                    <button className="icon-action" title="Eliminar" onClick={() => setFeed(removeFeedPost(p.id))}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
                <p style={{ fontSize: 13.5, marginBottom: 10 }}>{p.caption}</p>
                <div className="rich-meta-row">
                  <button className="btn btn-ghost btn-sm" onClick={() => setFeed(toggleLike(p.id))}>{p.liked ? "❤️" : "🤍"} {p.likes}</button>
                  <span>💬 {p.comments} comentários</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Recordes" && profile.role === "athlete" && (
          <div style={{ maxWidth: 560 }}>
            {isOwner && (
              <div className="dash-panel" style={{ padding: 16, marginBottom: 16 }}>
                <div className="form-grid" style={{ marginBottom: 10 }}>
                  <input className="field-input" placeholder="Exercício" value={newPR.exercise} onChange={(e) => setNewPR((n) => ({ ...n, exercise: e.target.value }))} />
                  <input className="field-input" placeholder="Anterior (kg)" type="number" value={newPR.before} onChange={(e) => setNewPR((n) => ({ ...n, before: e.target.value }))} />
                  <input className="field-input" placeholder="Atual (kg)" type="number" value={newPR.after} onChange={(e) => setNewPR((n) => ({ ...n, after: e.target.value }))} />
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!newPR.exercise}
                  onClick={() => {
                    setPrs(addPR({ exercise: newPR.exercise, before: Number(newPR.before) || 0, after: Number(newPR.after) || 0, date: new Date().toISOString().slice(0, 10) }));
                    setNewPR({ exercise: "", before: "", after: "" });
                  }}
                >
                  Adicionar Recorde
                </button>
              </div>
            )}
            <div className="dash-panel">
              <div className="dash-panel-head"><h2>Recordes Pessoais</h2><span>{prs.length}</span></div>
              <div className="dash-panel-body">
                {prs.map((pr) => (
                  <div className="schedule-item" key={pr.exercise}>
                    <span className="schedule-dot" />
                    <div className="schedule-body">
                      <p>{pr.exercise}</p>
                      <span>{pr.before}kg → {pr.after}kg · {pr.date}</span>
                    </div>
                    {isOwner && (
                      <button className="icon-action" title="Remover" onClick={() => setPrs(removePR(pr.exercise))} style={{ marginLeft: "auto" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Marcações" && profile.role === "athlete" && isOwner && (
          <div className="dash-row">
            <div className="dash-panel">
              <div className="dash-panel-head"><h2>Próximas Sessões</h2><span>{myClasses.upcoming.length}</span></div>
              <div className="dash-panel-body">
                {myClasses.upcoming.map((c) => (
                  <div className="schedule-item" key={c.id}>
                    <span className="schedule-dot" />
                    <div className="schedule-body"><p>{c.name}</p><span>{c.date} · {c.time} · {c.location}</span></div>
                    <Link href="/dashboard/athlete/classes" className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}>Ver</Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-panel">
              <div className="dash-panel-head"><h2>Profissionais Favoritos</h2></div>
              <div className="dash-panel-body">
                {bookableTrainers.slice(0, 3).map((t) => (
                  <div className="schedule-item" key={t.id}>
                    <span className="schedule-dot" />
                    <div className="schedule-body"><p>{t.name}</p><span>{t.specialty} · ⭐ {t.rating.toFixed(1)}</span></div>
                    <Link href={`/dashboard/athlete/book/${t.id}`} className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}>Reservar</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Loja" && profile.role === "athlete" && isOwner && (
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Favoritos & Wishlist</h2></div>
            <div className="rich-grid" style={{ padding: 16 }}>
              {shopProducts.filter((p) => isWishlisted(p.id)).length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem produtos guardados ainda.</p>}
              {shopProducts.filter((p) => isWishlisted(p.id)).map((p) => (
                <Link href={`/dashboard/athlete/shop/${p.id}`} key={p.id} className="rich-card" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="rich-cover" style={{ background: `url(${p.images[0]}) center/cover no-repeat` }} />
                  <div className="rich-body">
                    <div className="rich-title">{p.name}</div>
                    <div className="rich-meta-row"><span>{p.storeName}</span></div>
                  </div>
                </Link>
              ))}
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

        {tab === "Conquistas" && profile.role === "athlete" && (
          <div className="badge-grid">
            {badgeList.filter((b) => isOwner || !b.hidden).map((b) => (
              <div className="badge-card" key={b.id} style={{ opacity: b.hidden ? 0.4 : 1, position: "relative" }}>
                <div className="badge-card-icon">{b.icon}</div>
                <div className="badge-card-label">{b.label}</div>
                {isOwner && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={() => { toggleBadgeVisibility(b.id); setBadgeList(allBadgesWithVisibility()); }}
                  >
                    {b.hidden ? "Mostrar" : "Ocultar"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "Conquistas" && profile.role !== "athlete" && (
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

        {tab === "Sobre" && profile.role === "nutritionist" && business && (
          <div className="dash-row">
            <div className="dash-panel">
              <div className="dash-panel-head"><h2>Filosofia & Abordagem</h2></div>
              <div className="dash-panel-body" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <p style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Filosofia</p>
                  <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>&ldquo;{business.philosophy}&rdquo;</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Abordagem</p>
                  <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>{business.approach}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Idiomas</p>
                  <p style={{ fontSize: 13, color: "var(--text-dim)" }}>{business.languages.join(" · ")}</p>
                </div>
              </div>
            </div>
            <div className="dash-panel">
              <div className="dash-panel-head"><h2>Formação & Certificação</h2></div>
              <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
                <p style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Educação</p>
                {business.education.map((e) => <p key={e} style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 6 }}>🎓 {e}</p>)}
                <p style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 700, textTransform: "uppercase", margin: "14px 0 6px" }}>Nº de Cédula Profissional</p>
                <p style={{ fontSize: 12.5, color: "var(--text-dim)" }} className="tabular">{business.licenseNumber}</p>
                {(profile.specialties || []).length > 0 && (
                  <>
                    <p style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 700, textTransform: "uppercase", margin: "14px 0 8px" }}>Especialidades</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {(profile.specialties || []).map((s) => <span key={s} className="pill" style={{ cursor: "default" }}>{s}</span>)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "Serviços" && profile.role === "nutritionist" && business && (
          <div className="rich-grid">
            {business.services.map((s) => (
              <div className="rich-card" key={s.id}>
                <div className="rich-body">
                  <div className="rich-title">{s.icon} {s.name}</div>
                  <p className="rich-desc">{s.description}</p>
                  <div className="rich-meta-row">
                    <span>⏱ {s.durationMin} min</span>
                    <span>{s.mode}</span>
                  </div>
                  <div className="rich-actions">
                    <span className="product-price tabular" style={{ flex: 1 }}>{s.price}</span>
                    <Link href={`/dashboard/athlete/book/${nutritionistInfo?.id}`} className="btn btn-primary btn-sm">Marcar</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Planos" && profile.role === "nutritionist" && business && (
          <div className="rich-grid">
            {business.plans.map((p) => (
              <div className="rich-card" key={p.id}>
                <div className="rich-cover" style={{ background: `url(${p.image}) center/cover no-repeat` }} />
                <div className="rich-body">
                  <div className="rich-title">{p.name}</div>
                  <p className="rich-desc">{p.description}</p>
                  <div className="rich-meta-row"><span>⏱ {p.duration}</span></div>
                  <div className="rich-actions">
                    <span className="product-price tabular" style={{ flex: 1 }}>{p.price}</span>
                    <Link href={`/dashboard/athlete/book/${nutritionistInfo?.id}`} className="btn btn-primary btn-sm">Pedir Consulta</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Receitas" && profile.role === "nutritionist" && business && (
          <div className="rich-grid">
            {business.recipes.map((r) => (
              <div className="rich-card" key={r.id}>
                <div className="rich-cover" style={{ background: `url(${r.image}) center/cover no-repeat` }} />
                <div className="rich-body">
                  <div className="rich-title">{r.name}</div>
                  <div className="rich-meta-row">
                    <span>🔥 {r.calories} kcal</span>
                    <span>🥩 {r.protein}g proteína</span>
                  </div>
                  <p className="rich-desc">{r.benefit}</p>
                </div>
              </div>
            ))}
            {business.posts.length > 0 && (
              <>
                {business.posts.map((post) => (
                  <div className="dash-panel" key={post.id} style={{ padding: 16 }}>
                    <p style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 4 }}>{post.date}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{post.title}</p>
                    <p style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.5 }}>{post.excerpt}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {tab === "Resultados" && profile.role === "nutritionist" && business && (
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Resultados & Testemunhos</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
              {business.results.map((r) => (
                <div key={r.id} style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.before} alt="antes" style={{ width: 90, height: 90, borderRadius: "var(--radius-md)", objectFit: "cover" }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.after} alt="depois" style={{ width: 90, height: 90, borderRadius: "var(--radius-md)", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{r.client}</p>
                    <p style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.5 }}>&ldquo;{r.text}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Contacto" && profile.role === "nutritionist" && business && (
          <div className="dash-panel" style={{ padding: 20, maxWidth: 420 }}>
            <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 8 }}>📍 {profile.location}</p>
            <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 8 }}>📧 {business.email}</p>
            <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 14 }}>📞 {business.phone}</p>
            {profile.whatsapp && (
              <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Abrir WhatsApp
              </a>
            )}
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
              <div className="slot-row" style={{ marginBottom: nutritionistInfo ? 16 : 0 }}>
                {(trainerInfo?.availability || nutritionistInfo?.availability || []).map((a) => (
                  <span key={a} className="slot-btn">{a}</span>
                ))}
              </div>
              {nutritionistInfo && (
                <Link href={`/dashboard/athlete/book/${nutritionistInfo.id}`} className="btn btn-primary">Marcar Consulta Agora</Link>
              )}
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
