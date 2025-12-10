// biome-ignore assist/source/organizeImports: <explanation>
import type { Metadata } from "next";
import { Noto_Sans_JP, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import '@coinbase/onchainkit/styles.css';

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

export const metadata: Metadata = {
  title: "Proof of Regret",
  description: "Words are cheap. Proof is on-chain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${inter.variable} ${jetbrainsMono.variable} bg-yellow-300 text-black antialiased font-sans overflow-x-hidden`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
