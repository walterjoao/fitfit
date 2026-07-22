"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProgressSubNav from "@/components/ProgressSubNav";
import { useRoleGuard } from "@/lib/session";
import { useLocalList } from "@/lib/progressStore";
import { seedMeasurements, type MeasurementEntry } from "@/lib/progressData";

export default function ProgressBodyPage() {
  const { ready } = useRoleGuard("athlete");
  const list = useLocalList<MeasurementEntry>("fitpro_measurements", seedMeasurements);
  const [entries, setEntries] = useState<MeasurementEntry[]>([]);

  useEffect(() => {
    setEntries(list.getAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const first = [...entries].sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <>
      <Sidebar role="athlete" active="progress" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Corpo</h1>
          <p>Regista e acompanha as tuas medidas corporais ao longo do tempo.</p>
        </div>

        <ProgressSubNav />

        {latest && first && (
          <div className="stat-grid">
            {(["chest", "waist", "arm", "leg"] as const).map((k) => {
              const label = { chest: "Peito", waist: "Cintura", arm: "Braço", leg: "Perna" }[k];
              const delta = latest[k] - first[k];
              return (
                <div className="stat-card" key={k}>
                  <div className="stat-top"><span className="stat-label">{label}</span></div>
                  <div className="stat-value tabular">{latest[k]} cm</div>
                  <div className={`stat-delta ${delta >= 0 ? "up" : "down"}`}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)} cm</div>
                </div>
              );
            })}
          </div>
        )}

        <div className="ai-box" style={{ marginBottom: 20 }}>
          <div className="ai-icon">📏</div>
          <p>Para adicionar, editar ou remover medições e fotos de transformação, vai a <Link href="/dashboard/athlete/settings" style={{ color: "var(--accent-ink)", fontWeight: 700 }}>Definições → Medidas</Link>.</p>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Histórico</h2><span>{sorted.length}</span></div>
            <div className="dash-panel-body">
              {sorted.map((e) => (
                <div className="tx-row" key={e.id}>
                  <div className="tx-info">
                    <div className="tx-label">{new Date(e.date).toLocaleDateString("pt-PT")}</div>
                    <div className="tx-sub">Peito {e.chest}cm · Cintura {e.waist}cm · Braço {e.arm}cm · Perna {e.leg}cm</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
