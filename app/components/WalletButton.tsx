// ウォレット接続ボタン（OnchainKit なし）

'use client';

import clsx from 'clsx';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface WalletButtonProps {
  isConnected: boolean;
  className?: string;
  variant?: 'default' | 'minimal';
}

const shorten = (addr?: string) => (addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '');

export function WalletButton({ isConnected, className, variant = 'default' }: WalletButtonProps) {
  const { address } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const primaryConnector =
    connectors.find((c) => c.id === 'coinbaseWalletSDK') ||
    connectors.find((c) => c.id === 'injected') ||
    connectors[0];

  const handleConnect = () => {
    if (!primaryConnector) return;
    connect({ connector: primaryConnector });
  };

  if (variant === 'minimal') {
    return (
      <div className={clsx('relative', className)}>
        {!isConnected ? (
          <button
            type="button"
            onClick={handleConnect}
            disabled={isPending || !primaryConnector}
            className="bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all px-6 py-3 rounded-full hover:scale-105 active:scale-95 disabled:opacity-60"
          >
            {isPending ? 'Connecting…' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="inline-flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-full">
            <span className="text-white font-semibold">{shorten(address)}</span>
            <button
              type="button"
              onClick={() => disconnect()}
              className="text-sm text-red-300 hover:text-red-200 underline"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={clsx("fixed top-6 right-6 z-[60]", isConnected ? "opacity-0 pointer-events-none" : "opacity-100", className)}>
      <button
        type="button"
        onClick={handleConnect}
        disabled={isPending || !primaryConnector}
        className="material-btn material-btn-filled !py-4 !px-8 !rounded-full shadow-lg disabled:opacity-60"
      >
        {isPending ? 'Connecting…' : 'Wallet Connect'}
      </button>
      {isConnected && (
        <div className="mt-2 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl shadow-xl p-4">
          <div className="font-mono text-sm text-[var(--md-sys-color-on-surface)]">{shorten(address)}</div>
          <button
            type="button"
            onClick={() => disconnect()}
            className="mt-3 text-sm text-[var(--md-sys-color-error)] underline"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}






