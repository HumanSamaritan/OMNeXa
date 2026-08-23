import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://swayamitr.omnexagoc.com"),
  title: "ITR Self-Filer India",
  description: "A privacy-first guided workspace for Indian individuals to prepare and self-file an income tax return.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "ITR Self-Filer India",
    description: "Prepare your Indian individual tax return with guided checks, transparent calculations and a private working file.",
    type: "website",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "SwayamITR — Self-file with confidence" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ITR Self-Filer India",
    description: "Prepare your Indian individual tax return with guided checks, transparent calculations and a private working file.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
