"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const clients = [
  { name: "Inês Gonçalves", plan: "Recomposição corporal", progress: 74, status: "on" as const },
  { name: "Marta Neto", plan: "Perda de peso", progress: 38, status: "risk" as const },
  { name: "Tiago Kiala", plan: "Ganho de massa", progress: 90, status: "on" as const },
  { name: "Diana Sacramento", plan: "Manutenção", progress: 55, status: "paused" as const },
  { name: "André Katumba", plan: "Perda de peso", progress: 66, status: "on" as const },
];

const statusLabel = { on: "Em dia", risk: "Em risco", paused: "Pausado" };

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function NutritionistClientsPage() {
  return (
    <>
      <Sidebar role="nutritionist" active="clients" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Clientes</h1>
          <p>Preferências alimentares, planos e histórico nutricional de cada cliente.</p>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Todos os clientes</h2>
            <span>{clients.length} de 46</span>
          </div>
          <div className="dash-panel-body">
            {clients.map((c) => (
              <div className="client-row" key={c.name}>
                <span className="lb-av">{initials(c.name)}</span>
                <div className="client-info">
                  <span className="client-name">{c.name}</span>
                  <span className="client-plan">{c.plan}</span>
                </div>
                <div className="client-progress">
                  <div className="client-progress-fill" style={{ width: `${c.progress}%` }} />
                </div>
                <span className={`badge ${c.status}`}>{statusLabel[c.status]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
