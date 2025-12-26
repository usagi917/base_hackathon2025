# Proof of Regret 🙇‍♂️💸

ブロックチェーンに「後悔」を刻み、その運命を相手に委ねるDApps。

## 概要

**Proof of Regret** は、謝罪の意志として JPYC または USDC をロックし、その処理権限を相手に譲渡するDAppです。言葉だけの謝罪ではなく、金銭的な価値を犠牲にする覚悟を示すことで、真剣さを証明します。

### 仕組み

1.  **Confess (告白):** ユーザー（謝りたい人）は後悔のメッセージを書き込み、任意の額の JPYC または USDC をデポジット（供託）します。
2.  **Sacrifice (犠牲):** スマートコントラクトにトークンがロックされ、解決用の共有リンクが発行されます。
3.  **Judgment (審判):** リンクを受け取った相手（謝罪を受ける人）は、以下の3つから運命を選択します。

| 選択 | 結果 | 意味 |
| :--- | :--- | :--- |
| **Forgive (赦す)** | ロックされたトークンは**謝罪を受ける人（相手）**が受け取ります。 | 賠償として受け取る。 |
| **Reject (拒絶)** | 謝罪を受け入れず、トークンは**謝りたい人（あなた）**に返金されます。 | 「金で解決しようとするな」という拒絶。 |
| **Punish (処罰)** | トークンは永久にアクセス不可能なアドレスへ送られ、**焼却（Burn）**されます。 | 誰も得をしない、純粋な罰。 |

審判を実行した相手（Judge）には、その決断（Forgive/Reject/Punish）の結果が記録された **Regret Judgment SBT (Soulbound Token)** が自動的にミントされます。これは、その人が他者の運命をどのように決定したかを示す、譲渡不可能なオンチェーンの証となります。

![Sequence Diagram](public/diagrams/sequence.svg)



## 技術スタック

-   **Frontend:** [Next.js 16 (App Router)](https://nextjs.org/)
-   **Blockchain Interaction:** [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/)
-   **State/Data:** [TanStack Query 5](https://tanstack.com/query/latest)
-   **UI/Animation:** [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
-   **Smart Contract:** Solidity
-   **Integration:** [Farcaster Miniapp](https://docs.farcaster.xyz/learn/miniapps/introduction)
-   **Network:** Polygon Mainnet (Chain ID 137)
-   **Supported Tokens:** JPYC, USDC (Polygon Native)

![Architecture Diagram](public/diagrams/architecture.svg)

## Farcaster Miniapp 対応

このDAppは **Farcaster Miniapp** (旧 v2 Frames) として動作するように設計されています。
Warpcast などの Farcaster クライアント内で直接動作し、シームレスなウォレット接続と署名が可能です。

-   **Manifest:** `.well-known/farcaster.json` にホストされています。
-   **Context:** Farcaster アプリから開かれた場合、コンテキスト（ユーザー情報など）を取得して UX を最適化します。

## すぐに始める

### 前提条件

-   Node.js v20 以上
-   npm または pnpm/yarn
-   Foundry (コントラクト開発を行う場合)

### 環境変数の設定

フロントエンドは RegretVaultV2 / RegretJudgmentSBT のアドレスを環境変数から参照します。`.env.local` などに以下を設定してください。

```bash
# Polygon Mainnet RPC URL (optional, but recommended)
POLYGON_MAINNET_RPC_URL=https://polygon-rpc.com

# Deployed Contract Addresses on Polygon Mainnet
NEXT_PUBLIC_REGRET_VAULT_V2_ADDRESS=0xF4d51447e003b9fB5Ec47aa0f0bef93A74509F90
NEXT_PUBLIC_JUDGMENT_SBT_ADDRESS=0x15784cD5a188531E00Dc88D22692cB5FF9a25ACa

# Token Addresses on Polygon Mainnet
NEXT_PUBLIC_JPYC_ADDRESS=0x6AE7Dfc73E0dDE2aa99ac063DcF7e8A63265108c
NEXT_PUBLIC_USDC_ADDRESS=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359

# Site URL (optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.example` ファイルも参照してください。`POLYGON_MAINNET_RPC_URL` を省略するとパブリック RPC が使われますが、レートリミット回避のため設定を推奨します。

### デモ

-   本番: https://base-app-swart.vercel.app/

### インストール

```bash
git clone https://github.com/usagi917/base_hackathon2025.git
cd base_hackathon2025
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```
ブラウザで `http://localhost:3000` を開いてください。

## スマートコントラクト

コントラクトのソースコードは `contracts/` ディレクトリにあります。

-   **RegretVaultV2 (メインで使用)**: Polygon Mainnet（Chain ID 137）にデプロイ済み
    -   アドレス: `0xF4d51447e003b9fB5Ec47aa0f0bef93A74509F90`
-   **RegretJudgmentSBT**: Polygon Mainnet にデプロイ済み
    -   アドレス: `0x15784cD5a188531E00Dc88D22692cB5FF9a25ACa`

### コントラクトのテスト・開発

```bash
cd contracts
forge install
forge test
```

## 注意事項

このプロジェクトは実験的なプロトタイプであり、**Polygon Mainnet** で動作します。
実際の暗号資産（JPYC、USDC）を使用するため、特に Punish が選択された場合、資金は永久に失われます。自己責任でご利用ください。

## ライセンス

MIT License
