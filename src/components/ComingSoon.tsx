export default function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="shell">
      <div className="page-head" style={{ paddingTop: 22 }}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="dash-panel" style={{ padding: "48px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-dim)" }}>Esta secção está em desenvolvimento.</p>
        <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Em breve vais poder gerir isto diretamente aqui.</span>
      </div>
    </div>
  );
}
