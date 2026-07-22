"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProgressSubNav from "@/components/ProgressSubNav";
import { useRoleGuard } from "@/lib/session";
import { useLocalList } from "@/lib/progressStore";
import { seedPhotos, type TransformationPhoto } from "@/lib/progressData";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProgressPhotosPage() {
  const { ready } = useRoleGuard("athlete");
  const list = useLocalList<TransformationPhoto>("fitpro_photos", seedPhotos);
  const [photos, setPhotos] = useState<TransformationPhoto[]>([]);

  useEffect(() => {
    setPhotos(list.getAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  async function addPhoto(label: "before" | "after", file: File | null) {
    if (!file) return;
    const url = await fileToDataUrl(file);
    setPhotos(list.add({ id: Math.random().toString(36).slice(2), date: new Date().toISOString().slice(0, 10), url, label }));
  }

  function remove(id: string) {
    setPhotos(list.remove(id));
  }

  const before = photos.filter((p) => p.label === "before").sort((a, b) => b.date.localeCompare(a.date))[0];
  const after = photos.filter((p) => p.label === "after").sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <>
      <Sidebar role="athlete" active="progress" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Transformação Visual</h1>
          <p>Compara o teu antes e depois — a melhor forma de sentires o progresso real.</p>
        </div>

        <ProgressSubNav />

        <div className="section-head"><h2>Comparação Antes / Depois</h2></div>
        <div className="photo-compare">
          <div className="photo-compare-slot">
            {before ? <img src={before.url} alt="Antes" /> : <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem foto &ldquo;Antes&rdquo;</span>}
            <span className="photo-compare-label">Antes {before && `· ${new Date(before.date).toLocaleDateString("pt-PT")}`}</span>
          </div>
          <div className="photo-compare-slot">
            {after ? <img src={after.url} alt="Depois" /> : <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem foto &ldquo;Depois&rdquo;</span>}
            <span className="photo-compare-label">Depois {after && `· ${new Date(after.date).toLocaleDateString("pt-PT")}`}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 30, flexWrap: "wrap" }}>
          <label className="media-drop" style={{ flex: 1, minWidth: 200 }}>
            + Adicionar foto &ldquo;Antes&rdquo;
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => addPhoto("before", e.target.files?.[0] || null)} />
          </label>
          <label className="media-drop" style={{ flex: 1, minWidth: 200 }}>
            + Adicionar foto &ldquo;Depois&rdquo;
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => addPhoto("after", e.target.files?.[0] || null)} />
          </label>
        </div>

        <div className="section-head"><h2>Todas as Fotos</h2><span>{photos.length}</span></div>
        <div className="photo-grid">
          {photos.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Ainda sem fotos. Adiciona a primeira acima.</p>}
          {photos.map((p) => (
            <div className="photo-card" key={p.id}>
              <img src={p.url} alt={p.label} />
              <div className="photo-card-body">
                <span style={{ fontSize: 11.5, fontWeight: 700 }}>{p.label === "before" ? "Antes" : "Depois"} · {new Date(p.date).toLocaleDateString("pt-PT")}</span>
                <button className="icon-action" title="Remover" onClick={() => remove(p.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
