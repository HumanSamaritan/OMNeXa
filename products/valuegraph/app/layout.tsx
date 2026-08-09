import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OMNeXa ValueGraph | Enterprise Value Intelligence",
  description: "AI-assisted revenue attribution, human capital ROI and resource optimisation."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
