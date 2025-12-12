import type { Metadata } from 'next';

import { ResolveClient } from './ResolveClient';

function buildResolveMetadata(id: string): Metadata {
  const isValidId = /^\d+$/.test(id);

  const title = isValidId ? `審判を下す #${id} | Proof of Regret` : 'リンクが不正です | Proof of Regret';
  const description =
    'このリンクを開いた人が審判者になります。あなたの選択で供物（ETH）の行方が決まります。';

  return {
    title,
    description,
    alternates: {
      canonical: `/resolve/${id}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/resolve/${id}`,
      siteName: 'Proof of Regret',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return buildResolveMetadata(params.id);
}

export default function ResolvePage({ params }: { params: { id: string } }) {
  return <ResolveClient rawId={params.id} />;
}
