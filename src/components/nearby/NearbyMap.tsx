"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { entryLatLng, nearbyTypeColor, defaultCenter, type NearbyEntry } from "@/lib/nearbyData";

const typeGlyph: Record<string, string> = {
  athlete: "👤",
  trainer: "🧑‍🏫",
  gym: "🏋️",
  nutritionist: "🥗",
};

export default function NearbyMap({
  entries,
  center,
  onSelect,
}: {
  entries: NearbyEntry[];
  center?: { lat: number; lng: number } | null;
  onSelect?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      const mapCenter = center || defaultCenter;

      if (!mapRef.current) {
        const map = L.map(containerRef.current, { zoomControl: true }).setView([mapCenter.lat, mapCenter.lng], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);
        mapRef.current = map;
      } else {
        mapRef.current.setView([mapCenter.lat, mapCenter.lng], mapRef.current.getZoom());
      }

      const map = mapRef.current;
      markersRef.current.forEach((m) => map.removeLayer(m));
      markersRef.current = [];

      const youIcon = L.divIcon({
        className: "",
        html: `<div style="width:16px;height:16px;border-radius:50%;background:var(--accent);border:3px solid #fff;box-shadow:0 0 0 4px rgba(20,124,246,.3)"></div>`,
        iconSize: [16, 16],
      });
      markersRef.current.push(L.marker([mapCenter.lat, mapCenter.lng], { icon: youIcon, zIndexOffset: 1000 }).addTo(map).bindTooltip("A tua localização"));

      entries.forEach((e) => {
        const pos = entryLatLng(e, mapCenter);
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;background:${nearbyTypeColor[e.type]};box-shadow:0 2px 8px rgba(0,0,0,.3);cursor:pointer"><span style="transform:rotate(45deg);font-size:13px">${typeGlyph[e.type]}</span></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });
        const marker = L.marker([pos.lat, pos.lng], { icon }).addTo(map).bindTooltip(`${e.name} · ${e.distanceKm.toFixed(1)}km`);
        marker.on("click", () => onSelect?.(e.id));
        markersRef.current.push(marker);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [entries, center]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
