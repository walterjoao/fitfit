"use client";

import { portraitImages, unsplashImages, bgImage } from "./images";

export type MsgType = "text" | "image" | "video" | "file" | "voice";
export type ChatMsg = { id: string; from: "me" | "them"; text: string; time: string; type: MsgType };

export type Conversation = {
  id: string;
  name: string;
  accountType: string;
  cover: string;
  online: boolean;
  pinned: boolean;
  archived: boolean;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: ChatMsg[];
};

const seedByRole: Record<string, Conversation[]> = {
  athlete: [
    { id: "ana-ferreira", name: "Ana Ferreira", accountType: "Personal Trainer", cover: bgImage(portraitImages.trainer[0]), online: true, pinned: true, archived: false, unread: 2, lastMessage: "Ótimo trabalho esta semana! Vamos subir a carga.", lastTime: "há 12 min", messages: [
      { id: "m1", from: "them", text: "Bom dia! Como correu o treino de ontem?", time: "09:02", type: "text" },
      { id: "m2", from: "me", text: "Correu muito bem, consegui todas as séries!", time: "09:05", type: "text" },
      { id: "m3", from: "them", text: "Ótimo trabalho esta semana! Vamos subir a carga.", time: "09:10", type: "text" },
    ] },
    { id: "ines-goncalves", name: "Inês Gonçalves", accountType: "Nutricionista", cover: bgImage(portraitImages.nutritionist[0]), online: false, pinned: false, archived: false, unread: 1, lastMessage: "Atualizei o teu plano alimentar para a próxima semana.", lastTime: "há 3 h", messages: [
      { id: "m1", from: "them", text: "Atualizei o teu plano alimentar para a próxima semana.", time: "07:40", type: "text" },
    ] },
    { id: "fitpro-talatona", name: "FitPro Talatona", accountType: "Ginásio", cover: bgImage(unsplashImages.gym[0]), online: true, pinned: false, archived: false, unread: 0, lastMessage: "A tua aula de amanhã foi confirmada.", lastTime: "ontem", messages: [
      { id: "m1", from: "them", text: "A tua aula de amanhã foi confirmada.", time: "18:20", type: "text" },
    ] },
    { id: "tiago-kiala", name: "Tiago Kiala", accountType: "Atleta", cover: bgImage(portraitImages.athlete[0]), online: false, pinned: false, archived: false, unread: 0, lastMessage: "Boa, vemo-nos no treino de grupo!", lastTime: "2 dias", messages: [
      { id: "m1", from: "them", text: "Boa, vemo-nos no treino de grupo!", time: "16:00", type: "text" },
    ] },
  ],
  trainer: [
    { id: "carla-domingos", name: "Carla Domingos", accountType: "Cliente", cover: bgImage(portraitImages.athlete[1]), online: true, pinned: true, archived: false, unread: 1, lastMessage: "Consegui terminar o treino todo hoje!", lastTime: "há 20 min", messages: [
      { id: "m1", from: "them", text: "Consegui terminar o treino todo hoje!", time: "08:30", type: "text" },
    ] },
    { id: "rui-ferreira", name: "Rui Ferreira", accountType: "Cliente", cover: bgImage(portraitImages.athlete[0]), online: false, pinned: false, archived: false, unread: 0, lastMessage: "Perfeito, obrigado pelo plano.", lastTime: "ontem", messages: [
      { id: "m1", from: "them", text: "Perfeito, obrigado pelo plano.", time: "20:12", type: "text" },
    ] },
    { id: "fitpro-talatona", name: "FitPro Talatona", accountType: "Ginásio", cover: bgImage(unsplashImages.gym[0]), online: true, pinned: false, archived: false, unread: 0, lastMessage: "A tua sala está reservada às 18h.", lastTime: "2 dias", messages: [
      { id: "m1", from: "them", text: "A tua sala está reservada às 18h.", time: "14:00", type: "text" },
    ] },
  ],
  nutritionist: [
    { id: "marta-neto", name: "Marta Neto", accountType: "Cliente", cover: bgImage(portraitImages.athlete[1]), online: true, pinned: true, archived: false, unread: 1, lastMessage: "Posso trocar o arroz por batata doce?", lastTime: "há 30 min", messages: [
      { id: "m1", from: "them", text: "Posso trocar o arroz por batata doce?", time: "12:00", type: "text" },
    ] },
    { id: "tiago-kiala", name: "Tiago Kiala", accountType: "Cliente", cover: bgImage(portraitImages.athlete[0]), online: false, pinned: false, archived: false, unread: 0, lastMessage: "Obrigado pelo plano atualizado!", lastTime: "ontem", messages: [
      { id: "m1", from: "them", text: "Obrigado pelo plano atualizado!", time: "19:00", type: "text" },
    ] },
  ],
  gym: [
    { id: "carla-domingos", name: "Carla Domingos", accountType: "Membro", cover: bgImage(portraitImages.athlete[1]), online: true, pinned: false, archived: false, unread: 1, lastMessage: "A minha subscrição renova quando?", lastTime: "há 1 h", messages: [
      { id: "m1", from: "them", text: "A minha subscrição renova quando?", time: "10:00", type: "text" },
    ] },
    { id: "ana-ferreira", name: "Ana Ferreira", accountType: "Treinadora", cover: bgImage(portraitImages.trainer[0]), online: true, pinned: true, archived: false, unread: 0, lastMessage: "Preciso de mais uma sala às sextas.", lastTime: "ontem", messages: [
      { id: "m1", from: "them", text: "Preciso de mais uma sala às sextas.", time: "17:30", type: "text" },
    ] },
  ],
  shop: [
    { id: "ricardo-bumba", name: "Ricardo Bumba", accountType: "Cliente", cover: bgImage(portraitImages.trainer[0]), online: false, pinned: false, archived: false, unread: 1, lastMessage: "A minha encomenda já foi enviada?", lastTime: "há 2 h", messages: [
      { id: "m1", from: "them", text: "A minha encomenda já foi enviada?", time: "11:00", type: "text" },
    ] },
  ],
  admin: [
    { id: "suporte-geral", name: "Suporte Geral", accountType: "Sistema", cover: "linear-gradient(155deg,#14171A,#0E7C6B)", online: true, pinned: true, archived: false, unread: 0, lastMessage: "Sem tickets pendentes.", lastTime: "agora", messages: [
      { id: "m1", from: "them", text: "Sem tickets pendentes de suporte.", time: "09:00", type: "text" },
    ] },
  ],
};

function key(role: string) {
  return `fitpro_messages_${role}`;
}

export function loadConversations(role: string): Conversation[] {
  try {
    const raw = localStorage.getItem(key(role));
    if (raw) return JSON.parse(raw);
    const seed = seedByRole[role] || [];
    localStorage.setItem(key(role), JSON.stringify(seed));
    return seed;
  } catch {
    return seedByRole[role] || [];
  }
}

export function saveConversations(role: string, list: Conversation[]) {
  try {
    localStorage.setItem(key(role), JSON.stringify(list));
  } catch {}
}
