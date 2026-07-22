"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";

type Category = "trainer" | "gym" | "nutritionist" | "athlete";

const nearbyData: Record<Category, { name: string; sub: string; distanceKm: number }[]> = {
  trainer: [
    { name: "Ana Ferreira", sub: "Força e hipertrofia · 84 clientes", distanceKm: 1.2 },
    { name: "Rui Ferreira", sub: "Hipertrofia · 52 clientes", distanceKm: 2.4 },
    { name: "Nelson Sami", sub: "Performance · 12 clientes", distanceKm: 3.8 },
  ],
  gym: [
    { name: "FitPro Talatona", sub: "Ginásio · 1.240 membros", distanceKm: 0.9 },
    { name: "Corpo Ativo Fitness Club", sub: "Ginásio · 640 membros", distanceKm: 3.1 },
  ],
  nutritionist: [
    { name: "Inês Gonçalves", sub: "Nutrição desportiva · 46 clientes", distanceKm: 1.7 },
    { name: "Diana Sacramento", sub: "Perda de peso · 30 clientes", distanceKm: 4.2 },
  ],
  athlete: [
    { name: "Tiago Kiala", sub: "Consistência · 42 sessões seguidas", distanceKm: 0.5 },
    { name: "Beatriz Chiapa", sub: "Transformação · 8 semanas", distanceKm: 2.9 },
    { name: "Ricardo Bumba", sub: "Ganho de massa · 14 semanas", distanceKm: 3.4 },
  ],
};

const categoryLabel: Record<Category, string> = {
  trainer: "Personal Trainers",
  gym: "Ginásios",
  nutritionist: "Nutricionistas",
  athlete: "Atletas",
};

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function NearbyPage() {
  const { ready } = useRoleGuard("athlete");
  const [status, setStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  function useMyLocation() {
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
      },
      () => setStatus("denied"),
      { timeout: 8000 }
    );
  }

  if (!ready) return null;

  return (
    <>
      <Sidebar role="athlete" active="dashboard" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Perto de Ti</h1>
          <p>Atletas, ginásios, personal trainers e nutricionistas perto da tua localização.</p>
        </div>

        {status !== "granted" && (
          <div className="dash-panel" style={{ padding: "24px", marginBottom: 24, textAlign: "center" }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>
              {status === "denied"
                ? "Não conseguimos aceder à tua localização."
                : "Ativa a tua localização para veres quem está mais perto de ti."}
            </p>
            {status === "denied" && (
              <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 14 }}>
                Permite o acesso à localização nas definições do navegador e tenta novamente.
              </p>
            )}
            <button className="btn btn-primary" onClick={useMyLocation} disabled={status === "loading"}>
              {status === "loading" ? "A localizar…" : "Usar a minha localização"}
            </button>
          </div>
        )}

        {status === "granted" && (
          <>
            <p style={{ fontSize: 11.5, color: "var(--text-faint)", marginBottom: 20 }} className="tabular">
              Localização detetada: {coords?.lat.toFixed(3)}, {coords?.lng.toFixed(3)}
            </p>
            {(Object.keys(nearbyData) as Category[]).map((cat) => (
              <div key={cat} style={{ marginBottom: 28 }}>
                <div className="section-head">
                  <h2>{categoryLabel[cat]}</h2>
                  <span>{nearbyData[cat].length} perto de ti</span>
                </div>
                <div className="dash-panel">
                  <div className="dash-panel-body">
                    {nearbyData[cat]
                      .slice()
                      .sort((a, b) => a.distanceKm - b.distanceKm)
                      .map((p) => (
                        <div className="client-row" key={p.name}>
                          <span className="lb-av">{initials(p.name)}</span>
                          <div className="client-info">
                            <span className="client-name">{p.name}</span>
                            <span className="client-plan">{p.sub}</span>
                          </div>
                          <span className="lb-xp tabular">{p.distanceKm.toFixed(1)} km</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
