import { NextRequest } from 'next/server';

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

export async function GET(
  _req: NextRequest,
  { params }: { params: { tokenId: string } | Promise<{ tokenId: string }> }
) {
  const { tokenId: rawTokenId } = await params;
  const tokenId = tokenIdFromParam(rawTokenId);
  if (tokenId === null) return Response.json({ error: 'Invalid tokenId' }, { status: 400 });

  const origin = (() => {
    try {
      return new URL(_req.url).origin;
    } catch {
      return '';
    }
  })();

  return Response.json(
    {
      name: `Proof of Regret — Judgment #${tokenId.toString()}`,
      description: 'A non-transferable Judgment SBT minted when the judge resolves a Proof of Regret.',
      image: `${origin}/api/image/${tokenId.toString()}`,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
