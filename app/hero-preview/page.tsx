import type { Metadata } from "next";
import { NewHero } from "@/components/NewHero";

export const metadata: Metadata = {
  title: "Proposed hero — Landlord",
  robots: { index: false, follow: false },
};

export default function HeroPreviewPage() {
  return (
    <main style={{ background: "#ffffff" }}>
      <NewHero />
    </main>
  );
}
