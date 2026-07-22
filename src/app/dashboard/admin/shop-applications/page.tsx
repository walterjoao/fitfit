"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

type Application = {
  id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_role: string;
  business_name: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function ShopApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/shop-applications");
    const data = await res.json();
    setApps(data.applications || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: number) {
    setApprovingId(id);
    await fetch("/api/shop-applications/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
    setApprovingId(null);
  }

  return (
    <>
      <Sidebar role="admin" active="shop_applications" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Candidaturas de Loja</h1>
          <p>Pedidos de contas de qualquer tipo para venderem também na Loja.</p>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Todas as candidaturas</h2>
            <span>{apps.length}</span>
          </div>
          <div className="dash-panel-body">
            {loading && <p style={{ padding: "16px 20px", fontSize: 12.5, color: "var(--text-faint)" }}>A carregar…</p>}
            {!loading && apps.length === 0 && (
              <p style={{ padding: "16px 20px", fontSize: 12.5, color: "var(--text-faint)" }}>Ainda não há candidaturas.</p>
            )}
            {apps.map((a) => (
              <div className="client-row" key={a.id} style={{ gridTemplateColumns: "auto 1fr auto auto" }}>
                <span className="lb-av">{a.applicant_name.slice(0, 2).toUpperCase()}</span>
                <div className="client-info">
                  <span className="client-name">{a.business_name} · {a.applicant_name}</span>
                  <span className="client-plan">{a.applicant_email} · conta {a.applicant_role}</span>
                </div>
                <span className={`badge ${a.status === "approved" ? "on" : a.status === "rejected" ? "risk" : "paused"}`}>
                  {a.status === "approved" ? "Aprovada" : a.status === "rejected" ? "Rejeitada" : "Pendente"}
                </span>
                {a.status === "pending" ? (
                  <button className="btn btn-primary btn-sm" onClick={() => approve(a.id)} disabled={approvingId === a.id}>
                    {approvingId === a.id ? "A aprovar…" : "Aprovar"}
                  </button>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
