import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(_request: NextRequest) {
  const response = NextResponse.next();

  // X-Frame-Optionsを削除（Base Mini Appのiframe埋め込みを許可）
  response.headers.delete('X-Frame-Options');

  // Content-Security-Policyでframe-ancestorsを設定
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.base.dev https://*.farcaster.xyz https://*.warpcast.com *"
  );

  // CORS許可
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

export const config = {
  matcher: '/:path*',
};
