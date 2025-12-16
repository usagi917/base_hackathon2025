// Serious Pop Header
'use client';

import { motion } from 'framer-motion';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { CurrentEthBalance } from './CurrentEthBalance';
import { SimpleWalletDropdown } from './SimpleWalletDropdown';

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const primaryConnector =
    connectors.find((c) => c.id === 'coinbaseWalletSDK') ||
    connectors.find((c) => c.id === 'injected') ||
    connectors[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-pop-border)] bg-[var(--color-pop-bg)]/80 backdrop-blur-md">
      <div className="por-container h-16 flex items-center justify-between">
        {/* Leading: Brand */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Logo mark */}
          <div className="relative w-8 h-8 flex items-center justify-center bg-[var(--color-pop-primary)] text-black font-bold font-[family-name:var(--font-display)]">
            PoR
          </div>
          
          {/* Title section */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold uppercase tracking-wider text-[var(--color-pop-text)] font-[family-name:var(--font-display)]">
              Proof of Regret
            </h1>
          </div>
        </motion.div>

        {/* Trailing: Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3">
            <CurrentEthBalance
              className="hidden sm:inline-flex px-3 py-1 border border-[var(--color-pop-border)] bg-[var(--color-pop-surface)]/30"
              label="BASE SEPOLIA"
            />
            <SimpleWalletDropdown
              isConnected={isConnected}
              address={address}
              onConnect={() => primaryConnector && connect({ connector: primaryConnector })}
              onDisconnect={() => disconnect()}
              isConnecting={isPending || !primaryConnector}
            />
          </div>
        </motion.div>
      </div>
    </header>
  );
}
