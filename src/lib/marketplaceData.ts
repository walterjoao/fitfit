import { directory, type DirRole } from "./directory";

export type MarketplaceCategory = "trainer" | "nutritionist" | "gym" | "shop";

export const categoryMeta: Record<MarketplaceCategory, { label: string; icon: string; plural: string }> = {
  trainer: { label: "Personal Trainers", icon: "🏋️", plural: "Personal Trainers" },
  nutritionist: { label: "Nutricionistas", icon: "🥗", plural: "Nutricionistas" },
  gym: { label: "Ginásios", icon: "🏢", plural: "Ginásios" },
  shop: { label: "Lojas", icon: "🛒", plural: "Lojas" },
};

export function profilesByRole(role: DirRole) {
  return Object.values(directory).filter((p) => p.role === role);
}

export function allMarketplaceProfiles() {
  return Object.values(directory).filter((p) => p.role !== "athlete");
}

export function topRated(limit = 6) {
  return [...allMarketplaceProfiles()].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function popularThisWeek(limit = 6) {
  return [...allMarketplaceProfiles()].sort((a, b) => b.followers - a.followers).slice(0, limit);
}

export function newestProfessionals(limit = 4) {
  return [...allMarketplaceProfiles()].reverse().slice(0, limit);
}
