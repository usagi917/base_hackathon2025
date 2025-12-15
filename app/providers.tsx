'use client';

import { ReactNode, useState, useEffect } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { sdk } from '@farcaster/miniapp-sdk';

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    const [wagmiConfig] = useState(() => createConfig({
        chains: [baseSepolia],
        transports: {
            [baseSepolia.id]: http(),
        },
        connectors: [
            injected(),
            coinbaseWallet({
                appName: 'Proof of Regret',
            }),
        ],
    }));

    useEffect(() => {
        // アプリの準備が完了したことをBase Mini Appに通知
        sdk.actions.ready();
    }, []);

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    chain={baseSepolia}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
