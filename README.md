# Proof of Regret 🙇‍♂️💸

ブロックチェーンに「後悔」を刻み、その運命を相手に委ねる実験的アプリケーション。

## 概要

**Proof of Regret** は、謝罪の意志として ETH をロックし、その処理権限を相手に譲渡する DApp (Decentralized Application) です。言葉だけの謝罪ではなく、金銭的な価値（Stake）を犠牲にする覚悟を示すことで、真剣さを証明します。

### 仕組み

1.  **Confess (告白):** ユーザー（加害者）は後悔のメッセージを書き込み、任意の額の ETH をデポジット（供託）します。
2.  **Sacrifice (犠牲):** スマートコントラクトに ETH がロックされ、解決用の共有リンクが発行されます。
3.  **Judgment (審判):** リンクを受け取った相手（被害者）は、以下の3つから運命を選択します。

| 選択 | 結果 | 意味 |
| :--- | :--- | :--- |
| **Forgive (赦す)** | ロックされた ETH は**被害者（相手）**が受け取ります。 | 賠償として受け取る。 |
| **Reject (拒絶)** | 謝罪を受け入れず、ETH は**加害者（あなた）**に返金されます。 | 「金で解決しようとするな」という拒絶。 |
| **Punish (処罰)** | ETH は永久にアクセス不可能なアドレスへ送られ、**焼却（Burn）**されます。 | 誰も得をしない、純粋な罰。 |

## 技術スタック

-   **Frontend:** [Next.js 16 (App Router)](https://nextjs.org/)
-   **Blockchain Interaction:** [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/), [Coinbase OnchainKit](https://onchainkit.xyz/)
-   **UI/Animation:** [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
-   **Smart Contract:** Solidity, [Foundry](https://getfoundry.sh/)
-   **Network:** Base Sepolia (Testnet)

## すぐに始める

### 前提条件

-   Node.js v20 以上
-   npm または pnpm/yarn
-   Foundry (コントラクト開発を行う場合)

### インストール

```bash
git clone https://github.com/your-username/proof-of-regret.git
cd proof-of-regret
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```
ブラウザで `http://localhost:3000` を開いてください。

## スマートコントラクト

コントラクトのソースコードは `contracts/` ディレクトリにあります。

-   **Contract Name:** `RegretVault`
-   **Deployed Address (Base Sepolia):** `0xd0d4044c7e51e96002dd143bbc441cd6b1eafdaa`
-   **Explorer:** [BaseScan (Sepolia)](https://sepolia.basescan.org/address/0xd0d4044c7e51e96002dd143bbc441cd6b1eafdaa)

### コントラクトのテスト・開発

```bash
cd contracts
forge install
forge test
```

## 注意事項

このプロジェクトは実験的なプロトタイプであり、現在は **Base Sepolia テストネット** での動作を前提としています。
メインネットにデプロイする場合、実際の暗号資産を失う可能性があります（特に Punish が選択された場合、資金は永久に失われます）。

## ライセンス

MIT License