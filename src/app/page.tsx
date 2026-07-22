"use client";

import { useState, type ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setSession } from "@/lib/session";

type Tab = "login" | "signup";
type Step = "role" | "form";
type Role = "athlete" | "nutritionist" | "trainer" | "gym" | "shop";

const roles: { key: Role; title: string; description: string; icon: ReactElement }[] = [
  {
    key: "athlete",
    title: "Atleta",
    description: "Acompanha os teus treinos, nutrição, progresso e atinge os teus objetivos.",
    icon: (
      <>
        <circle cx="17" cy="5" r="2" />
        <path d="M15.5 8.5 12 10l-2 3.5L7 15l-2 5" />
        <path d="M9.5 11.5 12 13l3 5h3" />
        <path d="M11 8 8 10l-3-1" />
      </>
    ),
  },
  {
    key: "nutritionist",
    title: "Nutricionista",
    description: "Gere clientes, cria planos alimentares e acompanha o progresso nutricional.",
    icon: (
      <>
        <path d="M12 3c-3 2-5 5-5 9a5 5 0 0 0 10 0c0-4-2-7-5-9Z" />
        <path d="M12 3c.8-1 2-1.4 3-1" />
      </>
    ),
  },
  {
    key: "trainer",
    title: "Personal Trainer",
    description: "Gere clientes, cria treinos e faz crescer o teu negócio de fitness.",
    icon: (
      <>
        <path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" />
      </>
    ),
  },
  {
    key: "gym",
    title: "Ginásio",
    description: "Gere membros, treinadores, subscrições e toda a operação do teu ginásio.",
    icon: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
  },
  {
    key: "shop",
    title: "Loja",
    description: "Vende suplementos e equipamento diretamente na Loja FitPro.",
    icon: (
      <>
        <path d="M3 9 12 4l9 5-9 5-9-5Z" />
        <path d="M3 9v6l9 5 9-5V9" />
      </>
    ),
  },
];

const goals = [
  { key: "lose_weight", label: "Perder peso" },
  { key: "build_muscle", label: "Ganhar massa muscular" },
  { key: "improve_fitness", label: "Melhorar a forma física" },
  { key: "maintain_health", label: "Manter a saúde" },
];

function Field({
  label,
  type = "text",
  placeholder,
  select,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  select?: { value: string; label: string }[];
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {select ? (
        <select className="field-input" value={value} onChange={(e) => onChange?.(e.target.value)}>
          {select.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="field-input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </label>
  );
}

const roleDashboard: Record<Role, string> = {
  athlete: "/dashboard/athlete",
  trainer: "/dashboard",
  nutritionist: "/dashboard/nutritionist",
  gym: "/dashboard/gym",
  shop: "/dashboard/shop",
};

const roleDashboardAny: Record<string, string> = {
  admin: "/dashboard/admin",
  ...roleDashboard,
};

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  function selectTab(t: Tab) {
    setTab(t);
    if (t === "signup") setStep(role ? "form" : "role");
  }

  async function handleLogin() {
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Não foi possível iniciar sessão.");
        return;
      }
      setSession({ name: data.name, email: data.email, role: data.role });
      router.push(roleDashboardAny[data.role] || "/dashboard");
    } catch {
      setLoginError("Erro de ligação. Tenta novamente.");
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-brand">
          <div className="auth-brand-top">
            <div className="sidebar-brand-mark" style={{ background: "#fff" }} />
            <span className="auth-brand-word">
              Fit<b>Pro</b>
            </span>
          </div>

          <div className="auth-brand-copy">
            <h1>O teu ecossistema completo de fitness.</h1>
            <p>Gere treinos, nutrição, clientes e crescimento numa única plataforma inteligente.</p>
          </div>

          <div className="auth-mock">
            <div className="auth-mock-head">
              <span />
              <span />
              <span />
            </div>
            <div className="auth-mock-stats">
              <div className="auth-mock-stat" />
              <div className="auth-mock-stat" />
              <div className="auth-mock-stat" />
            </div>
            <div className="auth-mock-chart">
              <svg viewBox="0 0 240 70" preserveAspectRatio="none">
                <path d="M0,55 L40,40 L80,48 L120,20 L160,30 L200,10 L240,18" />
              </svg>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <div className="auth-tabs">
              <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => selectTab("login")}>
                Login
              </button>
              <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => selectTab("signup")}>
                Criar Conta
              </button>
            </div>

            {tab === "login" && (
              <div className="auth-body">
                <Field label="Email" type="email" placeholder="tu@email.com" value={loginEmail} onChange={setLoginEmail} />
                <Field label="Palavra-passe" type="password" placeholder="••••••••" value={loginPassword} onChange={setLoginPassword} />
                {loginError && <p style={{ color: "var(--bad)", fontSize: 12.5, margin: 0 }}>{loginError}</p>}
                <div className="auth-row">
                  <label className="auth-check">
                    <input type="checkbox" />
                    Lembrar-me
                  </label>
                  <Link href="#" className="auth-link">
                    Esqueceste-te da palavra-passe?
                  </Link>
                </div>
                <button className="auth-submit" onClick={handleLogin} disabled={loginLoading}>
                  {loginLoading ? "A entrar…" : "Login"}
                </button>
                <div className="auth-divider"><span>ou</span></div>
                <button className="auth-google">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
                    <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24Z" />
                    <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4V6.5H1.4A12 12 0 0 0 0 12c0 1.9.5 3.8 1.4 5.5l4-3.1Z" />
                    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1C6.3 6.8 8.9 4.8 12 4.8Z" />
                  </svg>
                  Continuar com Google
                </button>
              </div>
            )}

            {tab === "signup" && step === "role" && (
              <div className="auth-body">
                <h2 className="auth-role-title">O que te descreve melhor?</h2>
                <p className="auth-role-sub">Escolhe o teu perfil para personalizar a tua experiência FitPro.</p>
                <div className="role-grid">
                  {roles.map((r) => (
                    <button
                      key={r.key}
                      className={`role-card ${role === r.key ? "selected" : ""}`}
                      onClick={() => setRole(r.key)}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="role-card-icon">
                        {r.icon}
                      </svg>
                      <span className="role-card-title">{r.title}</span>
                      <span className="role-card-desc">{r.description}</span>
                    </button>
                  ))}
                </div>
                <button className="auth-submit" disabled={!role} onClick={() => role && setStep("form")}>
                  Continuar
                </button>
              </div>
            )}

            {tab === "signup" && step === "form" && role && (
              <div className="auth-body">
                <button className="auth-back" onClick={() => setStep("role")}>
                  ← Voltar
                </button>
                <h2 className="auth-role-title">Criar conta de {roles.find((r) => r.key === role)?.title}</h2>

                {role === "athlete" && (
                  <>
                    <Field label="Nome completo" placeholder="O teu nome" />
                    <Field label="Email" type="email" placeholder="tu@email.com" />
                    <Field label="Palavra-passe" type="password" placeholder="••••••••" />
                    <Field label="Idade" type="number" placeholder="25" />
                    <Field label="Objetivo" select={goals.map((g) => ({ value: g.key, label: g.label }))} />
                  </>
                )}

                {role === "trainer" && (
                  <>
                    <Field label="Nome" placeholder="O teu nome" />
                    <Field label="Email" type="email" placeholder="tu@email.com" />
                    <Field label="Palavra-passe" type="password" placeholder="••••••••" />
                    <Field label="Especialidade" placeholder="Ex: Força e hipertrofia" />
                    <Field label="Anos de experiência" type="number" placeholder="5" />
                    <Field label="Número de clientes" type="number" placeholder="20" />
                  </>
                )}

                {role === "nutritionist" && (
                  <>
                    <Field label="Nome" placeholder="O teu nome" />
                    <Field label="Email" type="email" placeholder="tu@email.com" />
                    <Field label="Palavra-passe" type="password" placeholder="••••••••" />
                    <Field label="Certificação" placeholder="Ex: Ordem dos Nutricionistas" />
                    <Field label="Especialidade" placeholder="Ex: Nutrição desportiva" />
                    <Field label="Anos de experiência" type="number" placeholder="5" />
                  </>
                )}

                {role === "gym" && (
                  <>
                    <Field label="Nome do ginásio" placeholder="Ex: FitPro Talatona" />
                    <Field label="Nome do proprietário" placeholder="O teu nome" />
                    <Field label="Email" type="email" placeholder="tu@email.com" />
                    <Field label="Palavra-passe" type="password" placeholder="••••••••" />
                    <Field label="Número de membros" type="number" placeholder="150" />
                    <Field label="Localização" placeholder="Ex: Luanda, Angola" />
                  </>
                )}

                {role === "shop" && (
                  <>
                    <Field label="Nome da loja" placeholder="Ex: SupleForte" />
                    <Field label="Nome do proprietário" placeholder="O teu nome" />
                    <Field label="Email" type="email" placeholder="tu@email.com" />
                    <Field label="Palavra-passe" type="password" placeholder="••••••••" />
                    <Field label="Categoria principal" placeholder="Ex: Suplementos" />
                    <Field label="Localização" placeholder="Ex: Luanda, Angola" />
                  </>
                )}

                <button
                  className="auth-submit"
                  onClick={() => {
                    if (!role) return;
                    setSession({ name: "Novo Utilizador", email: "", role });
                    router.push(roleDashboardAny[role]);
                  }}
                >
                  Criar conta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
