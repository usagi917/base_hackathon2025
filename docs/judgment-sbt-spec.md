# Judgment SBT 仕様書（Proof of Regret）

## 0. 確定事項（この仕様書の前提）

- SBT受取人：審判者（Judge / `resolve()` 実行者）
- ミントタイミング：3択確定の `resolve()` と **同一Tx**
- SBT：転送不可（Soulbound）
- メッセージ：`RegretVaultV2` にオンチェーン保存（tokenURIには含めない）
- tokenURI：最小限（外部サービスで余計な情報が表示されないことを優先）
- 画像：Material 3 風の **ダーク** PNG（1024x1024）。画像内の表示は「金額」と「承認日時（JST）」のみ
- 金額表示：基本小数4桁。`< 0.0001 ETH` の場合は `"<0.0001 ETH"` 表示
- 日時表示：`Approved YYYY/MM/DD HH:mm JST`（JST固定、ゼロ埋め）

## 1. 目的

Proof of Regret に「審判結果（3択）と供託金額（ETH）とメッセージ」を刻んだ SBT（Soulbound Token / 転送不可NFT）を追加する。

- 対象フロー：`/resolve/[id]`（審判者が3択を確定してトランザクション送信する画面）
- ミントタイミング：審判確定Tx（`resolve`）と **同一トランザクション** でミントする
- 受取人：**審判者（Judge / resolve 実行者）**
- SBT画像：Material Design（Material 3）寄りの **ダーク** で、画像内表示は **「承認日時（JST）」と「金額（小数4桁）」のみ**

## 2. 前提（現状コントラクトとの差分）

現行 `RegretVault` は `resolve()` の実行時に `apology.amount = 0` としてしまうため、解決後にオンチェーン上から「供託額」を参照できない。

本仕様では、審判後も参照できる「供託額」および「承認日時」を保持する必要があるため、`RegretVault` は **V2として改修・再デプロイ** を前提とする。

## 3. 用語

- **Sinner**：供託者（`deposit()` 実行者）
- **Judge**：審判者（`resolve()` 実行者）。共有リンクを開いた人が審判者となる
- **RegretId**：`deposit()` により採番される ID（uint256）
- **Outcome**：審判結果（Forgive / Reject / Punish）
- **SBT**：転送不可 ERC-721（Soulbound）

## 4. 要件

### 4.1 機能要件

1. `resolve(regretId, decision)` が成功した場合、同一Txで SBT を **必ず1枚** ミントする
2. SBT の保有者（owner）は **Judge** とする
3. 1つの RegretId につき SBT は最大1枚（重複ミント不可）
4. SBT の転送・承認（approve/transfer）は全て不可能（revert）とする
5. SBT のメタデータ（tokenURI）の JSON は「外部サービスで余計な情報が表示されない」ことを優先し、**最小限** とする
   - `name`（`Proof of Regret — Judgment #<tokenId>`）
   - `description`（短文。メッセージ等は含めない）
   - `image`（PNG。画像内に金額と承認日時のみ表示）

### 4.2 非機能要件

- 画像生成は **ブレゼロ（決定論）** を満たす
  - 外部フォント取得・乱数・環境ロケール依存を禁止
  - 同一入力（オンチェーンデータ）→同一 PNG バイト列
- JST 表示は常に日本時間（UTC+9固定）でフォーマットする
- 金額表示は ETH 小数 **4桁** を基本とし、丸め規則は固定する

## 5. データモデル（V2）

### 5.1 RegretVaultV2 の Apology

V2では審判後も参照できるよう、供託額と承認情報を保持する。

```
enum Outcome { Pending, Forgiven, Rejected, Punished }

struct Apology {
  address sender;          // Sinner
  uint256 amountDeposited; // 供託額（不変の記録）
  string message;          // 謝罪文（オンチェーン）
  Outcome outcome;         // Pending/...
  uint256 depositedAt;     // deposit時の block.timestamp
  address resolver;        // Judge（resolve実行者）
  uint256 resolvedAt;      // resolve時の block.timestamp（承認日時）
}
```

注：支払いのために別途「未払い残高」を保持する実装でもよいが、**参照用の供託額（amountDeposited）は不変**にする。

## 6. スマートコントラクト設計

### 6.1 構成

- `RegretVaultV2`（既存VaultのV2。審判確定＋送金＋SBTミントを担当）
- `RegretJudgmentSBT`（転送不可 ERC-721。tokenId=regretId）

### 6.2 RegretVaultV2 インターフェース（案）

- `deposit(string message) external payable returns (uint256 regretId)`
  - `msg.value > 0` 必須
  - `Apology` を作成し `amountDeposited = msg.value`、`depositedAt = block.timestamp`
  - `event Deposited(regretId, sender, amountDeposited)`

- `resolve(uint256 regretId, uint8 decision) external`
  - 未解決のみ
  - decision は `1..3`（Forgiven/Rejected/Punished）
  - `outcome/resolver/resolvedAt` を保存
  - 送金（Forgive: msg.sender / Reject: sender / Punish: burn）
  - **同一Txで** `RegretJudgmentSBT.mintToJudge(msg.sender, regretId)` を呼び出す
  - `event Resolved(regretId, outcome, resolver)`
  - `event SBTMinted(regretId, tokenId, judge)`

#### 実行順序（セキュリティ）

1) 状態更新（outcome/resolver/resolvedAt/支払済みフラグ）  
2) ETH送金（外部呼び出し）  
3) SBTミント（外部呼び出し）  

リエントランシー対策として、送金前に内部状態を完結させる。

### 6.3 RegretJudgmentSBT インターフェース（案）

- ERC-721 互換
- tokenId は `regretId`
- ミント権限は `RegretVaultV2` のみ

主な関数：
- `mintToJudge(address judge, uint256 regretId) external`
  - `msg.sender` が `RegretVaultV2` のみ
  - `regretId` が未ミントのみ
  - `_safeMint(judge, regretId)`

- `tokenURI(uint256 tokenId) public view returns (string)`
  - `baseURI + tokenId` を返す（オフチェーン生成に委譲）

#### 転送不可（Soulbound）

以下は全て revert させる：
- `approve`
- `setApprovalForAll`
- `transferFrom`
- `safeTransferFrom`

（任意）EIP-5192 `locked(tokenId) -> true` を実装してもよい。

## 7. メタデータ / 画像設計（オフチェーン生成）

### 7.1 エンドポイント

- `GET /api/metadata/[tokenId]`
  - `Content-Type: application/json`
  - 戻り値：ERC-721 metadata JSON

- `GET /api/image/[tokenId].png`
  - `Content-Type: image/png`
  - キャッシュ：`Cache-Control: public, max-age=31536000, immutable`

### 7.2 metadata JSON（例：項目定義）

- `name`：`Proof of Regret — Judgment #<tokenId>`
- `description`：固定の短文（**メッセージやアドレス、属性は含めない**）
  - 例：`A non-transferable Judgment SBT minted when the judge resolves a Proof of Regret.`
- `image`：`/api/image/<tokenId>.png`
- `attributes`：原則 **省略**（ウォレット/マーケットが表示する可能性があるため）

#### メッセージの表示方針（確定）

メッセージは `RegretVaultV2.getApology(tokenId)` から取得し、**アプリ内表示に限定**する。

- tokenURI（外部サービス向けメタデータ）にはメッセージを含めない
- SBTコントラクトに message を重複保存しない（ガス/ストレージ節約）

### 7.3 PNG 画像仕様（Material 3 / Dark / ブレゼロ）

#### 画像に表示する情報（2つのみ）

1) 金額：`<amountEthRounded4> ETH`  
2) 承認日時：`Approved YYYY/MM/DD HH:mm JST`

#### デザイン（固定）

- サイズ：1024x1024
- 背景：`#0B0F14`（フラット、乱数なし）
- カード：
  - 塗り：`#121826`
  - 角丸：28px
  - 枠線：`rgba(255,255,255,0.08)`
  - 影：固定値（乱数なし、1段）
- タイポグラフィ：
  - 金額：大きく、太字、`#E6EAF2`
  - 日時：中サイズ、`rgba(230,234,242,0.72)`

#### ブレゼロのための禁止事項

- 外部フォントのダウンロード（Google Fonts 等）
- ランダムノイズ/パーティクル/乱数グラデ
- `toLocaleString()` 等のロケール依存フォーマット（環境差が出る可能性）

#### フォント方針

フォントファイル（例：Roboto系）をリポジトリに同梱し、画像生成時に明示的に読み込む。

### 7.4 JST 変換とフォーマット（決定論）

承認日時は `resolvedAt`（UNIX秒）から求める。

- JST秒：`resolvedAt + 9*60*60`
- `Date` を使う場合は `new Date((resolvedAt + 9h) * 1000)` を **UTC扱い** で `getUTCFullYear()` 等を使用し、文字列を組み立てる
- フォーマット固定：`YYYY/MM/DD HH:mm JST`

### 7.5 金額表示（小数4桁）

- 元データ：`amountDeposited`（wei, uint256）
- 表示：ETHに変換し **小数4桁** を表示
- 丸め規則：四捨五入（half-up）を固定（例：5桁目が5以上なら繰り上げ）

極小額が `0.0000 ETH` になる問題を避けるため、以下を必須ルールとする：
- `amountEth < 0.0001` のときは `"<0.0001 ETH"` と表示する（この場合のみ桁数例外）
- それ以外は `0.0000`〜 の **小数4桁** 表示を行う

## 8. フロントエンド（表示要件）

### 8.1 Resolve 画面（審判確定後の表示）

現行の `CONFIRM DECISION` は `resolve()` のTx送信に該当する。

Tx成功後（receipt確認後）、画面上に「SBTカードのプレビュー」を表示する。

- 画像：`/api/image/<regretId>.png` をそのまま表示する
- テキスト：`Proof of Regret — Judgment #<regretId>` を表示する

備考：
- tokenURI は外部表示用の最小メタデータとして維持する
- メッセージは `RegretVaultV2.getApology(regretId)` を読み、アプリ内でのみ表示する（既存の文脈表示に統合）

### 8.2 SBT 表示ページ（任意）

- 必須ではない（外部リンク要件なし）
- 追加する場合は `/sbt/[id]` 等で `tokenURI` と画像を表示する程度の最小でよい

## 9. テスト計画（Foundry）

最低限：
- resolve(Forgive/Reject/Punish) それぞれで
  - outcome が更新される
  - 送金先が正しい
  - tokenId=regretId のSBTが judge にミントされる
  - 2回目の resolve / mint は失敗する
- SBT は transfer/approve が全て revert する

## 10. デプロイ/移行

- `RegretJudgmentSBT` を先にデプロイ
- `RegretVaultV2` をデプロイ（SBTアドレスをコンストラクタで固定）
- フロントの `REGRET_VAULT_ADDRESS` をV2に切替
- 既存 `RegretVault`（旧アドレス）との互換が必要な場合は「旧Vaultは参照のみ/審判不可」など運用方針を別途定義する
