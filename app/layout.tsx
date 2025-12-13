// biome-ignore assist/source/organizeImports: <explanation>
import type { Metadata } from "next";
import { Noto_Sans_JP, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import '@coinbase/onchainkit/styles.css';
import { ArtBackground } from "./components/ArtBackground";

const notoSansJP = Noto_Sans_JP({ 
  weight: ["400", "500", "700", "900"], 
  subsets: ["latin"],
  variable: '--font-noto-sans-jp' 
});

const inter = Inter({ 
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"], 
  variable: '--font-inter' 
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: '--font-jetbrains-mono'
});

const metadataBase = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const vercel = process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);

  return new URL('http://localhost:3000');
})();

export const metadata: Metadata = {
  metadataBase,
  title: "Proof of Regret",
  description: "Words are cheap. Proof is on-chain.",
  openGraph: {
    title: "Proof of Regret",
    description: "Words are cheap. Proof is on-chain.",
    type: "website",
    siteName: "Proof of Regret",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proof of Regret",
    description: "Words are cheap. Proof is on-chain.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${inter.variable} ${jetbrainsMono.variable} bg-[var(--md-sys-color-background)] text-[var(--md-sys-color-on-background)] antialiased font-sans overflow-x-hidden`}>
        <ArtBackground />
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
