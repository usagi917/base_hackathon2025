function withValidProperties(properties: Record<string, undefined | string | string[]>) {
    return Object.fromEntries(
        Object.entries(properties).filter(([, value]) =>
            (Array.isArray(value) ? value.length > 0 : !!value)
        )
    );
}

export async function GET() {
    const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const metadataBase = (() => {
        try {
            return new URL(siteUrl);
        } catch {
            return new URL('http://localhost:3000');
        }
    })();

    const accountAssociationHeader = process.env.FARCASTER_ACCOUNT_ASSOCIATION_HEADER;
    const accountAssociationPayload = process.env.FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD;
    const accountAssociationSignature = process.env.FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE;

    // 本番で `.well-known/farcaster.json` が不正だと Base / Farcaster 側で読み込みに失敗するため、
    // デプロイ時に気づけるよう明示的に 500 を返す。
    if (process.env.NODE_ENV === 'production') {
        if (!accountAssociationHeader || !accountAssociationPayload || !accountAssociationSignature) {
            return Response.json(
                {
                    error:
                        'Missing FARCASTER_ACCOUNT_ASSOCIATION_* env vars (HEADER, PAYLOAD, SIGNATURE).',
                },
                { status: 500 }
            );
        }
    }

    return Response.json({
        accountAssociation: process.env.NODE_ENV === 'production'
            ? {
                header: accountAssociationHeader!,
                payload: accountAssociationPayload!,
                signature: accountAssociationSignature!,
            }
            : {
                header:
                    accountAssociationHeader ||
                    'REPLACE_WITH_FARCASTER_ACCOUNT_ASSOCIATION_HEADER',
                payload:
                    accountAssociationPayload ||
                    'REPLACE_WITH_FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD',
                signature:
                    accountAssociationSignature ||
                    'REPLACE_WITH_FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE',
            },
        miniapp: withValidProperties({
            version: "1",
            name: "Proof of Regret",
            homeUrl: metadataBase.origin,
            iconUrl: new URL('/miniapp-icon.png', metadataBase).toString(),
            splashImageUrl: new URL('/miniapp-splash.png', metadataBase).toString(),
            splashBackgroundColor: "#000000",
            webhookUrl: undefined, // オプション
            subtitle: "Burn ETH, Prove Commitment",
            description: "後悔の証明をブロックチェーン上に刻み、ETHを燃やすことでコミットメントを示すアプリ",
            screenshotUrls: [
                new URL('/miniapp-screenshot-1.png', metadataBase).toString(),
            ],
            primaryCategory: "social",
            tags: ["proof", "blockchain", "commitment", "base"],
            heroImageUrl: new URL('/miniapp-hero.png', metadataBase).toString(),
            tagline: "Burn ETH, Prove Commitment",
            ogTitle: "Proof of Regret",
            ogDescription: "Words are cheap. Proof is on-chain.",
            ogImageUrl: new URL('/miniapp-hero.png', metadataBase).toString(),
        })
    });
}
