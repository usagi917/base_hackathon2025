import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

import { REGRET_VAULT_ABI, REGRET_VAULT_ADDRESS } from '../../../constants';
import type { Apology } from '../../../types';

export const runtime = 'nodejs';

const NOTO_SANS_TTF = path.join(
  process.cwd(),
  'node_modules',
  'next',
  'dist',
  'compiled',
  '@vercel',
  'og',
  'noto-sans-v27-latin-regular.ttf'
);

function tokenIdFromParam(raw: unknown) {
  if (typeof raw !== 'string') return null;
  const match = raw.match(/^(\d+)/);
  if (!match) return null;
  try {
    return BigInt(match[1]);
  } catch {
    return null;
  }
}

function pad2(value: number) {
  return value < 10 ? `0${value}` : String(value);
}

function formatApprovedJst(unixSeconds: bigint) {
  if (unixSeconds <= 0n) return 'Approved ----/--/-- --:-- JST';
  const jstSeconds = unixSeconds + 9n * 60n * 60n;
  const date = new Date(Number(jstSeconds) * 1000);
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  const hh = pad2(date.getUTCHours());
  const mm = pad2(date.getUTCMinutes());
  return `Approved ${y}/${m}/${d} ${hh}:${mm} JST`;
}

function formatEth4(wei: bigint) {
  const threshold = 100_000_000_000_000n; // 0.0001 ETH in wei
  if (wei > 0n && wei < threshold) return '<0.0001 ETH';

  const scale = 10_000n;
  const divisor = 1_000_000_000_000_000_000n;
  const numerator = wei * scale;
  let scaled = numerator / divisor;
  const remainder = numerator % divisor;
  if (remainder * 2n >= divisor) scaled += 1n;

  const whole = scaled / scale;
  const frac = scaled % scale;
  return `${whole.toString()}.${frac.toString().padStart(4, '0')} ETH`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { tokenId: string } | Promise<{ tokenId: string }> }
) {
  const { tokenId: rawTokenId } = await params;
  const tokenId = tokenIdFromParam(rawTokenId);
  if (tokenId === null) return new Response('Invalid tokenId', { status: 400 });
  if (REGRET_VAULT_ADDRESS === ('0x0000000000000000000000000000000000000000' as const)) {
    return new Response('RegretVaultV2 address not configured', { status: 500 });
  }

  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL;
  const client = createPublicClient({
    chain: baseSepolia,
    transport: rpcUrl ? http(rpcUrl) : http(),
  });

  const apology = await client.readContract({
    address: REGRET_VAULT_ADDRESS,
    abi: REGRET_VAULT_ABI,
    functionName: 'getApology',
    args: [tokenId],
  }) as unknown as Apology;

  const fontData = await readFile(NOTO_SANS_TTF);

  const amountWei = apology.amountDeposited;
  const resolvedAt = apology.resolvedAt;

  const amountText = formatEth4(BigInt(amountWei));
  const approvedText = formatApprovedJst(BigInt(resolvedAt));

  const response = new ImageResponse(
    (
      <div
        style={{
          width: '1024px',
          height: '1024px',
          backgroundColor: '#0B0F14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '880px',
            height: '520px',
            backgroundColor: '#121826',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0px 16px 40px rgba(0,0,0,0.55)',
            padding: '64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '24px',
            fontFamily: 'Noto Sans',
          }}
        >
          <div
            style={{
              fontSize: '88px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#E6EAF2',
              lineHeight: 1.05,
            }}
          >
            {amountText}
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 500,
              color: 'rgba(230,234,242,0.72)',
              letterSpacing: '-0.01em',
            }}
          >
            {approvedText}
          </div>
        </div>
      </div>
    ),
    {
      width: 1024,
      height: 1024,
      fonts: [
        {
          name: 'Noto Sans',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );

  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  response.headers.set('Content-Type', 'image/png');
  response.headers.set('Vary', 'Accept-Encoding');

  return response;
}
