// ウォレット接続ボタンの共通コンポーネント

'use client';

import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Identity, Address, EthBalance } from '@coinbase/onchainkit/identity';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface WalletButtonProps {
  isConnected: boolean;
  className?: string;
  variant?: 'default' | 'minimal';
}

export function WalletButton({ isConnected, className, variant = 'default' }: WalletButtonProps) {
  if (variant === 'minimal') {
    return (
      <Wallet>
        <ConnectWallet className="bg-white/10 border-2 border-white/10 text-white font-bold hover:bg-white/20 transition-all px-6 py-3 rounded-full hover:scale-105 active:scale-95">
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
        <ConnectWallet className="bg-white text-black font-black px-8 py-4 rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
          <span className="text-base">Wallet Connect</span>
          <Avatar className="h-0 w-0" />
          <Name className="h-0 w-0 hidden" />
        </ConnectWallet>
        <WalletDropdown>
          <Identity hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}

