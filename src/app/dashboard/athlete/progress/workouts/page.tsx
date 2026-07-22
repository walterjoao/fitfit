"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProgressSubNav from "@/components/ProgressSubNav";
import { useRoleGuard } from "@/lib/session";
import { exercisePRs, workoutStats } from "@/lib/progressData";

export default function ProgressWorkoutsPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  return (
    <>
      <Sidebar role="athlete" active="progress" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Progresso de Treinos</h1>
          <p>Os teus recordes pessoais e evolução de carga.</p>
        </div>

        <ProgressSubNav />

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-top"><span className="stat-label">Exercício Mais Feito</span></div>
            <div className="stat-value" style={{ fontSize: 16 }}>{workoutStats.mostPerformed}</div>
            <div className="stat-delta up">{workoutStats.mostPerformedCount}x este mês</div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span className="stat-label">Tempo Médio por Treino</span></div>
            <div className="stat-value tabular">{workoutStats.avgDurationMin} min</div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span className="stat-label">Melhor PR</span></div>
            <div className="stat-value" style={{ fontSize: 16 }}>{exercisePRs[0].exercise}</div>
            <div className="stat-delta up">+{exercisePRs[0].after - exercisePRs[0].before}kg</div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span className="stat-label">Consistência</span></div>
            <div className="stat-value tabular">{workoutStats.consistencyPct}%</div>
          </div>
        </div>

        <div className="section-head"><h2>Recordes Pessoais (PRs)</h2><span>{exercisePRs.length}</span></div>
        <div className="rich-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {exercisePRs.map((pr) => (
            <div className="pr-card" key={pr.exercise}>
              <div className="pr-card-title">{pr.exercise}</div>
              <div className="pr-card-values">
                <span className="before">{pr.before}kg</span>
                <span className="arrow">→</span>
                <span className="after">{pr.after}kg</span>
              </div>
              <div className="pr-card-gain">▲ +{pr.after - pr.before}kg desde o início</div>
              <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8 }}>Recorde em {new Date(pr.date).toLocaleDateString("pt-PT")}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
