import type { Metadata } from 'next';

import { ResolveClient } from './ResolveClient';

function normalizeResolveId(rawId: string) {
  const decoded = (() => {
    try {
      return decodeURIComponent(rawId);
    } catch {
      return rawId;
    }
  })();

  if (/^\d+$/.test(decoded)) return decoded;

  const match = decoded.match(/^(\d+)\W+$/u);
  return match?.[1] ?? null;
}

async function resolveRawId(params: { id: unknown }) {
  const maybe = await Promise.resolve(params.id as unknown);
  return typeof maybe === 'string' ? maybe : String(maybe ?? '');
}

function buildResolveMetadata(id: string): Metadata {
  const isValidId = /^\d+$/.test(id);

  const title = isValidId ? `Resolve #${id} | Proof of Regret` : 'Invalid link | Proof of Regret';
  const socialTitle = isValidId ? `審判を下す #${id} | Proof of Regret` : 'リンクが不正です | Proof of Regret';
  const description =
    'このリンクを開いた人が審判者になります。あなたの選択で供物（ETH）の行方が決まります。';

  return {
    title,
    description,
    alternates: {
      canonical: `/resolve/${id}`,
    },
    openGraph: {
      title: socialTitle,
      description,
      type: 'website',
      url: `/resolve/${id}`,
      siteName: 'Proof of Regret',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const rawId = await resolveRawId(resolvedParams);
  return buildResolveMetadata(normalizeResolveId(rawId) ?? rawId);
}

export default async function ResolvePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await Promise.resolve(params);
  const rawId = await resolveRawId(resolvedParams);
  return <ResolveClient rawId={rawId} />;
}
