"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const clients = [
  { name: "Carla Domingos", plan: "Transformação · 12 sem.", progress: 82, status: "on" as const },
  { name: "Rui Ferreira", plan: "Ganho de massa · 8 sem.", progress: 64, status: "on" as const },
  { name: "Inês Gonçalves", plan: "Recomposição · 16 sem.", progress: 41, status: "risk" as const },
  { name: "Tiago Kiala", plan: "Consistência · 6 sem.", progress: 90, status: "on" as const },
  { name: "Marta Neto", plan: "Perda de peso · 10 sem.", progress: 20, status: "paused" as const },
  { name: "Nelson Sami", plan: "Performance · 20 sem.", progress: 55, status: "risk" as const },
  { name: "Beatriz Chiapa", plan: "Consistência · 4 sem.", progress: 30, status: "on" as const },
  { name: "Ricardo Bumba", plan: "Ganho de massa · 14 sem.", progress: 71, status: "on" as const },
];

const statusLabel = { on: "Em dia", risk: "Em risco", paused: "Pausado" };

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function ClientsPage() {
  return (
    <>
      <Sidebar role="trainer" active="clients" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Clientes</h1>
          <p>Gere os perfis, objetivos e progresso de todos os teus clientes.</p>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Todos os clientes</h2>
            <span>{clients.length} de 84</span>
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
