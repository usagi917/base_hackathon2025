'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';

type QueuedAction = () => void;

/**
 * Small helper hook that keeps the app anchored to Base Sepolia and
 * optionally queues an action until the chain switch succeeds.
 */
export function useBaseChainGate() {
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();

  const queuedActionRef = useRef<QueuedAction | null>(null);

  const isOnBase = chain?.id === base.id;

  const ensureBaseChain = useCallback(
    async (action?: QueuedAction) => {
      if (isOnBase) {
        action?.();
        return true;
      }

      if (action) queuedActionRef.current = action;

      try {
        await switchChain({ chainId: base.id });
        return true;
      } catch {
        // User declined or wallet rejected the switch
        if (action) queuedActionRef.current = null;
        return false;
      }
    },
    [isOnBase, switchChain]
  );

  // Execute queued action once the network is correct and not actively switching.
  useEffect(() => {
    if (isOnBase && queuedActionRef.current && !isPending) {
      const action = queuedActionRef.current;
      queuedActionRef.current = null;
      action();
    }
  }, [isOnBase, isPending]);

  // Clear queued actions if the wallet disconnects.
  useEffect(() => {
    if (!isConnected) {
      queuedActionRef.current = null;
    }
  }, [isConnected]);

  return {
    isOnBase,
    isSwitchingChain: isPending,
    switchError: error,
    ensureBaseChain,
  };
}
