// Lightweight wallet connect/dropdown replacement (no OnchainKit dependency)
'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface Props {
  isConnected: boolean;
  address?: string;
  isConnecting?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

function shortAddress(addr?: string) {
  if (!addr) return 'Connect Wallet';
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function SimpleWalletDropdown({
  isConnected,
  address,
  isConnecting,
  onConnect,
  onDisconnect,
}: Props) {
  const [open, setOpen] = useState(false);

  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={onConnect}
        disabled={isConnecting}
        className="!bg-black !border !border-[var(--color-pop-border)] !text-[var(--color-pop-text)] !font-[family-name:var(--font-display)] !rounded-none px-4 py-2 hover:!border-[var(--color-pop-primary)] hover:!text-[var(--color-pop-primary)] transition-colors"
      >
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="!bg-black !border !border-[var(--color-pop-border)] !text-[var(--color-pop-text)] !font-[family-name:var(--font-display)] !rounded-none px-4 py-2 hover:!border-[var(--color-pop-primary)] hover:!text-[var(--color-pop-primary)] transition-colors"
      >
        {shortAddress(address)}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-[var(--color-pop-surface)] border border-[var(--color-pop-border)] shadow-xl z-50"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-[var(--color-pop-border)]">
            <div className="text-xs text-[var(--color-pop-text-muted)]">Connected</div>
            <div className="font-mono text-sm text-white break-all">{address}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDisconnect();
            }}
            className={clsx(
              'w-full text-left px-4 py-3 uppercase text-sm font-[family-name:var(--font-display)]',
              'bg-black text-[var(--color-pop-error)] hover:bg-[var(--color-pop-error)]/10'
            )}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
