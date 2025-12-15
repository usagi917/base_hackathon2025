// biome-ignore assist/source/organizeImports: <explanation>
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import '@coinbase/onchainkit/styles.css';
import { ArtBackground } from "./components/ArtBackground";

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
  other: {
    'base:app_id': '693ff955d77c069a945bdf04',
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: new URL('/miniapp-embed.png', metadataBase).toString(),
      button: {
        title: 'Burn ETH & Prove Regret',
        action: {
          type: 'launch_frame',
          name: 'Proof of Regret',
          url: metadataBase.toString(),
          splashImageUrl: new URL('/miniapp-splash.png', metadataBase).toString(),
          splashBackgroundColor: '#000000',
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL;

  return (
    <html lang="ja">
      <body className="bg-[var(--md-sys-color-background)] text-[var(--md-sys-color-on-background)] antialiased font-sans overflow-x-hidden">
        <ArtBackground />
        <div className="relative z-10">
          <Providers rpcUrl={rpcUrl}>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
