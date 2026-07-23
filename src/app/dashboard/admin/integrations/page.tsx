"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";

type FieldDef = { key: string; label: string; type?: "text" | "password"; placeholder?: string };
type IntegrationDef = { id: string; name: string; icon: string; description: string; fields: FieldDef[]; docsHint: string };

const integrations: IntegrationDef[] = [
  {
    id: "stripe", name: "Stripe", icon: "💳", description: "Processamento de pagamentos com cartão e subscrições.",
    fields: [
      { key: "publishableKey", label: "Publishable Key", placeholder: "pk_live_…" },
      { key: "secretKey", label: "Secret Key", type: "password", placeholder: "sk_live_…" },
      { key: "webhookSecret", label: "Webhook Signing Secret", type: "password", placeholder: "whsec_…" },
    ],
    docsHint: "dashboard.stripe.com/apikeys",
  },
  {
    id: "paypal", name: "PayPal", icon: "🅿️", description: "Pagamentos alternativos via PayPal.",
    fields: [
      { key: "clientId", label: "Client ID", placeholder: "AeA1QI…" },
      { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "EGnHDx…" },
    ],
    docsHint: "developer.paypal.com/dashboard/applications",
  },
  {
    id: "openai", name: "OpenAI", icon: "🤖", description: "Motor de IA para recomendações, geração de treinos e planos alimentares.",
    fields: [{ key: "apiKey", label: "API Key", type: "password", placeholder: "sk-…" }],
    docsHint: "platform.openai.com/api-keys",
  },
  {
    id: "sendgrid", name: "SendGrid", icon: "✉️", description: "Envio de emails transacionais e automação.",
    fields: [{ key: "apiKey", label: "API Key", type: "password", placeholder: "SG…." }, { key: "fromEmail", label: "Email de Envio", placeholder: "no-reply@fitpro.ancoia.com" }],
    docsHint: "app.sendgrid.com/settings/api_keys",
  },
  {
    id: "twilio", name: "Twilio", icon: "💬", description: "SMS e WhatsApp para notificações e lembretes.",
    fields: [
      { key: "accountSid", label: "Account SID", placeholder: "AC…" },
      { key: "authToken", label: "Auth Token", type: "password" },
      { key: "fromNumber", label: "Número de Envio", placeholder: "+1…" },
    ],
    docsHint: "console.twilio.com",
  },
  {
    id: "firebase", name: "Firebase", icon: "🔥", description: "Notificações push para web e mobile.",
    fields: [
      { key: "projectId", label: "Project ID" },
      { key: "serverKey", label: "Server Key", type: "password" },
    ],
    docsHint: "console.firebase.google.com",
  },
  {
    id: "s3", name: "AWS S3", icon: "🗄️", description: "Armazenamento de fotos, vídeos e ficheiros de progresso.",
    fields: [
      { key: "bucket", label: "Bucket Name" },
      { key: "region", label: "Região", placeholder: "eu-west-1" },
      { key: "accessKeyId", label: "Access Key ID" },
      { key: "secretAccessKey", label: "Secret Access Key", type: "password" },
    ],
    docsHint: "console.aws.amazon.com/s3",
  },
  {
    id: "maps", name: "Google Maps", icon: "🗺️", description: "Localização e mapas em \"Perto de Ti\" e eventos.",
    fields: [{ key: "apiKey", label: "API Key", type: "password" }],
    docsHint: "console.cloud.google.com/google/maps-apis",
  },
  {
    id: "zoom", name: "Zoom", icon: "🎥", description: "Aulas e sessões online ao vivo.",
    fields: [
      { key: "clientId", label: "Client ID" },
      { key: "clientSecret", label: "Client Secret", type: "password" },
    ],
    docsHint: "marketplace.zoom.us",
  },
];

const STORAGE_KEY = "fitpro_admin_integrations";

type StoredValues = Record<string, Record<string, string>>;
type StoredStatus = Record<string, "connected" | "disconnected">;

function loadValues(): StoredValues {
  try {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEY}_values`) || "{}");
  } catch {
    return {};
  }
}
function saveValues(v: StoredValues) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_values`, JSON.stringify(v));
  } catch {}
}
function loadStatus(): StoredStatus {
  try {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEY}_status`) || "{}");
  } catch {
    return {};
  }
}
function saveStatus(v: StoredStatus) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_status`, JSON.stringify(v));
  } catch {}
}

function mask(v: string) {
  if (!v) return "";
  if (v.length <= 6) return "••••••";
  return `${v.slice(0, 3)}••••••••${v.slice(-3)}`;
}

export default function AdminIntegrationsPage() {
  const { ready } = useRoleGuard("admin");
  const [values, setValues] = useState<StoredValues>({});
  const [status, setStatus] = useState<StoredStatus>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  useEffect(() => {
    setValues(loadValues());
    setStatus(loadStatus());
  }, []);

  if (!ready) return null;

  const connectedCount = Object.values(status).filter((s) => s === "connected").length;

  function startEdit(intg: IntegrationDef) {
    setEditing(intg.id);
    setDraft(values[intg.id] || {});
  }

  function saveIntegration(intg: IntegrationDef) {
    const hasAnyValue = intg.fields.some((f) => draft[f.key]?.trim());
    const nextValues = { ...values, [intg.id]: draft };
    const nextStatus: StoredStatus = { ...status, [intg.id]: hasAnyValue ? "connected" : "disconnected" };
    setValues(nextValues);
    setStatus(nextStatus);
    saveValues(nextValues);
    saveStatus(nextStatus);
    setEditing(null);
    setSavedFlash(intg.id);
    setTimeout(() => setSavedFlash(null), 2000);
  }

  function disconnect(intg: IntegrationDef) {
    const nextValues = { ...values, [intg.id]: {} };
    const nextStatus: StoredStatus = { ...status, [intg.id]: "disconnected" };
    setValues(nextValues);
    setStatus(nextStatus);
    saveValues(nextValues);
    saveStatus(nextStatus);
  }

  return (
    <>
      <Sidebar role="admin" active="integrations" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Integrações & APIs</h1>
          <p>Guarda as credenciais dos serviços externos da FitPro. Ligações reais requerem um backend a consumir estas chaves.</p>
        </div>

        <div className="ai-box" style={{ marginBottom: 20 }}>
          <div className="ai-icon">⚠️</div>
          <p>
            As chaves guardadas aqui ficam <b>apenas neste browser</b> (não existe ainda um servidor backend ligado à FitPro para as usar em pagamentos, emails, SMS ou IA reais).
            Assim que o backend estiver pronto, estas credenciais podem ser migradas para lá em segurança.
          </p>
        </div>

        <div className="stat-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card"><div className="stat-top"><span className="stat-label">Total de Integrações</span></div><div className="stat-value tabular">{integrations.length}</div></div>
          <div className="stat-card"><div className="stat-top"><span className="stat-label">Configuradas</span></div><div className="stat-value tabular">{connectedCount}</div></div>
          <div className="stat-card"><div className="stat-top"><span className="stat-label">Por Configurar</span></div><div className="stat-value tabular">{integrations.length - connectedCount}</div></div>
        </div>

        <div className="rich-grid">
          {integrations.map((intg) => {
            const st = status[intg.id] || "disconnected";
            const vals = values[intg.id] || {};
            return (
              <div className="dash-panel" key={intg.id} style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{intg.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{intg.name}</p>
                    <span className={`role-status ${st === "connected" ? "active" : "inactive"}`}>{st === "connected" ? "Configurado" : "Não configurado"}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12, lineHeight: 1.5 }}>{intg.description}</p>

                {editing === intg.id ? (
                  <>
                    {intg.fields.map((f) => (
                      <label className="field" key={f.key} style={{ marginBottom: 8 }}>
                        <span className="field-label">{f.label}</span>
                        <input
                          className="field-input"
                          type={f.type === "password" ? "password" : "text"}
                          value={draft[f.key] || ""}
                          onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                        />
                      </label>
                    ))}
                    <p style={{ fontSize: 10.5, color: "var(--text-faint)", marginBottom: 10 }}>Obter em: {intg.docsHint}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => saveIntegration(intg)}>Guardar</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    {st === "connected" && (
                      <div style={{ marginBottom: 10 }}>
                        {intg.fields.map((f) => vals[f.key] ? (
                          <p key={f.key} style={{ fontSize: 11.5, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>{f.label}: {mask(vals[f.key])}</p>
                        ) : null)}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => startEdit(intg)}>{st === "connected" ? "Editar Chaves" : "Configurar"}</button>
                      {st === "connected" && <button className="btn btn-ghost btn-sm" onClick={() => disconnect(intg)}>Desligar</button>}
                    </div>
                    {savedFlash === intg.id && <p style={{ fontSize: 11.5, color: "var(--good)", marginTop: 8 }}>✓ Guardado</p>}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
