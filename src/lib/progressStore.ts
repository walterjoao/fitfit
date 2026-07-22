"use client";

function readList<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  } catch {
    return seed;
  }
}

function writeList<T>(key: string, list: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

export function useLocalList<T extends { id: string }>(key: string, seed: T[]) {
  return {
    getAll: () => readList<T>(key, seed),
    add: (item: T) => {
      const list = readList<T>(key, seed);
      const next = [item, ...list];
      writeList(key, next);
      return next;
    },
    update: (id: string, patch: Partial<T>) => {
      const list = readList<T>(key, seed);
      const next = list.map((x) => (x.id === id ? { ...x, ...patch } : x));
      writeList(key, next);
      return next;
    },
    remove: (id: string) => {
      const list = readList<T>(key, seed);
      const next = list.filter((x) => x.id !== id);
      writeList(key, next);
      return next;
    },
  };
}
