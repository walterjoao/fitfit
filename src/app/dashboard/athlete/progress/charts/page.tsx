"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProgressSubNav from "@/components/ProgressSubNav";
import { useRoleGuard } from "@/lib/session";
import { seedWeightLog, seedMeasurements, performanceHistory } from "@/lib/progressData";

type Period = "7d" | "30d" | "3m" | "1y";
const periodDays: Record<Period, number> = { "7d": 7, "30d": 30, "3m": 90, "1y": 365 };

function LineChart({ points, unit }: { points: { label: string; value: number }[]; unit: string }) {
  const w = 560, h = 160, pad = 20;
  const values = points.map((p) => p.value);
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const coords = points.map((p, i) => ({
    x: pad + (i / Math.max(points.length - 1, 1)) * (w - pad * 2),
    y: pad + (1 - (p.value - min) / range) * (h - pad * 2),
  }));
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const area = `${path} L${coords[coords.length - 1].x},${h - pad} L${coords[0].x},${h - pad} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="line-chart-svg" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad} x2={w - pad} y1={pad + f * (h - pad * 2)} y2={pad + f * (h - pad * 2)} className="line-chart-grid" />
        ))}
        <path d={area} className="line-chart-area" />
        <path d={path} className="line-chart-line" />
        {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="3" className="line-chart-dot" />)}
      </svg>
      <div className="chart-bar-label" style={{ padding: "0 20px" }}>
        {points.map((p) => <span key={p.label}>{p.label}</span>)}
      </div>
      <p style={{ textAlign: "right", fontSize: 11, color: "var(--text-faint)", padding: "0 20px" }}>
        {min.toFixed(1)}{unit} — {max.toFixed(1)}{unit}
      </p>
    </div>
  );
}

export default function ProgressChartsPage() {
  const { ready } = useRoleGuard("athlete");
  const [period, setPeriod] = useState<Period>("3m");
  const [measure, setMeasure] = useState<"chest" | "waist" | "arm" | "leg">("waist");
  if (!ready) return null;

  const cutoff = Date.now() - periodDays[period] * 86400000;
  const weightPoints = seedWeightLog
    .filter((w) => new Date(w.date).getTime() >= cutoff)
    .map((w) => ({ label: new Date(w.date).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" }), value: w.kg }));

  const measureLabel = { chest: "Peito", waist: "Cintura", arm: "Braço", leg: "Perna" };
  const measurePoints = seedMeasurements.map((m) => ({
    label: new Date(m.date).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" }),
    value: m[measure],
  }));

  const perfPoints = performanceHistory.map((p) => ({ label: p.date, value: p.kg }));

  return (
    <>
      <Sidebar role="athlete" active="progress" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Gráficos</h1>
          <p>Clica num filtro para ajustares o período de análise.</p>
        </div>

        <ProgressSubNav />

        <div className="dash-panel" style={{ marginBottom: 24 }}>
          <div className="dash-panel-head">
            <h2>Peso</h2>
            <div className="toggle-row" style={{ marginBottom: 0 }}>
              {(["7d", "30d", "3m", "1y"] as Period[]).map((p) => (
                <button key={p} className={`toggle-btn ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)}>
                  {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : p === "3m" ? "3 meses" : "1 ano"}
                </button>
              ))}
            </div>
          </div>
          <div className="dash-panel-body" style={{ paddingTop: 10 }}>
            {weightPoints.length > 1 ? <LineChart points={weightPoints} unit="kg" /> : <p style={{ padding: 20, fontSize: 12.5, color: "var(--text-faint)" }}>Sem dados suficientes neste período.</p>}
          </div>
        </div>

        <div className="dash-panel" style={{ marginBottom: 24 }}>
          <div className="dash-panel-head">
            <h2>Medidas Corporais</h2>
            <div className="toggle-row" style={{ marginBottom: 0 }}>
              {(["chest", "waist", "arm", "leg"] as const).map((m) => (
                <button key={m} className={`toggle-btn ${measure === m ? "active" : ""}`} onClick={() => setMeasure(m)}>{measureLabel[m]}</button>
              ))}
            </div>
          </div>
          <div className="dash-panel-body" style={{ paddingTop: 10 }}>
            <LineChart points={measurePoints} unit="cm" />
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head"><h2>Performance · Supino Reto</h2><span>peso levantado</span></div>
          <div className="dash-panel-body" style={{ paddingTop: 10 }}>
            <LineChart points={perfPoints} unit="kg" />
          </div>
        </div>
      </div>
    </>
  );
}
