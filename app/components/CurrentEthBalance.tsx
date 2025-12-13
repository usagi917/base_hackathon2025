// Connected wallet ETH balance (Base Sepolia)
'use client';

import clsx from 'clsx';
import { useSyncExternalStore } from 'react';
import { formatEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

function formatEthShort(value: bigint, fractionDigits = 4) {
  const full = formatEther(value);
  const [integer, fraction] = full.split('.');
  if (!fraction) return full;
  const trimmed = fraction.slice(0, fractionDigits).replace(/0+$/, '');
  return trimmed ? `${integer}.${trimmed}` : integer;
}

export function CurrentEthBalance({
  className,
  label = 'Balance (Base Sepolia)',
}: {
  className?: string;
  label?: string;
}) {
  const { address, isConnected } = useAccount();
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const enabled = hasMounted && isConnected && Boolean(address);

  const { data, isLoading } = useBalance({
    address,
    chainId: baseSepolia.id,
    query: { enabled, refetchInterval: 15_000 },
  });

  const displayValue = data?.value !== undefined ? formatEthShort(data.value) : null;

  if (!enabled) return null;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider',
        className
      )}
      title={data?.value !== undefined ? `${formatEther(data.value)} ${data?.symbol ?? 'ETH'}` : undefined}
    >
      <span className="text-[var(--color-pop-text-muted)]">{label}</span>
      <span className="text-[var(--color-pop-primary)] font-bold">
        {isLoading ? '…' : displayValue ?? '—'} {data?.symbol ?? 'ETH'}
      </span>
    </div>
  );
}
