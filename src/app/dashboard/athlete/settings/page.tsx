"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard, clearSession } from "@/lib/session";
import {
  getPersonalInfo, savePersonalInfo, type PersonalInfo,
  getFitnessConfig, saveFitnessConfig, type FitnessConfig,
  getPreferences, savePreferences, type Preferences,
  getNotifSettings, saveNotifSettings, notifCategoryLabel, type NotifCategory, type NotifSettings,
  getPrivacy, savePrivacy, type PrivacySettings,
  getConnectedAccounts, toggleConnectedAccount,
  getSessions, revokeSession, get2FA, set2FA,
  getSubscriptions, cancelSubscription, invoices, expenseBreakdown, monthlySpending,
  getCards, addCard, removeCard, setDefaultCard,
  roleCatalog, getRoleActivations, requestRoleActivation, pauseRole, removeRole,
} from "@/lib/athleteSettingsData";
import { getProfileOverride, saveProfileOverride, levelOptions } from "@/lib/athleteProfileData";
import { seedWeightLog, seedMeasurements } from "@/lib/progressData";

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

  useEffect(() => {
    setTwoFA(get2FA());
  }, []);

  if (!ready || !session) return null;

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function statusOf(role: (typeof roleCatalog)[number]["key"]) {
    return roleActivations.find((r) => r.role === role)?.status || "inactive";
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
          <Link href="/profile/tiago-kiala" className="btn btn-ghost btn-sm">Pré-visualizar Perfil Público</Link>
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
                <div className="rich-actions" style={{ margin: 0 }}>
                  <label className="media-drop" style={{ flex: 1, textAlign: "center" }}>
                    Alterar foto de perfil
                    <input type="file" accept="image/*" style={{ display: "none" }} />
                  </label>
                  <label className="media-drop" style={{ flex: 1, textAlign: "center" }}>
                    Alterar capa
                    <input type="file" accept="image/*" style={{ display: "none" }} />
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
                  <label className="field"><span className="field-label">Género (opcional)</span>
                    <select className="field-input" value={personal.gender} onChange={(e) => setPersonal((p) => ({ ...p, gender: e.target.value }))}>
                      <option>Prefiro não dizer</option><option>Masculino</option><option>Feminino</option><option>Outro</option>
                    </select>
                  </label>
                  <label className="field"><span className="field-label">Altura (cm)</span><input className="field-input" type="number" value={personal.heightCm} onChange={(e) => setPersonal((p) => ({ ...p, heightCm: Number(e.target.value) }))} /></label>
                  <label className="field"><span className="field-label">Telefone</span><input className="field-input" value={personal.phone} onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))} /></label>
                  <label className="field"><span className="field-label">Email</span><input className="field-input" defaultValue={session.email} readOnly title="Alterar email requer verificação" /></label>
                  <label className="field"><span className="field-label">Morada / Localização</span><input className="field-input" value={personal.address} onChange={(e) => setPersonal((p) => ({ ...p, address: e.target.value }))} /></label>
                </div>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { savePersonalInfo(personal); flash(); }}>Guardar</button>
                  <SavedFlash show={saved} />
                </div>
              </div>
            )}

            {section === "fitness" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Objetivos de Fitness</h2><p>O teu objetivo atual, nível e preferências de treino.</p></div>
                <div className="form-grid">
                  <label className="field">
                    <span className="field-label">Objetivo</span>
                    <select className="field-input" value={fitness.goal} onChange={(e) => setFitness((f) => ({ ...f, goal: e.target.value }))}>
                      <option>Perder peso</option><option>Ganhar massa</option><option>Manter</option><option>Personalizado</option>
                    </select>
                  </label>
                  <label className="field">
                    <span className="field-label">Nível de experiência</span>
                    <select className="field-input" value={fitness.level} onChange={(e) => setFitness((f) => ({ ...f, level: e.target.value }))}>
                      {levelOptions.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    <span className="field-label">Frequência de treino (dias/semana)</span>
                    <input className="field-input" type="number" min={1} max={7} value={fitness.frequency} onChange={(e) => setFitness((f) => ({ ...f, frequency: Number(e.target.value) }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Tipo de treino preferido</span>
                    <select className="field-input" value={fitness.trainingType} onChange={(e) => setFitness((f) => ({ ...f, trainingType: e.target.value }))}>
                      <option>Força</option><option>Cardio</option><option>CrossFit</option><option>Yoga</option><option>Funcional</option>
                    </select>
                  </label>
                </div>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { saveFitnessConfig(fitness); flash(); }}>Guardar</button>
                  <SavedFlash show={saved} />
                </div>
              </div>
            )}

            {section === "medidas" && (
              <>
                <div className="dash-panel" style={{ padding: 22, marginBottom: 20 }}>
                  <div className="settings-section-head"><h2>Medidas</h2><p>Peso, medidas corporais e histórico. Regista novas entradas em Progresso.</p></div>
                  <div className="stat-grid">
                    <div className="stat-card"><div className="stat-top"><span className="stat-label">Peso atual</span></div><div className="stat-value tabular">{seedWeightLog[seedWeightLog.length - 1]?.kg}kg</div></div>
                    <div className="stat-card"><div className="stat-top"><span className="stat-label">Peito</span></div><div className="stat-value tabular">{seedMeasurements[seedMeasurements.length - 1]?.chest}cm</div></div>
                    <div className="stat-card"><div className="stat-top"><span className="stat-label">Cintura</span></div><div className="stat-value tabular">{seedMeasurements[seedMeasurements.length - 1]?.waist}cm</div></div>
                    <div className="stat-card"><div className="stat-top"><span className="stat-label">Braço</span></div><div className="stat-value tabular">{seedMeasurements[seedMeasurements.length - 1]?.arm}cm</div></div>
                  </div>
                  <Link href="/dashboard/athlete/progress/body" className="btn btn-primary btn-sm" style={{ marginTop: 16, display: "inline-block" }}>Adicionar Nova Medição</Link>
                </div>
                <div className="dash-panel">
                  <div className="dash-panel-head"><h2>Peso ao Longo do Tempo</h2></div>
                  <div className="dash-panel-body">
                    {seedWeightLog.map((w) => (
                      <div className="schedule-item" key={w.id}>
                        <span className="schedule-dot" />
                        <div className="schedule-body"><p className="tabular">{w.kg}kg</p><span>{w.date}</span></div>
                      </div>
                    ))}
                  </div>
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

                <div className="section-head"><h2>Subscrições</h2></div>
                <div className="dash-panel" style={{ marginBottom: 24 }}>
                  <div className="dash-panel-body">
                    {subs.map((s) => (
                      <div className="schedule-item" key={s.id}>
                        <span className="schedule-dot" style={{ background: s.status === "active" ? "var(--good)" : "var(--text-faint)" }} />
                        <div className="schedule-body">
                          <p>{s.name}</p>
                          <span>{s.type} · {s.price} / {s.cycle} · Próximo pagamento: {s.nextPayment}</span>
                        </div>
                        {s.status === "active" ? (
                          <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => setSubs(cancelSubscription(s.id))}>Cancelar</button>
                        ) : (
                          <span className="badge-status concluída" style={{ marginLeft: "auto" }}>Cancelada</span>
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
                      <button className="btn btn-ghost btn-sm">Descarregar PDF</button>
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
                <div className="dash-panel" style={{ padding: "6px 20px" }}>
                  {cards.map((c) => (
                    <div className="notif-row" key={c.id}>
                      <div className="notif-row-label">💳 {c.brand} •••• {c.last4} {c.default && <span className="badge on" style={{ marginLeft: 6 }}>Padrão</span>}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {!c.default && <button className="btn btn-ghost btn-sm" onClick={() => setCards(setDefaultCard(c.id))}>Tornar padrão</button>}
                        <button className="icon-action" title="Remover" onClick={() => setCards(removeCard(c.id))}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setCards(addCard("Mastercard", String(1000 + Math.floor(Math.random() * 9000))))}>+ Adicionar Cartão</button>
                </div>
              </>
            )}

            {section === "dados" && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>Dados & Exportação</h2><p>Descarrega os teus dados a qualquer momento.</p></div>
                <div className="rich-actions" style={{ margin: 0, flexWrap: "wrap" }}>
                  <button className="btn btn-ghost">📄 Exportar Dados Pessoais (PDF)</button>
                  <button className="btn btn-ghost">📊 Descarregar Histórico Fitness (CSV)</button>
                  <button className="btn btn-ghost">🧾 Descarregar Faturas (PDF)</button>
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
