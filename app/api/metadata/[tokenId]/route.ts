import { NextRequest } from 'next/server';

import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

import { REGRET_VAULT_ABI, REGRET_VAULT_ADDRESS } from '../../../constants';
import { Outcome, type Apology } from '../../../types';

export const runtime = 'nodejs';

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

function outcomeLabel(outcome: number) {
  switch (outcome) {
    case Outcome.Forgiven:
      return '和解';
    case Outcome.Rejected:
      return '断罪';
    case Outcome.Punished:
      return '憤怒';
    default:
      return '未決';
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId: rawTokenId } = await params;
  const tokenId = tokenIdFromParam(rawTokenId);
  if (tokenId === null) return Response.json({ error: 'Invalid tokenId' }, { status: 400 });
  if (REGRET_VAULT_ADDRESS === ('0x0000000000000000000000000000000000000000' as const)) {
    return Response.json({ error: 'RegretVaultV2 address not configured' }, { status: 500 });
  }

  const origin = (() => {
    try {
      return new URL(_req.url).origin;
    } catch {
      return '';
    }
  })();

  const rpcUrl = process.env.BASE_MAINNET_RPC_URL;
  const client = createPublicClient({
    chain: base,
    transport: rpcUrl ? http(rpcUrl) : http(),
  });

  let apology: Apology;
  try {
    apology = (await client.readContract({
      address: REGRET_VAULT_ADDRESS,
      abi: REGRET_VAULT_ABI,
      functionName: 'getApology',
      args: [tokenId],
    })) as unknown as Apology;
  } catch {
    return Response.json(
      { error: 'Failed to fetch on-chain metadata' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const depositedAt = BigInt(apology.depositedAt ?? 0);
  if (depositedAt === 0n) {
    return Response.json({ error: 'Token not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }

  const outcomeInt = Number(apology.outcome ?? Outcome.Pending);
  const judgment = outcomeLabel(outcomeInt);

  return Response.json(
    {
      name: `Proof of Regret — Judgment #${tokenId.toString()} — ${judgment}`,
      description: 'A non-transferable Judgment SBT minted when the judge resolves a Proof of Regret.',
      image: `${origin}/api/image/${tokenId.toString()}`,
      attributes: [
        { trait_type: '判決', value: judgment },
      ],
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
