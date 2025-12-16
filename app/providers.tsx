'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';
import { sdk } from '@farcaster/miniapp-sdk';

export function Providers({
    children,
    rpcUrl,
}: {
    children: ReactNode;
    rpcUrl?: string;
}) {
    const [queryClient] = useState(() => new QueryClient());

    const [wagmiConfig] = useState(() => createConfig({
        chains: [baseSepolia],
        transports: {
            [baseSepolia.id]: rpcUrl ? http(rpcUrl) : http(),
        },
        connectors: [
            metaMask(),
            coinbaseWallet({
                appName: 'Proof of Regret',
            }),
        ],
    }));

    useEffect(() => {
        // アプリの準備が完了したことをBase Mini Appに通知
        const initializeMiniApp = async () => {
            try {
                console.log('[Mini App] Calling sdk.actions.ready()...');
                await sdk.actions.ready();
                console.log('[Mini App] sdk.actions.ready() called successfully');
            } catch (error) {
                console.error('[Mini App] Error calling sdk.actions.ready():', error);
            }
        };

        initializeMiniApp();
    }, []);

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
