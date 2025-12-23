// 告白フロー管理用のカスタムフック

// biome-ignore assist/source/organizeImports: explain why this is needed
import { useMemo, useState, useSyncExternalStore } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { base } from 'wagmi/chains';
import { parseUnits } from 'viem';
import { REGRET_VAULT_ABI, REGRET_VAULT_ADDRESS } from '../constants';
import { Step } from '../types';
import { DEFAULT_AMOUNT } from '../constants/config';
import { DEFAULT_ASSET, SUPPORTED_ASSETS } from '../constants/assets';
import { extractApologyIdFromReceipt } from '../utils/transaction';
import { useBaseChainGate } from './useBaseChainGate';

export function useConfessionFlow() {
  const { isConnected } = useAccount();
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const { ensureBaseChain, isSwitchingChain } = useBaseChainGate();
  const [userStep, setUserStep] = useState<Step>(Step.CONFESS);
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [assetId, setAssetId] = useState<string>(DEFAULT_ASSET.id);
  const [ignoredHash, setIgnoredHash] = useState<`0x${string}` | null>(null);

  const { data: hash, writeContract, isPending: isWriting, error: writeError } = useWriteContract();
  // Always watch the tx on Base Mainnet so the success step is reached even if the wallet
  // temporarily switches networks (e.g. to Base Sepolia).
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
    chainId: base.id,
  });

  // Wallet connection status can differ between server render and the first client render
  // (wagmi may hydrate from persisted client state). Gate it until after mount to
  // keep the initial HTML deterministic and avoid hydration mismatches.
  const isWalletConnected = hasMounted ? isConnected : false;

  const apologyId = useMemo(() => {
    if (!isSuccess || !receipt || !hash) return null;
    if (ignoredHash && hash === ignoredHash) return null;
    if (receipt.transactionHash && receipt.transactionHash !== hash) return null;
    return extractApologyIdFromReceipt(receipt);
  }, [hash, ignoredHash, isSuccess, receipt]);

  const isProcessing = isWriting || isConfirming;

  const step = useMemo(() => {
    if (!isWalletConnected) return Step.INTRO;
    if (isProcessing) return Step.PROCESSING;
    if (apologyId) return Step.SUCCESS;
    return userStep;
  }, [isWalletConnected, isProcessing, apologyId, userStep]);

  const handleDeposit = async () => {
    // 新規送信前に成功結果をクリア
    setIgnoredHash(null);

    const selectedAsset = SUPPORTED_ASSETS.find((asset) => asset.id === assetId) ?? DEFAULT_ASSET;
    const parsedAmount = parseUnits(amount || '0', selectedAsset.decimals);

    const send = () => writeContract({
      address: REGRET_VAULT_ADDRESS,
      abi: REGRET_VAULT_ABI,
      functionName: 'deposit',
      args: [message, selectedAsset.address, parsedAmount],
      value: selectedAsset.isNative ? parsedAmount : 0n,
    });

    await ensureBaseChain(send);
  };

  const resetFlow = () => {
    if (hash) setIgnoredHash(hash);
    setMessage('');
    setAmount(DEFAULT_AMOUNT);
    setAssetId(DEFAULT_ASSET.id);
    setUserStep(Step.CONFESS);
  };

  const nextStep = () => {
    if (userStep === Step.CONFESS && !message.trim()) return;
    
    // ステップを次のステップに進める
    const nextStepValue = userStep + 1;
    if (nextStepValue <= Step.SUCCESS) {
      setUserStep(nextStepValue as Step);
    }
  };

  const prevStep = () => {
    // ステップを前のステップに戻す
    const prevStepValue = userStep - 1;
    if (prevStepValue >= Step.INTRO) {
      setUserStep(prevStepValue as Step);
    }
  };

  return {
    step,
    message,
    amount,
    apologyId,
    isConnected: isWalletConnected,
    isPending: isWriting || isSwitchingChain,
    isConfirming,
    writeError,
    setMessage,
    setAmount,
    assetId,
    setAssetId,
    handleDeposit,
    resetFlow,
    nextStep,
    prevStep,
  };
}
