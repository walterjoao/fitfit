"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const members = [
  { name: "Carla Domingos", plan: "Premium · Personal Trainer: Ana Ferreira", status: "on" as const },
  { name: "Rui Ferreira", plan: "Standard · Personal Trainer: Ana Ferreira", status: "on" as const },
  { name: "Inês Gonçalves", plan: "Premium · Nutricionista: Inês Gonçalves", status: "on" as const },
  { name: "Tiago Kiala", plan: "Básico · Sem treinador atribuído", status: "risk" as const },
  { name: "Marta Neto", plan: "Standard · Personal Trainer: Rui Ferreira", status: "paused" as const },
  { name: "Nelson Sami", plan: "Premium · Personal Trainer: Nelson Sami", status: "on" as const },
];

const statusLabel = { on: "Ativo", risk: "Sem atividade recente", paused: "Subscrição pausada" };

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function GymMembersPage() {
  return (
    <>
      <Sidebar role="gym" active="members" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Membros</h1>
          <p>Gere todos os membros do ginásio: treinador atribuído, subscrição, pagamentos e progresso.</p>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Todos os membros</h2>
            <span>{members.length} de 1.240</span>
          </div>
          <div className="dash-panel-body">
            {members.map((m) => (
              <div className="client-row" key={m.name}>
                <span className="lb-av">{initials(m.name)}</span>
                <div className="client-info">
                  <span className="client-name">{m.name}</span>
                  <span className="client-plan">{m.plan}</span>
                </div>
                <span className={`badge ${m.status}`}>{statusLabel[m.status]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
