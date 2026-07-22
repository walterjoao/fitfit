"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { athleteLog as seedLog } from "@/lib/nutritionData";

export default function LogMealPage() {
  const { ready } = useRoleGuard("athlete");
  const [log, setLog] = useState(seedLog);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [waterMl, setWaterMl] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!ready) return null;

  function onPhoto(file: File | null) {
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  }

  function save() {
    if (!name) return;
    setLog((l) => [
      { id: Math.random().toString(36).slice(2), name, time: "Agora", calories: Number(calories) || 0, protein: Number(protein) || 0, carbs: Number(carbs) || 0, fat: Number(fat) || 0 },
      ...l,
    ]);
    setName(""); setCalories(""); setProtein(""); setCarbs(""); setFat(""); setPhoto(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Registar Refeição</h1>
          <p>Adiciona refeições próprias, água e snacks fora do plano.</p>
        </div>

        <NutritionSubNav />

        <div className="dash-row">
          <div className="dash-panel" style={{ padding: 24 }}>
            <p className="field-label" style={{ marginBottom: 10 }}>Adicionar refeição</p>

            {photo ? (
              <div className="media-preview" style={{ marginBottom: 14 }}><img src={photo} alt="Refeição" /></div>
            ) : (
              <label className="media-drop" style={{ display: "block", marginBottom: 14 }}>
                Carregar foto da refeição
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onPhoto(e.target.files?.[0] || null)} />
              </label>
            )}

            <div className="form-grid" style={{ marginBottom: 14 }}>
              <label className="field" style={{ gridColumn: "1 / -1" }}>
                <span className="field-label">Nome</span>
                <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Iogurte com granola" />
              </label>
              <label className="field">
                <span className="field-label">Calorias (kcal)</span>
                <input className="field-input" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">Proteína (g)</span>
                <input className="field-input" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">Carboidratos (g)</span>
                <input className="field-input" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">Gordura (g)</span>
                <input className="field-input" type="number" value={fat} onChange={(e) => setFat(e.target.value)} />
              </label>
            </div>

            <label className="field" style={{ marginBottom: 14, maxWidth: 220 }}>
              <span className="field-label">Água ingerida (ml)</span>
              <input className="field-input" type="number" value={waterMl} onChange={(e) => setWaterMl(e.target.value)} placeholder="Ex: 500" />
            </label>

            {saved && <p style={{ color: "var(--good)", fontSize: 12.5, marginBottom: 10 }}>✓ Refeição registada.</p>}
            <button className="auth-submit" style={{ maxWidth: 200 }} onClick={save} disabled={!name}>Guardar Registo</button>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h2>O Meu Registo</h2><span>{log.length}</span></div>
            <div className="dash-panel-body">
              {log.map((l) => (
                <div className="schedule-item" key={l.id}>
                  <span className="schedule-dot" />
                  <div className="schedule-body">
                    <p>{l.name}</p>
                    <span>{l.time} · {l.calories} kcal · P{l.protein}g C{l.carbs}g G{l.fat}g</span>
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
