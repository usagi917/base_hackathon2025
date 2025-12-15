function withValidProperties(properties: Record<string, undefined | string | string[]>) {
    return Object.fromEntries(
        Object.entries(properties).filter(([_, value]) =>
            (Array.isArray(value) ? value.length > 0 : !!value)
        )
    );
}

export async function GET() {
    const URL = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

    return Response.json({
        accountAssociation: {
            header: "",
            payload: "",
            signature: ""
        },
        miniapp: withValidProperties({
            version: "1",
            name: "Proof of Regret",
            homeUrl: URL,
            iconUrl: `${URL}/icon.png`,
            splashImageUrl: `${URL}/splash.png`,
            splashBackgroundColor: "#000000",
            webhookUrl: undefined, // オプション
            subtitle: "Words are cheap. Proof is on-chain.",
            description: "後悔の証明をブロックチェーン上に刻み、ETHを燃やすことでコミットメントを示すアプリ",
            screenshotUrls: [
                // 後で追加
            ],
            primaryCategory: "social",
            tags: ["proof", "blockchain", "commitment", "base"],
            heroImageUrl: undefined, // オプション
            tagline: "Burn ETH, Prove Commitment",
            ogTitle: "Proof of Regret",
            ogDescription: "Words are cheap. Proof is on-chain.",
            ogImageUrl: undefined, // オプション
        })
    });
}
