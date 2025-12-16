function withValidProperties(
    properties: Record<string, undefined | string | string[] | boolean>
) {
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

    const accountAssociation = {
        header: accountAssociationHeader || '',
        payload: accountAssociationPayload || '',
        signature: accountAssociationSignature || '',
    };

    // Base Build の検証・署名フロー用に、accountAssociation 未設定でも常に 200 で返す。
    // 必須フィールドは Base の manifest schema に合わせて網羅する。
    const miniapp = withValidProperties({
        version: '1',
        name: 'Proof of Regret',
        homeUrl: metadataBase.origin,
        iconUrl: new URL('/miniapp-icon.png', metadataBase).toString(),
        splashImageUrl: new URL('/miniapp-splash.png', metadataBase).toString(),
        splashBackgroundColor: '#000000',
        subtitle: 'Burn ETH, Prove Commitment',
        description: '後悔の証明をブロックチェーン上に刻み、ETHを燃やすことでコミットメントを示すアプリ',
        screenshotUrls: [new URL('/miniapp-screenshot-1.png', metadataBase).toString()],
        primaryCategory: 'social',
        tags: ['proof', 'blockchain', 'commitment', 'base'],
        heroImageUrl: new URL('/miniapp-hero.png', metadataBase).toString(),
        tagline: 'Burn ETH, Prove Regret',
        ogTitle: 'Proof of Regret',
        ogDescription: 'Words are cheap. Proof is on-chain.',
        ogImageUrl: new URL('/miniapp-hero.png', metadataBase).toString(),
        // Optional: exclude non-production deploys from search results
        noindex: process.env.NODE_ENV === 'production' ? undefined : true,
        // Optional: notifications
        webhookUrl: undefined,
    });

    return Response.json({
        accountAssociation,
        // Mini App Manifest spec:
        // - host at `/.well-known/farcaster.json`
        // - `miniapp` (or `frame`) object must include required fields (imageUrl, buttonTitle, etc.)
        miniapp,
        // During a transition period, some clients may still look for `frame`.
        frame: miniapp,
    });
}
