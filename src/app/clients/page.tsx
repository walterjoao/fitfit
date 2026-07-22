"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { messagesPath } from "@/lib/accountData";
import { trainees, traineeRequests, type TraineeStatus } from "@/lib/trainerBusinessData";

const statusLabel: Record<TraineeStatus, string> = { on: "Em dia", risk: "Em risco", paused: "Pausado", inactive: "Inativo" };

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

type Tab = "all" | "active" | "inactive" | "requests";

export default function ClientsPage() {
  const { ready } = useRoleGuard("trainer");
  const [tab, setTab] = useState<Tab>("all");
  const [requests, setRequests] = useState(traineeRequests);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invited, setInvited] = useState(false);

  if (!ready) return null;

  const visible = trainees.filter((c) => {
    if (tab === "active") return c.status === "on";
    if (tab === "inactive") return c.status === "paused" || c.status === "inactive";
    return true;
  });

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

  return (
    <>
      <Sidebar role="trainer" active="clients" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Clientes</h1>
          <p>Gere os perfis, objetivos e progresso de todos os teus clientes.</p>
        </div>

        <div className="toggle-row">
          <button className={`toggle-btn ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>Todos os Clientes</button>
          <button className={`toggle-btn ${tab === "active" ? "active" : ""}`} onClick={() => setTab("active")}>Ativos</button>
          <button className={`toggle-btn ${tab === "inactive" ? "active" : ""}`} onClick={() => setTab("inactive")}>Inativos</button>
          <button className={`toggle-btn ${tab === "requests" ? "active" : ""}`} onClick={() => setTab("requests")}>Pedidos {requests.length > 0 && `(${requests.length})`}</button>
        </div>

        {tab !== "requests" ? (
          <>
            <div className="dash-panel" style={{ padding: 18, marginBottom: 20 }}>
              <p className="field-label" style={{ marginBottom: 10 }}>Adicionar Cliente</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input className="field-input" style={{ maxWidth: 280 }} placeholder="Convidar por email…" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                <button className="btn btn-primary btn-sm" onClick={invite} disabled={!inviteEmail}>Enviar Convite</button>
                <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/dashboard/athlete/book/t1`); }}>Copiar Link de Convite</button>
                {invited && <span style={{ color: "var(--good)", fontSize: 12.5, alignSelf: "center" }}>✓ Convite enviado</span>}
              </div>
            </div>

            <div className="dash-panel">
              <div className="dash-panel-head">
                <h2>{tab === "active" ? "Clientes Ativos" : tab === "inactive" ? "Clientes Inativos" : "Todos os Clientes"}</h2>
                <span>{visible.length}</span>
              </div>
              <div className="dash-panel-body">
                {visible.map((c) => (
                  <Link href={`/profile/${c.profileId}`} key={c.id} className="client-row" style={{ textDecoration: "none", color: "inherit" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.avatar} alt={c.name} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
                    <div className="client-info">
                      <span className="client-name">{c.name}</span>
                      <span className="client-plan">{c.email} · {c.program}</span>
                    </div>
                    <div className="client-progress">
                      <div className="client-progress-fill" style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className={`badge ${c.status}`}>{statusLabel[c.status]}</span>
                  </Link>
                ))}
              </div>
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
