// Lightweight wallet connect/dropdown replacement (no OnchainKit dependency)
'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { Connector } from 'wagmi';

interface Props {
  isConnected: boolean;
  address?: string;
  isConnecting?: boolean;
  connectors: readonly Connector[];
  onConnect: (connector: Connector) => void;
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
  connectors,
  onConnect,
  onDisconnect,
}: Props) {
  const [open, setOpen] = useState(false);

  const orderedConnectors = useMemo(() => {
    const priority = (id: string) => {
      if (id === 'metaMaskSDK' || id === 'metaMask') return 0;
      if (id === 'coinbaseWalletSDK' || id === 'coinbaseWallet') return 1;
      return 10;
    };
    return [...connectors].sort((a, b) => priority(a.id) - priority(b.id));
  }, [connectors]);

  if (!isConnected) {
    const hasOptions = orderedConnectors.length > 1;
    const soleConnector = orderedConnectors[0];
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (isConnecting) return;
            if (!soleConnector) return;
            if (!hasOptions) onConnect(soleConnector);
            else setOpen((v) => !v);
          }}
          disabled={isConnecting || orderedConnectors.length === 0}
          className="!bg-black !border !border-[var(--color-pop-border)] !text-[var(--color-pop-text)] !font-[family-name:var(--font-display)] !rounded-none px-4 py-2 hover:!border-[var(--color-pop-primary)] hover:!text-[var(--color-pop-primary)] transition-colors disabled:opacity-60"
        >
          {isConnecting ? 'Connecting…' : 'Connect Wallet'}
        </button>

        {open && hasOptions && (
          <div
            className="absolute right-0 mt-2 w-56 bg-[var(--color-pop-surface)] border border-[var(--color-pop-border)] shadow-xl z-50"
            role="menu"
          >
            <div className="px-4 py-3 border-b border-[var(--color-pop-border)]">
              <div className="text-xs text-[var(--color-pop-text-muted)]">Choose Wallet</div>
            </div>
            {orderedConnectors.map((connector) => (
              <button
                key={connector.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onConnect(connector);
                }}
                disabled={isConnecting}
                className={clsx(
                  'w-full text-left px-4 py-3 uppercase text-sm font-[family-name:var(--font-display)]',
                  'bg-black text-[var(--color-pop-text)] hover:bg-white/5',
                  'disabled:opacity-60 disabled:hover:bg-black'
                )}
              >
                {connector.name}
              </button>
            ))}
          </div>
        )}
      </div>
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
