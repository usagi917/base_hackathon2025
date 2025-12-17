import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OpenGraphImage({ params }: { params: Promise<{ id: string }> }) {
  const rawParams = await Promise.resolve(params);
  const rawId = rawParams.id ?? '';
  const decodedId = (() => {
    try {
      return decodeURIComponent(rawId);
    } catch {
      return rawId;
    }
  })();

  const normalizedId = /^\d+$/.test(decodedId) ? decodedId : decodedId.match(/^(\d+)\W+$/u)?.[1] ?? decodedId;
  const isValidId = /^\d+$/.test(normalizedId);
  const badgeText = isValidId ? `#${normalizedId}` : 'INVALID';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          backgroundColor: '#050505',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            borderRadius: '28px',
            border: '2px solid rgba(204,255,0,0.35)',
            background:
              'linear-gradient(135deg, rgba(204,255,0,0.14), rgba(217,70,239,0.10) 55%, rgba(6,182,212,0.10))',
            padding: '44px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.65)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.78)', letterSpacing: '0.6px' }}>
                Proof of Regret
              </div>
              <div style={{ fontSize: '46px', color: '#CCFF00', fontWeight: 800, lineHeight: 1 }}>
                審判を下す
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 16px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.18)',
                backgroundColor: 'rgba(0,0,0,0.35)',
                color: 'rgba(255,255,255,0.92)',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {badgeText}
            </div>
          </div>

          <div style={{ fontSize: '26px', lineHeight: 1.35, color: 'rgba(255,255,255,0.92)' }}>
            このリンクを開いた人が審判者になります。
            <br />
            選択ひとつで、供物（ETH）の行方が決まります。
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.14)',
                backgroundColor: 'rgba(0,0,0,0.35)',
                color: 'rgba(255,255,255,0.88)',
                fontSize: '18px',
              }}
            >
              Forgive / Reject / Punish
            </div>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.14)',
                backgroundColor: 'rgba(0,0,0,0.35)',
                color: 'rgba(255,255,255,0.88)',
                fontSize: '18px',
              }}
            >
              Base Mainnet
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
