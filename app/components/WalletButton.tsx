// ウォレット接続ボタンの共通コンポーネント

'use client';

import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Identity, Address, EthBalance } from '@coinbase/onchainkit/identity';
import clsx from 'clsx';

interface WalletButtonProps {
  isConnected: boolean;
  className?: string;
  variant?: 'default' | 'minimal';
}

export function WalletButton({ isConnected, className, variant = 'default' }: WalletButtonProps) {
  if (variant === 'minimal') {
    return (
      <Wallet>
        <ConnectWallet className="bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all px-6 py-3 rounded-full hover:scale-105 active:scale-95">
          <Avatar className="h-6 w-6 rounded-full" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    );
  }

  return (
    <div className={clsx("fixed top-6 right-6 z-[60]", isConnected ? "opacity-0 pointer-events-none" : "opacity-100", className)}>
      <Wallet>
        <ConnectWallet className="material-btn material-btn-filled !py-4 !px-8 !rounded-full shadow-lg">
          <span className="text-base">Wallet Connect</span>
          <Avatar className="h-0 w-0" />
          <Name className="h-0 w-0 hidden" />
        </ConnectWallet>
        <WalletDropdown className="!rounded-2xl !shadow-xl !mt-2">
          <Identity hasCopyAddressOnClick className="!bg-[var(--md-sys-color-surface)]">
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect className="!bg-[var(--md-sys-color-error-container)] !text-[var(--md-sys-color-on-error-container)]" />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}







