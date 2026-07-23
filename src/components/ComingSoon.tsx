import Link from "next/link";

export default function ComingSoon({ title, description, icon = "🚧", backHref = "/dashboard" }: { title: string; description: string; icon?: string; backHref?: string }) {
  return (
    <div className="shell">
      <div className="page-head" style={{ paddingTop: 22 }}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="dash-panel" style={{ padding: "56px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 40, marginBottom: 4 }}>{icon}</div>
        <p style={{ fontSize: 14.5, fontWeight: 700 }}>Esta secção está em construção</p>
        <span style={{ fontSize: 12.5, color: "var(--text-faint)", maxWidth: 420, lineHeight: 1.6 }}>
          Estamos a preparar uma experiência completa para {title.toLowerCase()}. Em breve vais poder gerir tudo diretamente aqui.
        </span>
        <Link href={backHref} className="btn btn-ghost btn-sm" style={{ marginTop: 10 }}>← Voltar ao Dashboard</Link>
      </div>
    </div>
  );
}
