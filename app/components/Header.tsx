// Serious Pop Header
'use client';

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Identity, Address, EthBalance } from '@coinbase/onchainkit/identity';
import { motion } from 'framer-motion';

export function Header() {
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
          <Wallet>
            <ConnectWallet 
              className="!bg-black !border !border-[var(--color-pop-border)] !text-[var(--color-pop-text)] !font-[family-name:var(--font-display)] !rounded-none hover:!border-[var(--color-pop-primary)] hover:!text-[var(--color-pop-primary)] transition-colors"
            >
              <Avatar className="h-6 w-6 rounded-none" />
              <Name className="hidden sm:inline font-bold" />
            </ConnectWallet>
            <WalletDropdown 
              className="!bg-[var(--color-pop-surface)] !border !border-[var(--color-pop-border)] !rounded-none !mt-2"
            >
              <Identity 
                className="px-4 pt-4 pb-3 bg-[var(--color-pop-surface)] border-b border-[var(--color-pop-border)]" 
                hasCopyAddressOnClick
              >
                <Avatar className="!w-12 !h-12 !rounded-none" />
                <Name className="!font-bold !font-[family-name:var(--font-display)] !text-[var(--color-pop-text)]" />
                <Address className="!text-[var(--color-pop-text-muted)]" />
                <EthBalance className="!text-[var(--color-pop-primary)] !font-bold" />
              </Identity>
              <WalletDropdownDisconnect 
                className="!m-0 !rounded-none !bg-black !text-[var(--color-pop-error)] hover:!bg-[var(--color-pop-error)]/10 !font-[family-name:var(--font-display)] uppercase !border-t !border-[var(--color-pop-border)]" 
              />
            </WalletDropdown>
          </Wallet>
        </motion.div>
      </div>
    </header>
  );
}
