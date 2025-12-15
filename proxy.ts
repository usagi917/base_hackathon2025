import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(_request: NextRequest) {
  // レスポンスを取得
  const response = NextResponse.next();

  // すべてのセキュリティヘッダーを明示的に管理
  // X-Frame-Optionsを削除してContent-Security-Policyで代替
  response.headers.delete('X-Frame-Options');
  response.headers.delete('x-frame-options');

  // Content-Security-Policyでframe-ancestorsを設定（iframe埋め込み許可）
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.base.dev https://*.farcaster.xyz https://*.warpcast.com *"
  );

  // CORS許可（すべてのオリジンから）
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
