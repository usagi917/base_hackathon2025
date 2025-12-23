// アプリケーション設定定数

// デフォルトの贖罪金額（選択資産の単位）
export const DEFAULT_AMOUNT = '0.001';

// マウスフォロワーのスプリング設定
export const MOUSE_SPRING_CONFIG = {
  damping: 20,
  stiffness: 300
} as const;

// 背景グラデーションのサイズ
export const BACKGROUND_SIZE = {
  width: 600,
  height: 600
} as const;

// メッセージの最大文字数（オプション）
export const MAX_MESSAGE_LENGTH = 1000;
