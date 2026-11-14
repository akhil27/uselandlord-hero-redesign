import Link from "next/link";
import { ArrowRightIcon, BrandMark } from "@/components/icons";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px",
        background: "var(--studio)",
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          padding: "48px",
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: "24px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "var(--green-soft)",
              border: "1px solid rgba(125,200,105,.35)",
            }}
          >
            <BrandMark size={22} />
          </span>
          <span style={{ fontSize: 15, fontWeight: 650, letterSpacing: "-0.02em" }}>Landlord</span>
          <span style={{ color: "var(--ink-muted)", fontSize: 13 }}>/ Design review</span>
        </div>

        <h1 style={{ marginTop: 36, fontSize: "clamp(32px, 5vw, 46px)", letterSpacing: "-0.045em", lineHeight: 1.02 }}>
          Homepage hero redesign
        </h1>
        <p style={{ marginTop: 16, color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.6, maxWidth: 520 }}>
          A before-and-after presentation of the Landlord hero: clearer positioning, a live product moment,
          and a stronger path to booking a demo.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginTop: 30 }}>
          <Link
            href="/design-review"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              height: 48,
              padding: "0 18px",
              borderRadius: 9,
              background: "var(--green)",
              color: "var(--ink)",
              fontSize: 14,
              fontWeight: 650,
              boxShadow: "0 10px 22px -14px rgba(82,142,69,.8)",
            }}
          >
            Open design review
            <ArrowRightIcon size={15} />
          </Link>
          <Link
            href="/hero-preview"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 48,
              padding: "0 18px",
              borderRadius: 9,
              border: "1px solid var(--line)",
              background: "#fff",
              color: "var(--ink)",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            View the live hero
          </Link>
        </div>
      </div>
    </main>
  );
}
