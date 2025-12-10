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
    <header className="fixed top-0 left-0 w-full p-4 z-50 pointer-events-none">
      <div className="flex justify-between items-start max-w-7xl mx-auto">
        {/* Logo */}
        <div className="bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pointer-events-auto">
          <h1 className="font-pixel text-xl md:text-2xl leading-none">
            後悔の証明<br/>PROOF_OF_REGRET.EXE
          </h1>
        </div>

        {/* Wallet / Player Stats */}
        <div className="pointer-events-auto">
          <div className="bg-white border-4 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <Wallet>
              <ConnectWallet className="bg-transparent text-black font-pixel text-xs px-2 py-2 hover:bg-neutral-100 transition-all !rounded-none">
                <span className="mr-2">プレイヤー1</span>
                <Avatar className="h-6 w-6 rounded-none border-2 border-black" />
                <Name className="font-vt323 text-lg" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2 bg-white" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect className="bg-red-500 text-white font-pixel hover:bg-red-600" />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </div>
    </header>
  );
}
