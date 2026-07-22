"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProgressSubNav from "@/components/ProgressSubNav";
import { useRoleGuard } from "@/lib/session";
import { historyEvents, type HistoryEvent } from "@/lib/progressData";

const typeColor: Record<HistoryEvent["type"], string> = {
  peso: "var(--accent)",
  treino: "var(--gold)",
  "nutrição": "var(--good)",
  corpo: "var(--bad)",
};

const filters: { key: HistoryEvent["type"] | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "peso", label: "Peso" },
  { key: "treino", label: "Treino" },
  { key: "nutrição", label: "Nutrição" },
  { key: "corpo", label: "Corpo" },
];

export default function ProgressHistoryPage() {
  const { ready } = useRoleGuard("athlete");
  const [filter, setFilter] = useState<HistoryEvent["type"] | "all">("all");
  if (!ready) return null;

  const visible = filter === "all" ? historyEvents : historyEvents.filter((e) => e.type === filter);

  return (
    <>
      <Sidebar role="athlete" active="progress" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Histórico</h1>
          <p>Tudo o que foi registado automaticamente na tua jornada FitPro.</p>
        </div>

        <ProgressSubNav />

        <div className="pill-row">
          {filters.map((f) => (
            <button key={f.key} className={`pill ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-body">
            {visible.length === 0 && <p style={{ padding: "20px", fontSize: 12.5, color: "var(--text-faint)" }}>Sem eventos nesta categoria.</p>}
            {visible.map((e) => (
              <div className="schedule-item" key={e.id}>
                <span className="schedule-dot" style={{ background: typeColor[e.type] }} />
                <div className="schedule-body">
                  <p>{e.text}</p>
                  <span>{e.date} · {e.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
