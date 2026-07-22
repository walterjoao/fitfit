"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard, clearSession } from "@/lib/session";
import {
  getPersonalInfo, savePersonalInfo, isValidWhatsapp, type PersonalInfo,
  getFitnessConfig, saveFitnessConfig, goalOptionsMulti, levelOptionsExt, trainingTypeOptions, weekDayOptions, type FitnessConfig,
  getPreferences, savePreferences, type Preferences,
  getNotifSettings, saveNotifSettings, notifCategoryLabel, type NotifCategory, type NotifSettings,
  getPrivacy, savePrivacy, type PrivacySettings,
  getConnectedAccounts, toggleConnectedAccount,
  getSessions, revokeSession, get2FA, set2FA,
  getSubscriptions, cancelSubscription, invoices, expenseBreakdown, monthlySpending,
  getCards, addCard, removeCard, setDefaultCard,
  roleCatalog, getRoleActivations, requestRoleActivation, pauseRole, removeRole,
} from "@/lib/athleteSettingsData";
import { getProfileOverride, saveProfileOverride } from "@/lib/athleteProfileData";
import { slugify } from "@/lib/directory";
import { seedMeasurements, seedBodyGallery, type MeasurementEntry, type BodyGalleryEntry, type WeightEntry } from "@/lib/progressData";
import { useLocalList } from "@/lib/progressStore";
import { buildSimplePdf, downloadBlob, downloadCsv } from "@/lib/fileExport";
import { seedWeightLog as seedWeight } from "@/lib/progressData";

const sections = [
  { key: "perfil", label: "Perfil", icon: "👤" },
  { key: "pessoal", label: "Informação Pessoal", icon: "🪪" },
  { key: "fitness", label: "Objetivos de Fitness", icon: "🎯" },
  { key: "medidas", label: "Medidas", icon: "📏" },
  { key: "preferencias", label: "Preferências", icon: "⚙️" },
  { key: "notificacoes", label: "Notificações", icon: "🔔" },
  { key: "privacidade", label: "Privacidade", icon: "🔒" },
  { key: "contas", label: "Contas Ligadas", icon: "🔗" },
  { key: "seguranca", label: "Segurança", icon: "🛡️" },
  { key: "financas", label: "Finanças", icon: "💳" },
  { key: "dados", label: "Dados & Exportação", icon: "📦" },
  { key: "funcoes", label: "Conta & Funções", icon: "🚀" },
  { key: "conta", label: "Gestão da Conta", icon: "⚠️" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch-track" />
    </label>
  );
}

function SavedFlash({ show }: { show: boolean }) {
  if (!show) return null;
  return <span style={{ fontSize: 12, color: "var(--good)", marginLeft: 10 }}>✓ Guardado</span>;
}

export default function AthleteSettingsPage() {
  const { session, ready } = useRoleGuard("athlete");
  const [section, setSection] = useState<SectionKey>("perfil");
  const [saved, setSaved] = useState(false);

  const [override, setOverride] = useState(getProfileOverride());
  const [personal, setPersonal] = useState<PersonalInfo>(getPersonalInfo());
  const [fitness, setFitness] = useState<FitnessConfig>(getFitnessConfig());
  const [prefs, setPrefs] = useState<Preferences>(getPreferences());
  const [notif, setNotif] = useState<NotifSettings>(getNotifSettings());
  const [privacy, setPrivacy] = useState<PrivacySettings>(getPrivacy());
  const [connected, setConnected] = useState(getConnectedAccounts());
  const [sessionsList, setSessionsList] = useState(getSessions());
  const [twoFA, setTwoFA] = useState(false);
  const [subs, setSubs] = useState(getSubscriptions());
  const [cards, setCards] = useState(getCards());
  const [roleActivations, setRoleActivations] = useState(getRoleActivations());
  const [confirmDelete, setConfirmDelete] = useState(false);

  const weightList = useLocalList<WeightEntry>("fitpro_weight_log", seedWeight);
  const measurementList = useLocalList<MeasurementEntry>("fitpro_measurements", seedMeasurements);
  const galleryList = useLocalList<BodyGalleryEntry>("fitpro_body_gallery", seedBodyGallery);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementEntry[]>([]);
  const [gallery, setGallery] = useState<BodyGalleryEntry[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [measForm, setMeasForm] = useState({ chest: "", waist: "", arm: "", leg: "" });
  const [editingMeasurement, setEditingMeasurement] = useState<string | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<{ front?: string; side?: string; back?: string }>({});
  const [whatsappError, setWhatsappError] = useState("");
  const [exportStatus, setExportStatus] = useState<Record<string, "idle" | "preparing" | "ready">>({});
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({ brand: "Visa", last4: "", expiry: "" });
  const [cardError, setCardError] = useState("");
  const [subDetails, setSubDetails] = useState<string | null>(null);

  useEffect(() => {
    setTwoFA(get2FA());
    setWeights(weightList.getAll());
    setMeasurements(measurementList.getAll());
    setGallery(galleryList.getAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready || !session) return null;

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function statusOf(role: (typeof roleCatalog)[number]["key"]) {
    return roleActivations.find((r) => r.role === role)?.status || "inactive";
  }

  function toggleMulti(list: string[], value: string) {
    return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
  }

  function onProfilePhoto(field: "avatarUrl" | "coverUrl", file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const patch = { [field]: reader.result as string };
      setOverride((o) => ({ ...o, ...patch }));
      saveProfileOverride(patch);
    };
    reader.readAsDataURL(file);
  }

  function onPhotoUpload(field: "front" | "side" | "back", file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setGalleryPhotos((p) => ({ ...p, [field]: reader.result as string }));
    reader.readAsDataURL(file);
  }

  function saveGalleryEntry() {
    if (!galleryPhotos.front && !galleryPhotos.side && !galleryPhotos.back) return;
    const entry: BodyGalleryEntry = {
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString().slice(0, 10),
      weightKg: weights[0]?.kg,
      ...galleryPhotos,
    };
    setGallery(galleryList.add(entry));
    setGalleryPhotos({});
  }

  function removeGalleryEntry(id: string) {
    setGallery(galleryList.remove(id));
  }

  function addWeight() {
    const kg = Number(newWeight);
    if (!kg) return;
    setWeights(weightList.add({ id: Math.random().toString(36).slice(2), date: new Date().toISOString().slice(0, 10), kg }));
    setNewWeight("");
  }

  function removeWeight(id: string) {
    setWeights(weightList.remove(id));
  }

  function addOrSaveMeasurement() {
    if (editingMeasurement) {
      setMeasurements(measurementList.update(editingMeasurement, {
        chest: Number(measForm.chest) || 0, waist: Number(measForm.waist) || 0, arm: Number(measForm.arm) || 0, leg: Number(measForm.leg) || 0,
      }));
      setEditingMeasurement(null);
    } else {
      setMeasurements(measurementList.add({
        id: Math.random().toString(36).slice(2), date: new Date().toISOString().slice(0, 10),
        chest: Number(measForm.chest) || 0, waist: Number(measForm.waist) || 0, arm: Number(measForm.arm) || 0, leg: Number(measForm.leg) || 0,
      }));
    }
    setMeasForm({ chest: "", waist: "", arm: "", leg: "" });
  }

  function startEditMeasurement(m: MeasurementEntry) {
    setEditingMeasurement(m.id);
    setMeasForm({ chest: String(m.chest), waist: String(m.waist), arm: String(m.arm), leg: String(m.leg) });
  }

  function removeMeasurement(id: string) {
    setMeasurements(measurementList.remove(id));
  }

  function submitCard() {
    if (!/^\d{4}$/.test(cardForm.last4)) {
      setCardError("Introduz os últimos 4 dígitos do cartão.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.expiry)) {
      setCardError("Formato de validade inválido (MM/AA).");
      return;
    }
    setCardError("");
    setCards(addCard(cardForm.brand, cardForm.last4, cardForm.expiry));
    setCardForm({ brand: "Visa", last4: "", expiry: "" });
    setShowAddCard(false);
  }

  function downloadInvoicePdf(inv: (typeof invoices)[number]) {
    const blob = buildSimplePdf("Fatura FitPro", [
      `Nº Fatura: ${inv.id}`, `Data: ${inv.date}`, `Serviço: ${inv.service}`, `Valor: ${inv.amount}`, `Estado: ${inv.status}`, "", "Obrigado por usares o FitPro.",
    ]);
    downloadBlob(blob, `${inv.id}.pdf`);
  }

  function runExport(key: string, action: () => void) {
    setExportStatus((s) => ({ ...s, [key]: "preparing" }));
    setTimeout(() => {
      action();
      setExportStatus((s) => ({ ...s, [key]: "ready" }));
      setTimeout(() => setExportStatus((s) => ({ ...s, [key]: "idle" })), 2500);
    }, 700);
  }

  function exportProfilePdf() {
    runExport("profile-pdf", () => {
      const blob = buildSimplePdf("Dados Pessoais — FitPro", [
        `Nome: ${session!.name}`, `Email: ${session!.email}`, `Idade: ${personal.age}`, `Altura: ${personal.heightCm}cm`,
        `Telefone: ${personal.phone}`, `WhatsApp: ${personal.whatsappCountryCode} ${personal.whatsappNumber}`, `Morada: ${personal.address}`,
      ]);
      downloadBlob(blob, "fitpro-dados-pessoais.pdf");
    });
  }

  function exportFitnessCsv() {
    runExport("fitness-csv", () => {
      downloadCsv("fitpro-historico-fitness.csv", ["Data", "Peso (kg)"], weights.map((w) => [w.date, w.kg]));
    });
  }

  function exportInvoicesPdf() {
    runExport("invoices-pdf", () => {
      const blob = buildSimplePdf("Faturas — FitPro", invoices.map((inv) => `${inv.date} · ${inv.service} · ${inv.amount} · ${inv.status}`));
      downloadBlob(blob, "fitpro-faturas.pdf");
    });
  }

  const maxSpend = Math.max(...monthlySpending.map((m) => m.kz));
  const totalMonthly = expenseBreakdown.reduce((a, e) => a + e.amount, 0);

  return (
    <>
      <Sidebar role="athlete" active="settings" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1>Definições da Conta</h1>
            <p>O teu centro de controlo — dados, preferências, privacidade, finanças e funções.</p>
          </div>
          <Link href={`/profile/${slugify(session.name)}`} className="btn btn-ghost btn-sm">Pré-visualizar Perfil Público</Link>
        </div>

        <div className="settings-layout">
          <nav className="settings-nav">
            {sections.map((s) => (
              <button key={s.key} className={`settings-nav-item ${section === s.key ? "active" : ""}`} onClick={() => setSection(s.key)}>
                <span>{s.icon}</span><span>{s.label}</span>
              </button>
            ))}
          </nav>

          <div>
            {section === "perfil" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Perfil</h2><p>Foto, nome e informação pública.</p></div>
                <div className="form-grid" style={{ marginBottom: 14 }}>
                  <label className="field" style={{ gridColumn: "1 / -1" }}>
                    <span className="field-label">Nome completo</span>
                    <input className="field-input" defaultValue={session.name} readOnly title="Alterar nome requer verificação — contacta o suporte" />
                  </label>
                  <label className="field">
                    <span className="field-label">Username</span>
                    <input className="field-input" defaultValue={`@${session.name.toLowerCase().replace(/\s+/g, "")}`} />
                  </label>
                  <label className="field">
                    <span className="field-label">Localização</span>
                    <input className="field-input" value={override.location ?? "Viana, Luanda"} onChange={(e) => setOverride((o) => ({ ...o, location: e.target.value }))} />
                  </label>
                  <label className="field" style={{ gridColumn: "1 / -1" }}>
                    <span className="field-label">Bio</span>
                    <input className="field-input" value={override.bio ?? ""} onChange={(e) => setOverride((o) => ({ ...o, bio: e.target.value }))} placeholder="Fala um pouco sobre ti…" />
                  </label>
                </div>
                {(override.avatarUrl || override.coverUrl) && (
                  <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    {override.avatarUrl && <img src={override.avatarUrl} alt="Foto de perfil" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />}
                    {override.coverUrl && <img src={override.coverUrl} alt="Capa" style={{ width: 100, height: 56, borderRadius: 8, objectFit: "cover" }} />}
                  </div>
                )}
                <div className="rich-actions" style={{ margin: 0 }}>
                  <label className="media-drop" style={{ flex: 1, textAlign: "center" }}>
                    {override.avatarUrl ? "✓ Foto de perfil alterada" : "Alterar foto de perfil"}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onProfilePhoto("avatarUrl", e.target.files?.[0] || null)} />
                  </label>
                  <label className="media-drop" style={{ flex: 1, textAlign: "center" }}>
                    {override.coverUrl ? "✓ Capa alterada" : "Alterar capa"}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onProfilePhoto("coverUrl", e.target.files?.[0] || null)} />
                  </label>
                </div>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { saveProfileOverride(override); flash(); }}>Guardar</button>
                  <SavedFlash show={saved} />
                </div>
              </div>
            )}

            {section === "pessoal" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Informação Pessoal</h2><p>Idade, altura, contacto e localização.</p></div>
                <div className="form-grid">
                  <label className="field"><span className="field-label">Idade</span><input className="field-input" type="number" value={personal.age} onChange={(e) => setPersonal((p) => ({ ...p, age: Number(e.target.value) }))} /></label>
                  <label className="field"><span className="field-label">Data de nascimento</span><input className="field-input" type="date" value={personal.birthDate} onChange={(e) => setPersonal((p) => ({ ...p, birthDate: e.target.value }))} /></label>
                  <label className="field"><span className="field-label">Género (opcional)</span>
                    <select className="field-input" value={personal.gender} onChange={(e) => setPersonal((p) => ({ ...p, gender: e.target.value }))}>
                      <option>Prefiro não dizer</option><option>Masculino</option><option>Feminino</option><option>Outro</option>
                    </select>
                  </label>
                  <label className="field"><span className="field-label">Altura (cm)</span><input className="field-input" type="number" value={personal.heightCm} onChange={(e) => setPersonal((p) => ({ ...p, heightCm: Number(e.target.value) }))} /></label>
                  <label className="field"><span className="field-label">Telefone</span><input className="field-input" value={personal.phone} onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))} /></label>
                  <label className="field"><span className="field-label">Email</span><input className="field-input" defaultValue={session.email} readOnly title="Alterar email requer verificação" /></label>
                  <label className="field" style={{ gridColumn: "1 / -1" }}><span className="field-label">Morada / Localização</span><input className="field-input" value={personal.address} onChange={(e) => setPersonal((p) => ({ ...p, address: e.target.value }))} /></label>
                </div>

                <p className="field-label" style={{ margin: "18px 0 10px" }}>WhatsApp</p>
                <div className="form-grid" style={{ marginBottom: 10 }}>
                  <label className="field" style={{ maxWidth: 110 }}>
                    <span className="field-label">Indicativo</span>
                    <input className="field-input" value={personal.whatsappCountryCode} onChange={(e) => setPersonal((p) => ({ ...p, whatsappCountryCode: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Número</span>
                    <input
                      className="field-input"
                      value={personal.whatsappNumber}
                      onChange={(e) => { setPersonal((p) => ({ ...p, whatsappNumber: e.target.value })); setWhatsappError(""); }}
                      placeholder="923000000"
                    />
                  </label>
                </div>
                {whatsappError && <p style={{ fontSize: 12, color: "var(--bad)", marginBottom: 10 }}>{whatsappError}</p>}
                <div className="notif-row" style={{ borderBottom: "none", paddingTop: 4 }}>
                  <div>
                    <div className="notif-row-label">Mostrar WhatsApp publicamente</div>
                    <div className="notif-row-sub">Visível no teu perfil público para contacto direto</div>
                  </div>
                  <Toggle checked={personal.whatsappVisible} onChange={(v) => setPersonal((p) => ({ ...p, whatsappVisible: v }))} />
                </div>

                <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (!isValidWhatsapp(personal.whatsappNumber)) {
                        setWhatsappError("Número de WhatsApp inválido — usa apenas dígitos (7 a 12).");
                        return;
                      }
                      savePersonalInfo(personal);
                      flash();
                    }}
                  >
                    Guardar
                  </button>
                  <SavedFlash show={saved} />
                </div>
              </div>
            )}

            {section === "fitness" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Objetivos de Fitness</h2><p>O teu objetivo atual, nível e preferências de treino.</p></div>

                <p className="field-label" style={{ marginBottom: 10 }}>Objetivo (seleção múltipla)</p>
                <div className="pill-row" style={{ marginBottom: 20 }}>
                  {goalOptionsMulti.map((g) => (
                    <button key={g} className={`pill ${fitness.goals.includes(g) ? "active" : ""}`} onClick={() => setFitness((f) => ({ ...f, goals: toggleMulti(f.goals, g) }))}>
                      {fitness.goals.includes(g) ? "✅" : ""} {g}
                    </button>
                  ))}
                </div>

                <p className="field-label" style={{ marginBottom: 10 }}>Nível de experiência</p>
                <div className="pill-row" style={{ marginBottom: 20 }}>
                  {levelOptionsExt.map((l) => (
                    <button key={l} className={`pill ${fitness.level === l ? "active" : ""}`} onClick={() => setFitness((f) => ({ ...f, level: l }))}>{l}</button>
                  ))}
                </div>

                <p className="field-label" style={{ marginBottom: 10 }}>Frequência de treino</p>
                <input className="field-input" type="number" min={1} max={7} style={{ maxWidth: 120, marginBottom: 14 }} value={fitness.frequency} onChange={(e) => setFitness((f) => ({ ...f, frequency: Number(e.target.value) }))} />

                <p className="field-label" style={{ marginBottom: 10 }}>Dias preferidos de treino</p>
                <div className="day-picker" style={{ marginBottom: 20 }}>
                  {weekDayOptions.map((d) => (
                    <button key={d} className={`day-toggle ${fitness.preferredDays.includes(d) ? "on" : ""}`} onClick={() => setFitness((f) => ({ ...f, preferredDays: toggleMulti(f.preferredDays, d) }))}>
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>

                <p className="field-label" style={{ marginBottom: 10 }}>Tipo de treino preferido (seleção múltipla)</p>
                <div className="pill-row">
                  {trainingTypeOptions.map((t) => (
                    <button key={t} className={`pill ${fitness.trainingTypes.includes(t) ? "active" : ""}`} onClick={() => setFitness((f) => ({ ...f, trainingTypes: toggleMulti(f.trainingTypes, t) }))}>
                      {fitness.trainingTypes.includes(t) ? "✅" : ""} {t}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { saveFitnessConfig(fitness); flash(); }}>Guardar</button>
                  <SavedFlash show={saved} />
                </div>
              </div>
            )}

            {section === "medidas" && (
              <>
                <div className="settings-section-head"><h2>Medidas</h2><p>Peso, medidas corporais, fotos de transformação e histórico completo.</p></div>

                <div className="dash-row" style={{ marginBottom: 20 }}>
                  <div className="dash-panel" style={{ padding: 20 }}>
                    <div className="settings-section-head" style={{ marginBottom: 12 }}><h2 style={{ fontSize: 14 }}>Galeria de Transformação</h2></div>
                    <div className="form-grid" style={{ marginBottom: 12 }}>
                      {(["front", "side", "back"] as const).map((field) => (
                        <label className="media-drop" key={field} style={{ textAlign: "center", fontSize: 11.5 }}>
                          {galleryPhotos[field] ? "✓ " : ""}{field === "front" ? "Foto Frente" : field === "side" ? "Foto Lado" : "Foto Costas"}
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onPhotoUpload(field, e.target.files?.[0] || null)} />
                        </label>
                      ))}
                    </div>
                    {(galleryPhotos.front || galleryPhotos.side || galleryPhotos.back) && (
                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        {galleryPhotos.front && <img src={galleryPhotos.front} alt="frente" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />}
                        {galleryPhotos.side && <img src={galleryPhotos.side} alt="lado" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />}
                        {galleryPhotos.back && <img src={galleryPhotos.back} alt="costas" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />}
                      </div>
                    )}
                    <button className="btn btn-primary btn-sm" style={{ marginBottom: 18 }} disabled={!galleryPhotos.front && !galleryPhotos.side && !galleryPhotos.back} onClick={saveGalleryEntry}>Guardar Entrada</button>

                    {gallery.length === 0 && <p style={{ fontSize: 12, color: "var(--text-faint)" }}>Ainda sem fotos de transformação.</p>}
                    {gallery.map((g) => (
                      <div key={g.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
                        {g.front && <img src={g.front} alt="frente" style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8 }} />}
                        {g.side && <img src={g.side} alt="lado" style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8 }} />}
                        {g.back && <img src={g.back} alt="costas" style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8 }} />}
                        <div style={{ flex: 1, fontSize: 11.5, color: "var(--text-faint)" }}>{new Date(g.date).toLocaleDateString("pt-PT")}{g.weightKg ? ` · ${g.weightKg}kg` : ""}</div>
                        <button className="icon-action" title="Remover" onClick={() => removeGalleryEntry(g.id)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="dash-panel" style={{ padding: 20 }}>
                    <div className="settings-section-head" style={{ marginBottom: 12 }}><h2 style={{ fontSize: 14 }}>Peso ao Longo do Tempo</h2></div>
                    <div className="chart-bars" style={{ marginBottom: 4 }}>
                      {weights.slice(0, 8).reverse().map((w) => (
                        <div key={w.id} className="chart-bar" style={{ height: `${Math.max((w.kg / Math.max(...weights.map((x) => x.kg), 1)) * 100, 8)}%` }} />
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                      <input className="field-input" type="number" placeholder="Novo peso (kg)" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} />
                      <button className="btn btn-primary btn-sm" onClick={addWeight} disabled={!newWeight}>Adicionar</button>
                    </div>
                    {weights.map((w) => (
                      <div className="schedule-item" key={w.id}>
                        <span className="schedule-dot" />
                        <div className="schedule-body"><p className="tabular">{w.kg}kg</p><span>{new Date(w.date).toLocaleDateString("pt-PT")}</span></div>
                        <button className="icon-action" title="Remover" onClick={() => removeWeight(w.id)} style={{ marginLeft: "auto" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-panel" style={{ padding: 20 }}>
                  <div className="settings-section-head" style={{ marginBottom: 12 }}><h2 style={{ fontSize: 14 }}>{editingMeasurement ? "Editar Medição" : "Adicionar Medição Corporal"}</h2></div>
                  <div className="form-grid" style={{ marginBottom: 14 }}>
                    <label className="field"><span className="field-label">Peito (cm)</span><input className="field-input" type="number" value={measForm.chest} onChange={(e) => setMeasForm((f) => ({ ...f, chest: e.target.value }))} /></label>
                    <label className="field"><span className="field-label">Cintura (cm)</span><input className="field-input" type="number" value={measForm.waist} onChange={(e) => setMeasForm((f) => ({ ...f, waist: e.target.value }))} /></label>
                    <label className="field"><span className="field-label">Braço (cm)</span><input className="field-input" type="number" value={measForm.arm} onChange={(e) => setMeasForm((f) => ({ ...f, arm: e.target.value }))} /></label>
                    <label className="field"><span className="field-label">Perna (cm)</span><input className="field-input" type="number" value={measForm.leg} onChange={(e) => setMeasForm((f) => ({ ...f, leg: e.target.value }))} /></label>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                    <button className="btn btn-primary btn-sm" onClick={addOrSaveMeasurement}>{editingMeasurement ? "Guardar Edição" : "Adicionar Medição"}</button>
                    {editingMeasurement && <button className="btn btn-ghost btn-sm" onClick={() => { setEditingMeasurement(null); setMeasForm({ chest: "", waist: "", arm: "", leg: "" }); }}>Cancelar</button>}
                  </div>
                  {measurements.map((m) => (
                    <div className="tx-row" key={m.id}>
                      <div className="tx-info">
                        <div className="tx-label">{new Date(m.date).toLocaleDateString("pt-PT")}</div>
                        <div className="tx-sub">Peito {m.chest}cm · Cintura {m.waist}cm · Braço {m.arm}cm · Perna {m.leg}cm</div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => startEditMeasurement(m)}>Editar</button>
                        <button className="icon-action" title="Remover" onClick={() => removeMeasurement(m.id)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {section === "preferencias" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Preferências</h2><p>Idioma, unidades, tema e página inicial.</p></div>
                <div className="form-grid">
                  <label className="field"><span className="field-label">Idioma</span>
                    <select className="field-input" value={prefs.language} onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}>
                      <option>Português</option><option>English</option>
                    </select>
                  </label>
                  <label className="field"><span className="field-label">Unidades</span>
                    <select className="field-input" value={prefs.units} onChange={(e) => setPrefs((p) => ({ ...p, units: e.target.value as Preferences["units"] }))}>
                      <option>Métrico</option><option>Imperial</option>
                    </select>
                  </label>
                  <label className="field"><span className="field-label">Tema</span>
                    <select className="field-input" value={prefs.theme} onChange={(e) => setPrefs((p) => ({ ...p, theme: e.target.value as Preferences["theme"] }))}>
                      <option>Claro</option><option>Escuro</option><option>Sistema</option>
                    </select>
                  </label>
                  <label className="field"><span className="field-label">Página inicial</span>
                    <select className="field-input" value={prefs.startPage} onChange={(e) => setPrefs((p) => ({ ...p, startPage: e.target.value }))}>
                      <option>Dashboard</option><option>Os Meus Treinos</option><option>A Minha Nutrição</option><option>Marketplace</option>
                    </select>
                  </label>
                </div>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { savePreferences(prefs); flash(); }}>Guardar</button>
                  <SavedFlash show={saved} />
                </div>
              </div>
            )}

            {section === "notificacoes" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Notificações</h2><p>Escolhe o que recebes e por onde.</p></div>
                <div className="notif-row" style={{ borderBottom: "2px solid var(--line-strong)" }}>
                  <div className="notif-row-label" style={{ color: "var(--text-faint)", fontSize: 11 }}>CATEGORIA</div>
                  <div className="notif-channels" style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase" }}>
                    <span style={{ width: 38, textAlign: "center" }}>Push</span>
                    <span style={{ width: 38, textAlign: "center" }}>Email</span>
                    <span style={{ width: 38, textAlign: "center" }}>Na App</span>
                  </div>
                </div>
                {(Object.keys(notif) as NotifCategory[]).map((cat) => (
                  <div className="notif-row" key={cat}>
                    <div>
                      <div className="notif-row-label">{notifCategoryLabel[cat]}</div>
                      <div className="notif-row-sub">Push · Email · Na app</div>
                    </div>
                    <div className="notif-channels">
                      <Toggle checked={notif[cat].push} onChange={(v) => setNotif((n) => ({ ...n, [cat]: { ...n[cat], push: v } }))} />
                      <Toggle checked={notif[cat].email} onChange={(v) => setNotif((n) => ({ ...n, [cat]: { ...n[cat], email: v } }))} />
                      <Toggle checked={notif[cat].inApp} onChange={(v) => setNotif((n) => ({ ...n, [cat]: { ...n[cat], inApp: v } }))} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { saveNotifSettings(notif); flash(); }}>Guardar</button>
                  <SavedFlash show={saved} />
                </div>
              </div>
            )}

            {section === "privacidade" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Privacidade</h2><p>Controla quem vê o teu perfil e a tua atividade.</p></div>
                <div className="notif-row">
                  <div className="notif-row-label">Visibilidade do perfil</div>
                  <select className="field-input" style={{ width: "auto" }} value={privacy.visibility} onChange={(e) => setPrivacy((p) => ({ ...p, visibility: e.target.value as PrivacySettings["visibility"] }))}>
                    <option>Público</option><option>Privado</option>
                  </select>
                </div>
                <div className="notif-row"><div className="notif-row-label">Mostrar Progresso</div><Toggle checked={privacy.showProgress} onChange={(v) => setPrivacy((p) => ({ ...p, showProgress: v }))} /></div>
                <div className="notif-row"><div className="notif-row-label">Mostrar Medidas</div><Toggle checked={privacy.showMeasurements} onChange={(v) => setPrivacy((p) => ({ ...p, showMeasurements: v }))} /></div>
                <div className="notif-row"><div className="notif-row-label">Mostrar Atividade</div><Toggle checked={privacy.showActivity} onChange={(v) => setPrivacy((p) => ({ ...p, showActivity: v }))} /></div>
                <div className="notif-row">
                  <div className="notif-row-label">Quem me pode mensagem</div>
                  <select className="field-input" style={{ width: "auto" }} value={privacy.whoCanMessage} onChange={(e) => setPrivacy((p) => ({ ...p, whoCanMessage: e.target.value as PrivacySettings["whoCanMessage"] }))}>
                    <option>Todos</option><option>Só quem sigo</option><option>Ninguém</option>
                  </select>
                </div>
                <div className="notif-row">
                  <div className="notif-row-label">Quem me pode seguir</div>
                  <select className="field-input" style={{ width: "auto" }} value={privacy.whoCanFollow} onChange={(e) => setPrivacy((p) => ({ ...p, whoCanFollow: e.target.value as PrivacySettings["whoCanFollow"] }))}>
                    <option>Todos</option><option>Aprovação manual</option>
                  </select>
                </div>
                <div className="notif-row"><div className="notif-row-label">Partilhar localização (Perto de Ti)</div><Toggle checked={privacy.shareLocation} onChange={(v) => setPrivacy((p) => ({ ...p, shareLocation: v }))} /></div>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { savePrivacy(privacy); flash(); }}>Guardar</button>
                  <SavedFlash show={saved} />
                </div>
              </div>
            )}

            {section === "contas" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Contas Ligadas</h2><p>Integrações com serviços externos.</p></div>
                {connected.map((a) => (
                  <div className="notif-row" key={a.id}>
                    <div className="notif-row-label">{a.icon} {a.name}</div>
                    <button className={`btn ${a.connected ? "btn-ghost" : "btn-primary"} btn-sm`} onClick={() => setConnected(toggleConnectedAccount(a.id))} disabled={a.id === "wearable"}>
                      {a.connected ? "Desligar" : "Ligar"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {section === "seguranca" && (
              <>
                <div className="dash-panel" style={{ padding: 22, marginBottom: 20 }}>
                  <div className="settings-section-head"><h2>Segurança</h2><p>Palavra-passe, autenticação e sessões ativas.</p></div>
                  <div className="form-grid" style={{ marginBottom: 14 }}>
                    <label className="field"><span className="field-label">Palavra-passe atual</span><input className="field-input" type="password" placeholder="••••••••" /></label>
                    <label className="field"><span className="field-label">Nova palavra-passe</span><input className="field-input" type="password" placeholder="••••••••" /></label>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={flash}>Alterar Palavra-passe</button>
                  <SavedFlash show={saved} />
                  <div className="notif-row" style={{ marginTop: 20 }}>
                    <div>
                      <div className="notif-row-label">Autenticação de dois fatores (2FA)</div>
                      <div className="notif-row-sub">Camada extra de segurança ao iniciar sessão</div>
                    </div>
                    <Toggle checked={twoFA} onChange={(v) => { setTwoFA(v); set2FA(v); }} />
                  </div>
                </div>
                <div className="dash-panel">
                  <div className="dash-panel-head"><h2>Sessões Ativas</h2><span>{sessionsList.length}</span></div>
                  <div className="dash-panel-body" style={{ padding: "6px 20px" }}>
                    {sessionsList.map((s) => (
                      <div className="session-row" key={s.id}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{s.device} {s.current && <span className="badge on" style={{ marginLeft: 6 }}>Atual</span>}</p>
                          <p style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{s.location} · {s.lastActive}</p>
                        </div>
                        {!s.current && <button className="btn btn-ghost btn-sm" onClick={() => setSessionsList(revokeSession(s.id))}>Terminar Sessão</button>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {section === "financas" && (
              <>
                <div className="finance-total">
                  <div className="finance-total-label">Gasto total este mês</div>
                  <div className="finance-total-value tabular">{totalMonthly.toLocaleString("pt-PT")} Kz</div>
                </div>

                <div className="section-head"><h2>Subscrições</h2><span>diretas na FitPro e via profissionais</span></div>
                <div className="dash-panel" style={{ marginBottom: 24 }}>
                  <div className="dash-panel-body">
                    {subs.map((s) => (
                      <div key={s.id}>
                        <div className="schedule-item">
                          <span className="schedule-dot" style={{ background: s.status === "active" ? "var(--good)" : "var(--text-faint)" }} />
                          <div className="schedule-body">
                            <p>{s.name}</p>
                            <span>{s.type} · {s.price} / {s.cycle} · Próximo pagamento: {s.nextPayment}</span>
                          </div>
                          <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setSubDetails(subDetails === s.id ? null : s.id)}>{subDetails === s.id ? "Ocultar" : "Ver Detalhes"}</button>
                            {s.status === "active" ? (
                              <button className="btn btn-ghost btn-sm" onClick={() => setSubs(cancelSubscription(s.id))}>Cancelar</button>
                            ) : (
                              <span className="badge-status concluída">Cancelada</span>
                            )}
                          </div>
                        </div>
                        {subDetails === s.id && (
                          <div style={{ padding: "0 20px 16px 44px", fontSize: 12, color: "var(--text-dim)" }}>
                            Fornecedor: {s.name} · Tipo: {s.type} · Ciclo de faturação: {s.cycle} · Estado: {s.status === "active" ? "Ativa" : "Cancelada"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section-head"><h2>Faturas</h2></div>
                <div className="dash-panel" style={{ marginBottom: 24, padding: "6px 20px" }}>
                  {invoices.map((inv) => (
                    <div className="invoice-row" key={inv.id}>
                      <span>{inv.date}</span>
                      <span>{inv.service}</span>
                      <span className="tabular">{inv.amount}</span>
                      <span className={`stock ${inv.status === "Pago" ? "in" : "low"}`}>{inv.status}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => downloadInvoicePdf(inv)}>Descarregar PDF</button>
                    </div>
                  ))}
                </div>

                <div className="dash-row" style={{ marginBottom: 24 }}>
                  <div className="dash-panel">
                    <div className="dash-panel-head"><h2>Despesas por Categoria</h2></div>
                    <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
                      {expenseBreakdown.map((e) => (
                        <div key={e.category} className="activity-bar-row">
                          <div className="activity-bar-label"><span>{e.icon} {e.category}</span><span className="tabular">{e.amount.toLocaleString("pt-PT")} Kz</span></div>
                          <div className="activity-bar-track"><div className="activity-bar-fill" style={{ width: `${(e.amount / totalMonthly) * 100}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="dash-panel">
                    <div className="dash-panel-head"><h2>Gasto Mensal</h2><span>últimos 6 meses</span></div>
                    <div className="chart-bars">
                      {monthlySpending.map((m) => <div key={m.month} className="chart-bar" style={{ height: `${(m.kz / maxSpend) * 100}%` }} />)}
                    </div>
                    <div className="chart-bar-label">{monthlySpending.map((m) => <span key={m.month}>{m.month}</span>)}</div>
                  </div>
                </div>

                <div className="section-head"><h2>Métodos de Pagamento</h2></div>
                <div className="dash-panel" style={{ padding: "6px 20px 20px" }}>
                  {cards.map((c) => (
                    <div className="notif-row" key={c.id}>
                      <div className="notif-row-label">💳 {c.brand} •••• {c.last4} · válido até {c.expiry} {c.default && <span className="badge on" style={{ marginLeft: 6 }}>Padrão</span>}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {!c.default && <button className="btn btn-ghost btn-sm" onClick={() => setCards(setDefaultCard(c.id))}>Tornar padrão</button>}
                        <button className="icon-action" title="Remover" onClick={() => setCards(removeCard(c.id))}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  {showAddCard ? (
                    <div style={{ marginTop: 14, padding: 14, background: "var(--surface-2)", borderRadius: "var(--radius-md)" }}>
                      <div className="form-grid" style={{ marginBottom: 10 }}>
                        <label className="field">
                          <span className="field-label">Tipo de cartão</span>
                          <select className="field-input" value={cardForm.brand} onChange={(e) => setCardForm((f) => ({ ...f, brand: e.target.value }))}>
                            <option>Visa</option><option>Mastercard</option><option>American Express</option>
                          </select>
                        </label>
                        <label className="field">
                          <span className="field-label">Últimos 4 dígitos</span>
                          <input className="field-input" maxLength={4} value={cardForm.last4} onChange={(e) => setCardForm((f) => ({ ...f, last4: e.target.value.replace(/\D/g, "") }))} placeholder="4242" />
                        </label>
                        <label className="field">
                          <span className="field-label">Validade (MM/AA)</span>
                          <input className="field-input" value={cardForm.expiry} onChange={(e) => setCardForm((f) => ({ ...f, expiry: e.target.value }))} placeholder="09/28" />
                        </label>
                      </div>
                      {cardError && <p style={{ fontSize: 12, color: "var(--bad)", marginBottom: 10 }}>{cardError}</p>}
                      <p style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 10 }}>Por segurança, nunca guardamos o número completo do cartão.</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-primary btn-sm" onClick={submitCard}>Guardar Cartão</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setShowAddCard(false); setCardError(""); }}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setShowAddCard(true)}>+ Adicionar Cartão</button>
                  )}
                </div>
              </>
            )}

            {section === "dados" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Dados & Exportação</h2><p>Descarrega os teus dados a qualquer momento.</p></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420 }}>
                  {([
                    { key: "profile-pdf", label: "📄 Exportar Dados Pessoais (PDF)", action: exportProfilePdf },
                    { key: "fitness-csv", label: "📊 Descarregar Histórico Fitness (CSV)", action: exportFitnessCsv },
                    { key: "invoices-pdf", label: "🧾 Descarregar Faturas (PDF)", action: exportInvoicesPdf },
                  ] as const).map((item) => {
                    const status = exportStatus[item.key] || "idle";
                    return (
                      <div key={item.key} className="notif-row">
                        <span className="notif-row-label">{item.label}</span>
                        <button className="btn btn-ghost btn-sm" disabled={status === "preparing"} onClick={item.action}>
                          {status === "preparing" ? "A preparar…" : status === "ready" ? "✓ Pronto — descarregado" : "Descarregar"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {section === "funcoes" && (
              <>
                <div className="settings-section-head"><h2>Conta & Funções</h2><p>Gere o que queres ser dentro do FitPro. Uma única conta pode ter várias funções.</p></div>
                <div className="settings-grid">
                  {roleCatalog.map((r) => {
                    const status = statusOf(r.key);
                    return (
                      <div className="role-card" key={r.key}>
                        <div className="role-card-head">
                          <div className="role-card-icon">{r.icon}</div>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ marginBottom: 0 }}>{r.label}</h3>
                            <span className={`role-status ${status}`}>{status === "active" ? "Ativo" : status === "review" ? "Em análise" : "Inativo"}</span>
                          </div>
                        </div>
                        <p style={{ fontSize: 12, color: "var(--text-faint)", lineHeight: 1.5 }}>{r.description}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {r.benefits.map((b) => <span key={b} style={{ fontSize: 11.5, color: "var(--text-dim)" }}>✓ {b}</span>)}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                          {status === "inactive" && (
                            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setRoleActivations(requestRoleActivation(r.key))}>Ativar</button>
                          )}
                          {status === "review" && (
                            <>
                              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} disabled>Pedido em análise…</button>
                              <button className="btn btn-ghost btn-sm" onClick={() => setRoleActivations(removeRole(r.key))}>Cancelar</button>
                            </>
                          )}
                          {status === "active" && (
                            <>
                              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setRoleActivations(pauseRole(r.key))}>Pausar</button>
                              <button className="btn btn-ghost btn-sm" onClick={() => setRoleActivations(removeRole(r.key))}>Remover</button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="ai-box" style={{ marginTop: 20 }}>
                  <div className="ai-icon">🚀</div>
                  <p>Ao ativar uma função profissional, vais precisar de definir preços, ligar um método de pagamento e aceitar os termos de negócio do FitPro. O pedido fica &ldquo;Em análise&rdquo; até ser aprovado pela nossa equipa.</p>
                </div>
              </>
            )}

            {section === "conta" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Gestão da Conta</h2><p>Ações irreversíveis — usa com cuidado.</p></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
                  <button className="btn btn-ghost" onClick={() => { clearSession(); window.location.href = "/"; }}>Terminar Sessão</button>
                  <button className="btn btn-ghost">Desativar Conta Temporariamente</button>
                  {!confirmDelete ? (
                    <button className="btn btn-ghost" style={{ color: "var(--bad)", borderColor: "var(--bad)" }} onClick={() => setConfirmDelete(true)}>Eliminar Conta</button>
                  ) : (
                    <div className="dash-panel" style={{ padding: 16, borderColor: "var(--bad)" }}>
                      <p style={{ fontSize: 12.5, marginBottom: 10 }}>Tens a certeza? Esta ação é permanente e todos os teus dados serão apagados.</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancelar</button>
                        <button className="btn btn-primary btn-sm" style={{ background: "var(--bad)", borderColor: "var(--bad)" }}>Confirmar Eliminação</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
