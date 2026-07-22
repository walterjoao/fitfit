import { exercisePRs as seedPRs, badges as seedBadges, type ExercisePR, type Badge } from "./progressData";

// All state here is localStorage-backed (no real backend) and keyed per browser,
// mirroring the pattern used by directory.ts follow/wishlist helpers.

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

// ---------- Editable header / quick stats ----------
export type ProfileOverride = {
  bio?: string;
  location?: string;
  goal?: string;
  level?: string;
  weightKg?: number;
  heightCm?: number;
  bodyFatPct?: number;
  trainingFreq?: number;
  avatarUrl?: string;
  coverUrl?: string;
};

const OVERRIDE_KEY = "fitpro_profile_override";

export function getProfileOverride(): ProfileOverride {
  return read(OVERRIDE_KEY, {});
}
export function saveProfileOverride(patch: ProfileOverride) {
  const next = { ...getProfileOverride(), ...patch };
  write(OVERRIDE_KEY, next);
  return next;
}

export const goalOptions = ["Cutting", "Bulking", "Manter Peso", "Personalizado"];
export const levelOptions = ["Iniciante", "Intermédio", "Avançado"];

// ---------- Personal Records ----------
const PR_KEY = "fitpro_personal_records";

export function getPRs(): ExercisePR[] {
  return read(PR_KEY, seedPRs);
}
export function addPR(pr: ExercisePR) {
  const next = [pr, ...getPRs()];
  write(PR_KEY, next);
  return next;
}
export function removePR(exercise: string) {
  const next = getPRs().filter((p) => p.exercise !== exercise);
  write(PR_KEY, next);
  return next;
}

// ---------- Activity feed ----------
export type FeedPost = { id: string; caption: string; type: "workout" | "photo" | "achievement" | "update"; date: string; likes: number; liked: boolean; comments: number };

const FEED_KEY = "fitpro_activity_feed";

const seedFeed: FeedPost[] = [
  { id: "post1", caption: "Completei o treino Upper Body Strength — novo PR no supino! 💪", type: "workout", date: "Há 2 dias", likes: 14, liked: false, comments: 3 },
  { id: "post2", caption: "42 sessões seguidas e a contar 🔥", type: "achievement", date: "Há 5 dias", likes: 22, liked: false, comments: 6 },
];

export function getFeed(): FeedPost[] {
  return read(FEED_KEY, seedFeed);
}
export function addFeedPost(caption: string, type: FeedPost["type"]) {
  const post: FeedPost = { id: Math.random().toString(36).slice(2), caption, type, date: "Agora", likes: 0, liked: false, comments: 0 };
  const next = [post, ...getFeed()];
  write(FEED_KEY, next);
  return next;
}
export function removeFeedPost(id: string) {
  const next = getFeed().filter((p) => p.id !== id);
  write(FEED_KEY, next);
  return next;
}
export function toggleLike(id: string) {
  const next = getFeed().map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  write(FEED_KEY, next);
  return next;
}

// ---------- Badge visibility ----------
const HIDDEN_BADGES_KEY = "fitpro_hidden_badges";

export function getHiddenBadges(): string[] {
  return read(HIDDEN_BADGES_KEY, []);
}
export function toggleBadgeVisibility(id: string) {
  const hidden = getHiddenBadges();
  const next = hidden.includes(id) ? hidden.filter((x) => x !== id) : [...hidden, id];
  write(HIDDEN_BADGES_KEY, next);
  return next;
}
export function visibleBadges(): Badge[] {
  const hidden = getHiddenBadges();
  return seedBadges.filter((b) => !hidden.includes(b.id));
}
export function allBadgesWithVisibility(): (Badge & { hidden: boolean })[] {
  const hidden = getHiddenBadges();
  return seedBadges.map((b) => ({ ...b, hidden: hidden.includes(b.id) }));
}
