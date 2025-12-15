import { NextResponse } from 'next/server';

export default function middleware() {
  const response = NextResponse.next();

  // すべてのセキュリティヘッダーを明示的に管理
  // Vercel等がデフォルトで `X-Frame-Options: DENY` を付与する場合があるため、
  // あえて無効値を設定してブラウザに無視させ、CSP(frame-ancestors)で制御する。
  response.headers.set('X-Frame-Options', 'ALLOWALL');

  // Content-Security-Policyでframe-ancestorsを設定（iframe埋め込み許可）
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.base.dev https://*.farcaster.xyz https://*.warpcast.com *"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * すべてのパスにマッチ、ただし以下を除く:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化ファイル)
     * - favicon.ico (ファビコン)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
