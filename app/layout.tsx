import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landlord — Hero Redesign · Design Review",
  description:
    "A focused before-and-after redesign of the Landlord homepage hero: clearer value proposition, product proof, and a stronger path to booking a demo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
