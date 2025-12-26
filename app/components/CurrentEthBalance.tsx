// Connected wallet asset balance (Polygon Mainnet)
'use client';

import clsx from 'clsx';
import { useSyncExternalStore } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { polygon } from 'wagmi/chains';
import type { AssetConfig } from '../constants/assets';

function formatAssetShort(value: bigint, decimals: number, fractionDigits = 4) {
  const full = formatUnits(value, decimals);
  const [integer, fraction] = full.split('.');
  if (!fraction) return full;
  const trimmed = fraction.slice(0, fractionDigits).replace(/0+$/, '');
  return trimmed ? `${integer}.${trimmed}` : integer;
}

export function CurrentBalance({
  className,
  label = 'Balance (Polygon Mainnet)',
  asset,
}: {
  className?: string;
  label?: string;
  asset: AssetConfig;
}) {
  const { address, isConnected } = useAccount();
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const enabled = hasMounted && isConnected && Boolean(address);
  const isNative = asset.isNative;

  const { data, isLoading } = useBalance({
    address,
    chainId: polygon.id,
    token: isNative ? undefined : asset.address,
    query: { enabled, refetchInterval: 15_000 },
  });

  const displayValue = data?.value !== undefined ? formatAssetShort(data.value, asset.decimals) : null;

  if (!enabled) return null;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider',
        className
      )}
      title={data?.value !== undefined ? `${formatUnits(data.value, asset.decimals)} ${data?.symbol ?? asset.symbol}` : undefined}
    >
      <span className="text-[var(--color-pop-text-muted)]">{label}</span>
      <span className="text-[var(--color-pop-primary)] font-bold">
        {isLoading ? '…' : displayValue ?? '—'} {data?.symbol ?? asset.symbol}
      </span>
    </div>
  );
}
