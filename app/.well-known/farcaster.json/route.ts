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
            header: "eyJmaWQiOjE1OTYzMjMsInR5cGUiOiJhdXRoIiwia2V5IjoiMHg1MzlhRkNhN0RDMkZGNUEwMEU0RDg3NTc3M2ZjQTFGOTQ4NDgwMDI4In0",
            payload: "eyJkb21haW4iOiJiYXNlLWhhY2thdGhvbjIwMjUudmVyY2VsLmFwcCJ9",
            signature: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABZhZww4DNxs4GFVSDifEcVG4xX3xfHW3VUlSUVV0KcmdjoT12oPNP1hpMdUlGOpaiiDaQgcxIphIBqbnUNpc6uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAl8ZgIay2xclZzG8RWZzuWvO8j9R0fus3XxDee9lRlVy8dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACKeyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoicWtBdDNoRFNwT3UxbUEzbjFEWlV2M0JES1pxd2FyeUw4VE5IdE1tMDRRQSIsIm9yaWdpbiI6Imh0dHBzOi8va2V5cy5jb2luYmFzZS5jb20iLCJjcm9zc09yaWdpbiI6ZmFsc2V9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        },
        miniapp: withValidProperties({
            version: "1",
            name: "Proof of Regret",
            homeUrl: URL,
            iconUrl: `${URL}/icon.png`,
            splashImageUrl: `${URL}/splash.png`,
            splashBackgroundColor: "#000000",
            webhookUrl: undefined, // オプション
            subtitle: "Burn ETH, Prove Commitment",
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
