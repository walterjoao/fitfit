"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { messagesPath } from "@/lib/accountData";
import { trainees, traineeRequests, todaySessions, earningsThisMonth, type TraineeStatus } from "@/lib/trainerBusinessData";

const statusMeta: Record<TraineeStatus, { label: string; dot: string; badgeClass: string }> = {
  on: { label: "🟢 Em dia", dot: "var(--good)", badgeClass: "on" },
  risk: { label: "🔴 Em risco", dot: "var(--bad)", badgeClass: "risk" },
  paused: { label: "🟡 Atenção", dot: "var(--gold)", badgeClass: "paused" },
  inactive: { label: "⚪ Inativo", dot: "var(--text-faint)", badgeClass: "inactive" },
};

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

type Tab = "all" | "active" | "requests" | "risk" | "paused";
type AddMode = "email" | "link" | "search";

export default function ClientsPage() {
  const { ready } = useRoleGuard("trainer");
  const [tab, setTab] = useState<Tab>("all");
  const [requests, setRequests] = useState(traineeRequests);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invited, setInvited] = useState(false);
  const [addMode, setAddMode] = useState<AddMode>("email");
  const [search, setSearch] = useState("");
  const [goalFilter, setGoalFilter] = useState("all");

  const goals = [...new Set(trainees.map((t) => t.goal))];

  const visible = useMemo(
    () =>
      trainees.filter((c) => {
        const matchesTab = tab === "all" || (tab === "active" && c.status === "on") || (tab === "risk" && c.status === "risk") || (tab === "paused" && c.status === "paused");
        const matchesGoal = goalFilter === "all" || c.goal === goalFilter;
        return matchesTab && matchesGoal;
      }),
    [tab, goalFilter]
  );

  if (!ready) return null;

  const searchResults = trainees.filter((t) => search && t.name.toLowerCase().includes(search.toLowerCase()));

  function acceptRequest(id: string) {
    setRequests((r) => r.filter((x) => x.id !== id));
  }
  function rejectRequest(id: string) {
    setRequests((r) => r.filter((x) => x.id !== id));
  }
  function invite() {
    if (!inviteEmail) return;
    setInvited(true);
    setInviteEmail("");
    setTimeout(() => setInvited(false), 2500);
  }

  const totalCount = trainees.length;
  const activeCount = trainees.filter((t) => t.status === "on").length;
  const riskCount = trainees.filter((t) => t.status === "risk").length;

  return (
    <>
      <Sidebar role="trainer" active="clients" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Os Meus Atletas</h1>
          <p>Gere perfis, objetivos, progresso e evolução dos teus atletas.</p>
        </div>

        <div className="stat-grid" style={{ marginBottom: 22 }}>
          <button className="stat-card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => setTab("all")}>
            <div className="stat-top"><span className="stat-label">👥 Total Atletas</span></div>
            <div className="stat-value tabular">{totalCount}</div>
          </button>
          <button className="stat-card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => setTab("active")}>
            <div className="stat-top"><span className="stat-label">🟢 Ativos</span></div>
            <div className="stat-value tabular">{activeCount}</div>
          </button>
          <button className="stat-card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => setTab("risk")}>
            <div className="stat-top"><span className="stat-label">🔴 Em Risco</span></div>
            <div className="stat-value tabular">{riskCount}</div>
            <div className="stat-delta down">precisam de atenção</div>
          </button>
          <div className="stat-card">
            <div className="stat-top"><span className="stat-label">📅 Sessões Esta Semana</span></div>
            <div className="stat-value tabular">{todaySessions.length * 5}</div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span className="stat-label">💰 Receita Gerada</span></div>
            <div className="stat-value tabular">{earningsThisMonth.toLocaleString("pt-PT")} Kz</div>
          </div>
        </div>

        <div className="toggle-row">
          <button className={`toggle-btn ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>Todos</button>
          <button className={`toggle-btn ${tab === "active" ? "active" : ""}`} onClick={() => setTab("active")}>Ativos</button>
          <button className={`toggle-btn ${tab === "requests" ? "active" : ""}`} onClick={() => setTab("requests")}>Novos Pedidos {requests.length > 0 && `(${requests.length})`}</button>
          <button className={`toggle-btn ${tab === "risk" ? "active" : ""}`} onClick={() => setTab("risk")}>Em Risco</button>
          <button className={`toggle-btn ${tab === "paused" ? "active" : ""}`} onClick={() => setTab("paused")}>Pausados</button>
        </div>

        {tab !== "requests" ? (
          <>
            <div className="dash-panel" style={{ padding: 18, marginBottom: 20 }}>
              <div className="toggle-row" style={{ marginBottom: 12 }}>
                <button className={`toggle-btn ${addMode === "email" ? "active" : ""}`} onClick={() => setAddMode("email")}>Convidar por Email</button>
                <button className={`toggle-btn ${addMode === "link" ? "active" : ""}`} onClick={() => setAddMode("link")}>Link de Convite</button>
                <button className={`toggle-btn ${addMode === "search" ? "active" : ""}`} onClick={() => setAddMode("search")}>Procurar Atleta</button>
              </div>
              {addMode === "email" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input className="field-input" style={{ maxWidth: 280 }} placeholder="email@exemplo.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                  <button className="btn btn-primary btn-sm" onClick={invite} disabled={!inviteEmail}>Enviar Convite</button>
                  {invited && <span style={{ color: "var(--good)", fontSize: 12.5, alignSelf: "center" }}>✓ Convite enviado</span>}
                </div>
              )}
              {addMode === "link" && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input className="field-input" readOnly value={`fitpro.ancoia.com/dashboard/athlete/book/t1`} style={{ maxWidth: 340 }} />
                  <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/dashboard/athlete/book/t1`); setInvited(true); setTimeout(() => setInvited(false), 2000); }}>
                    {invited ? "✓ Copiado" : "Copiar Link"}
                  </button>
                </div>
              )}
              {addMode === "search" && (
                <div>
                  <input className="field-input" style={{ maxWidth: 320, marginBottom: 10 }} placeholder="Procurar atleta na FitPro…" value={search} onChange={(e) => setSearch(e.target.value)} />
                  {search && searchResults.length === 0 && <p style={{ fontSize: 12, color: "var(--text-faint)" }}>Nenhum atleta encontrado.</p>}
                  {searchResults.map((r) => (
                    <div className="schedule-item" key={r.id}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.avatar} alt={r.name} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} />
                      <div className="schedule-body"><p>{r.name}</p></div>
                      <span className="badge on" style={{ marginLeft: "auto" }}>Já é teu cliente</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <select className="field-input" style={{ maxWidth: 220 }} value={goalFilter} onChange={(e) => setGoalFilter(e.target.value)}>
                <option value="all">Todos os objetivos</option>
                {goals.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="section-head"><h2>{tab === "active" ? "Atletas Ativos" : tab === "risk" ? "Atletas Em Risco" : tab === "paused" ? "Atletas Pausados" : "Todos os Atletas"}</h2><span>{visible.length}</span></div>
            <div className="rich-grid">
              {visible.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem atletas nesta categoria.</p>}
              {visible.map((c) => {
                const meta = statusMeta[c.status];
                return (
                  <div className="rich-card" key={c.id}>
                    <Link href={`/profile/${c.profileId}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div className="rich-cover" style={{ background: `url(${c.avatar}) center/cover no-repeat`, height: 120 }}>
                        <span className={`badge ${meta.badgeClass}`}>{meta.label}</span>
                      </div>
                    </Link>
                    <div className="rich-body">
                      <Link href={`/profile/${c.profileId}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="rich-title">{c.name}</div>
                      </Link>
                      <div className="rich-meta-row"><span>🎯 {c.goal}</span></div>
                      <div className="rich-meta-row"><span>{c.program}</span></div>
                      <div className="rich-meta-row" style={{ justifyContent: "space-between" }}>
                        <span>Progresso</span>
                        <span className="tabular">{c.progress}%</span>
                      </div>
                      <div className="rich-progress"><div className="rich-progress-fill" style={{ width: `${c.progress}%` }} /></div>
                      <div className="rich-meta-row"><span>Última atividade: {c.lastActivity}</span></div>
                      <div className="rich-actions" style={{ flexWrap: "wrap" }}>
                        <Link href={`/profile/${c.profileId}`} className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: "center" }}>Ver Perfil</Link>
                        <Link href={messagesPath("trainer")} className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: "center" }}>Mensagem</Link>
                        <Link href={`/programs?athlete=${c.id}`} className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: "center" }}>Atribuir Treino</Link>
                        <Link href="/calendar" className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: "center" }}>Marcar Sessão</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Pedidos de Coaching</h2><span>{requests.length}</span></div>
            <div className="dash-panel-body">
              {requests.length === 0 && <p style={{ padding: 20, fontSize: 12.5, color: "var(--text-faint)" }}>Sem pedidos pendentes.</p>}
              {requests.map((r) => (
                <div className="schedule-item" key={r.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.avatar} alt={r.name} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
                  <div className="schedule-body">
                    <p>{r.name} · 🎯 {r.goal}</p>
                    <span>&ldquo;{r.message}&rdquo;</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                    <button className="btn btn-primary btn-sm" onClick={() => acceptRequest(r.id)}>Aceitar</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => rejectRequest(r.id)}>Rejeitar</button>
                    <Link href={messagesPath("trainer")} className="btn btn-ghost btn-sm">Mensagem</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
