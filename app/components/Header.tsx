// 共通ヘッダーコンポーネント

'use client';

// biome-ignore assist/source/organizeImports: <explanation>
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Identity, Address, EthBalance } from '@coinbase/onchainkit/identity';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[var(--md-sys-color-background)]/80 backdrop-blur-md border-b border-[var(--md-sys-color-outline)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-tight text-[var(--md-sys-color-primary)] font-sans">
            後悔の証明 <span className="font-light text-[var(--md-sys-color-secondary)] ml-2 text-sm hidden sm:inline">Proof of Regret</span>
          </h1>
        </div>

        {/* Wallet / Player Stats */}
        <div className="flex items-center gap-4">
          <Wallet>
            <ConnectWallet className="!bg-[var(--md-sys-color-primary-container)] !text-[var(--md-sys-color-on-primary-container)] !font-medium !rounded-full !px-4 !py-2 hover:!bg-[var(--md-sys-color-primary)] hover:!text-white transition-all shadow-sm">
              <Avatar className="h-6 w-6 rounded-full mr-2" />
              <Name className="text-sm font-medium" />
            </ConnectWallet>
            <WalletDropdown className="!rounded-2xl !shadow-lg !border-none !mt-2 overflow-hidden">
              <Identity className="px-4 pt-4 pb-3 bg-[var(--md-sys-color-surface)]" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect className="!bg-[var(--md-sys-color-error-container)] !text-[var(--md-sys-color-on-error-container)] hover:!bg-[var(--md-sys-color-error)] hover:!text-white transition-colors" />
            </WalletDropdown>
          </Wallet>
        </div>
      </div>
    </header>
  );
}
