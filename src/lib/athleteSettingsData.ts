function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ---------- Personal info ----------
export type PersonalInfo = {
  age: number; gender: string; heightCm: number; phone: string; address: string;
  whatsappCountryCode: string; whatsappNumber: string; whatsappVisible: boolean; birthDate: string;
};
const PERSONAL_KEY = "fitpro_settings_personal";
export const defaultPersonalInfo: PersonalInfo = {
  age: 27, gender: "Prefiro não dizer", heightCm: 178, phone: "+244 923 000 000", address: "Viana, Luanda",
  whatsappCountryCode: "+244", whatsappNumber: "923000000", whatsappVisible: true, birthDate: "1999-03-14",
};
export function getPersonalInfo(): PersonalInfo {
  const v = read(PERSONAL_KEY, defaultPersonalInfo);
  return { ...defaultPersonalInfo, ...v };
}
export function savePersonalInfo(v: PersonalInfo) {
  write(PERSONAL_KEY, v);
}
export function isValidWhatsapp(number: string) {
  return /^\d{7,12}$/.test(number.replace(/\s/g, ""));
}

// ---------- Fitness config ----------
export type FitnessConfig = {
  goals: string[];
  level: string;
  frequency: number;
  preferredDays: string[];
  trainingTypes: string[];
};
const FITNESS_KEY = "fitpro_settings_fitness";
export const goalOptionsMulti = ["Ganhar massa muscular", "Perder gordura", "Aumentar força", "Melhorar resistência", "Performance", "Manutenção", "Reabilitação", "Saúde geral"];
export const levelOptionsExt = ["Iniciante", "Intermédio", "Avançado", "Profissional"];
export const trainingTypeOptions = ["Força", "Hipertrofia", "Cardio", "HIIT", "Funcional", "CrossFit", "Mobilidade", "Corrida", "Powerlifting", "Bodybuilding"];
export const weekDayOptions = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
export const defaultFitnessConfig: FitnessConfig = {
  goals: ["Ganhar massa muscular", "Aumentar força"],
  level: "Intermédio",
  frequency: 5,
  preferredDays: ["Segunda", "Quarta", "Sexta"],
  trainingTypes: ["Força", "Hipertrofia"],
};
export function getFitnessConfig(): FitnessConfig {
  const v = read(FITNESS_KEY, defaultFitnessConfig);
  return { ...defaultFitnessConfig, ...v };
}
export function saveFitnessConfig(v: FitnessConfig) {
  write(FITNESS_KEY, v);
}

// ---------- Preferences ----------
export type Preferences = { language: string; units: "Métrico" | "Imperial"; theme: "Claro" | "Escuro" | "Sistema"; startPage: string };
const PREFS_KEY = "fitpro_settings_prefs";
export const defaultPreferences: Preferences = { language: "Português", units: "Métrico", theme: "Sistema", startPage: "Dashboard" };
export function getPreferences(): Preferences {
  return read(PREFS_KEY, defaultPreferences);
}
export function savePreferences(v: Preferences) {
  write(PREFS_KEY, v);
}

// ---------- Notifications ----------
export type NotifCategory = "messages" | "bookings" | "events" | "followers" | "marketplace" | "promotions";
export type NotifChannels = { push: boolean; email: boolean; inApp: boolean };
export type NotifSettings = Record<NotifCategory, NotifChannels>;
const NOTIF_KEY = "fitpro_settings_notifications";
export const notifCategoryLabel: Record<NotifCategory, string> = {
  messages: "Mensagens", bookings: "Marcações", events: "Eventos", followers: "Seguidores", marketplace: "Marketplace", promotions: "Promoções",
};
export const defaultNotifSettings: NotifSettings = {
  messages: { push: true, email: true, inApp: true },
  bookings: { push: true, email: true, inApp: true },
  events: { push: true, email: false, inApp: true },
  followers: { push: false, email: false, inApp: true },
  marketplace: { push: false, email: false, inApp: true },
  promotions: { push: false, email: false, inApp: false },
};
export function getNotifSettings(): NotifSettings {
  return read(NOTIF_KEY, defaultNotifSettings);
}
export function saveNotifSettings(v: NotifSettings) {
  write(NOTIF_KEY, v);
}

// ---------- Privacy ----------
export type PrivacySettings = {
  visibility: "Público" | "Privado";
  showProgress: boolean;
  showMeasurements: boolean;
  showActivity: boolean;
  whoCanMessage: "Todos" | "Só quem sigo" | "Ninguém";
  whoCanFollow: "Todos" | "Aprovação manual";
  shareLocation: boolean;
};
const PRIVACY_KEY = "fitpro_settings_privacy";
export const defaultPrivacy: PrivacySettings = {
  visibility: "Público", showProgress: true, showMeasurements: false, showActivity: true,
  whoCanMessage: "Todos", whoCanFollow: "Todos", shareLocation: true,
};
export function getPrivacy(): PrivacySettings {
  return read(PRIVACY_KEY, defaultPrivacy);
}
export function savePrivacy(v: PrivacySettings) {
  write(PRIVACY_KEY, v);
}

// ---------- Connected accounts ----------
export type ConnectedAccount = { id: string; name: string; icon: string; connected: boolean };
const CONNECTED_KEY = "fitpro_settings_connected";
export const defaultConnectedAccounts: ConnectedAccount[] = [
  { id: "google", name: "Google", icon: "🔗", connected: true },
  { id: "apple_health", name: "Apple Health", icon: "🍎", connected: false },
  { id: "wearable", name: "Wearables (em breve)", icon: "⌚", connected: false },
];
export function getConnectedAccounts(): ConnectedAccount[] {
  return read(CONNECTED_KEY, defaultConnectedAccounts);
}
export function toggleConnectedAccount(id: string) {
  const next = getConnectedAccounts().map((a) => (a.id === id ? { ...a, connected: !a.connected } : a));
  write(CONNECTED_KEY, next);
  return next;
}

// ---------- Security ----------
export type SessionEntry = { id: string; device: string; location: string; lastActive: string; current: boolean };
const SESSIONS_KEY = "fitpro_settings_sessions";
export const defaultSessions: SessionEntry[] = [
  { id: "s1", device: "Chrome · Windows", location: "Luanda, Angola", lastActive: "Agora", current: true },
  { id: "s2", device: "FitPro App · Android", location: "Luanda, Angola", lastActive: "Há 2 dias", current: false },
];
export function getSessions(): SessionEntry[] {
  return read(SESSIONS_KEY, defaultSessions);
}
export function revokeSession(id: string) {
  const next = getSessions().filter((s) => s.id !== id);
  write(SESSIONS_KEY, next);
  return next;
}
const TWO_FA_KEY = "fitpro_settings_2fa";
export function get2FA(): boolean {
  return read(TWO_FA_KEY, false);
}
export function set2FA(v: boolean) {
  write(TWO_FA_KEY, v);
}

// ---------- Finance ----------
export type Subscription = { id: string; name: string; type: "Ginásio" | "PT" | "Nutrição" | "Plataforma"; price: string; cycle: string; nextPayment: string; status: "active" | "cancelled" };
const SUBS_KEY = "fitpro_settings_subs";
export const defaultSubscriptions: Subscription[] = [
  { id: "sub1", name: "FitPro Talatona — Acesso Total", type: "Ginásio", price: "1.500 Kz", cycle: "Mensal", nextPayment: "1 Ago 2026", status: "active" },
  { id: "sub2", name: "Ana Ferreira — Personal Training", type: "PT", price: "8.500 Kz", cycle: "Mensal", nextPayment: "5 Ago 2026", status: "active" },
  { id: "sub3", name: "Inês Gonçalves — Plano Nutricional", type: "Nutrição", price: "6.500 Kz", cycle: "Mensal", nextPayment: "10 Ago 2026", status: "active" },
  { id: "sub4", name: "FitPro Premium Athlete", type: "Plataforma", price: "2.500 Kz", cycle: "Mensal", nextPayment: "22 Ago 2026", status: "active" },
];
export function getSubscriptions(): Subscription[] {
  return read(SUBS_KEY, defaultSubscriptions);
}
export function cancelSubscription(id: string) {
  const next = getSubscriptions().map((s) => (s.id === id ? { ...s, status: "cancelled" as const } : s));
  write(SUBS_KEY, next);
  return next;
}

export type Invoice = { id: string; date: string; service: string; amount: string; status: "Pago" | "Pendente" };
export const invoices: Invoice[] = [
  { id: "inv-2026-07", date: "1 Jul 2026", service: "FitPro Talatona — Mensalidade", amount: "1.500 Kz", status: "Pago" },
  { id: "inv-2026-07b", date: "5 Jul 2026", service: "Ana Ferreira — Sessão PT", amount: "8.500 Kz", status: "Pago" },
  { id: "inv-2026-07c", date: "10 Jul 2026", service: "Inês Gonçalves — Consulta", amount: "6.500 Kz", status: "Pago" },
  { id: "inv-2026-06", date: "1 Jun 2026", service: "FitPro Talatona — Mensalidade", amount: "1.500 Kz", status: "Pago" },
  { id: "inv-2026-08", date: "1 Ago 2026", service: "FitPro Premium Athlete", amount: "2.500 Kz", status: "Pendente" },
];

export const expenseBreakdown = [
  { category: "PT", amount: 8500, icon: "🏋️" },
  { category: "Ginásio", amount: 1500, icon: "🏢" },
  { category: "Nutrição", amount: 6500, icon: "🥗" },
  { category: "Marketplace", amount: 3200, icon: "🛒" },
];

export const monthlySpending = [
  { month: "Fev", kz: 14200 }, { month: "Mar", kz: 15800 }, { month: "Abr", kz: 16100 },
  { month: "Mai", kz: 17400 }, { month: "Jun", kz: 18000 }, { month: "Jul", kz: 19700 },
];

export type PaymentMethod = { id: string; brand: string; last4: string; expiry: string; default: boolean };
const CARDS_KEY = "fitpro_settings_cards";
export const defaultCards: PaymentMethod[] = [{ id: "card1", brand: "Visa", last4: "4242", expiry: "09/28", default: true }];
export function getCards(): PaymentMethod[] {
  return read(CARDS_KEY, defaultCards);
}
export function addCard(brand: string, last4: string, expiry: string) {
  const next = [...getCards(), { id: Math.random().toString(36).slice(2), brand, last4, expiry, default: getCards().length === 0 }];
  write(CARDS_KEY, next);
  return next;
}
export function removeCard(id: string) {
  const next = getCards().filter((c) => c.id !== id);
  write(CARDS_KEY, next);
  return next;
}
export function setDefaultCard(id: string) {
  const next = getCards().map((c) => ({ ...c, default: c.id === id }));
  write(CARDS_KEY, next);
  return next;
}

// ---------- Roles ----------
export type RoleKeyExt = "trainer" | "nutritionist" | "professor" | "gym" | "shop";
export type RoleActivation = { role: RoleKeyExt; status: "inactive" | "active" | "review" };
const ROLES_KEY = "fitpro_settings_roles";
export const roleCatalog: { key: RoleKeyExt; label: string; icon: string; description: string; benefits: string[] }[] = [
  { key: "trainer", label: "Personal Trainer", icon: "🏋️", description: "Cria programas de treino e recebe clientes pagantes.", benefits: ["Perfil profissional", "Marcações e pagamentos", "Gestão de clientes"] },
  { key: "nutritionist", label: "Nutricionista", icon: "🥗", description: "Cria planos alimentares e faz consultas pagas.", benefits: ["Planos alimentares", "Consultas agendadas", "Loja de conteúdos"] },
  { key: "professor", label: "Instrutor / Professor", icon: "🎓", description: "Dá aulas de grupo (yoga, pilates, etc.) dentro do FitPro.", benefits: ["Gestão de aulas", "Horários e inscrições", "Avaliações"] },
  { key: "gym", label: "Dono de Ginásio", icon: "🏢", description: "Regista o teu ginásio e gere membros e aulas.", benefits: ["Gestão de membros", "Planos de mensalidade", "Analítica de negócio"] },
  { key: "shop", label: "Lojista", icon: "🛒", description: "Cria a tua loja e vende produtos fitness dentro do FitPro.", benefits: ["Catálogo de produtos", "Gestão de encomendas", "Analítica de vendas"] },
];
export function getRoleActivations(): RoleActivation[] {
  return read(ROLES_KEY, []);
}
export function requestRoleActivation(role: RoleKeyExt) {
  const list = getRoleActivations();
  const next = list.some((r) => r.role === role) ? list.map((r) => (r.role === role ? { ...r, status: "review" as const } : r)) : [...list, { role, status: "review" as const }];
  write(ROLES_KEY, next);
  return next;
}
export function pauseRole(role: RoleKeyExt) {
  const next = getRoleActivations().map((r) => (r.role === role ? { ...r, status: "inactive" as const } : r));
  write(ROLES_KEY, next);
  return next;
}
export function removeRole(role: RoleKeyExt) {
  const next = getRoleActivations().filter((r) => r.role !== role);
  write(ROLES_KEY, next);
  return next;
}
export function statusFor(role: RoleKeyExt): "inactive" | "active" | "review" {
  return getRoleActivations().find((r) => r.role === role)?.status || "inactive";
}
