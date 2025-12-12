// 告白フロー管理用のカスタムフック

// biome-ignore assist/source/organizeImports: explain why this is needed
import { useMemo, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { REGRET_VAULT_ABI, REGRET_VAULT_ADDRESS } from '../constants';
import { Step } from '../types';
import { DEFAULT_AMOUNT } from '../constants/config';
import { extractApologyIdFromReceipt } from '../utils/transaction';
import { useBaseChainGate } from './useBaseChainGate';

export function useConfessionFlow() {
  const { isConnected } = useAccount();
  const { ensureBaseChain, isSwitchingChain } = useBaseChainGate();
  const [userStep, setUserStep] = useState<Step>(Step.CONFESS);
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [ignoredHash, setIgnoredHash] = useState<`0x${string}` | null>(null);

  const { data: hash, writeContract, isPending: isWriting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });

  const apologyId = useMemo(() => {
    if (!isSuccess || !receipt || !hash) return null;
    if (ignoredHash && hash === ignoredHash) return null;
    if (receipt.transactionHash && receipt.transactionHash !== hash) return null;
    return extractApologyIdFromReceipt(receipt);
  }, [hash, ignoredHash, isSuccess, receipt]);

  const isProcessing = isWriting || isConfirming;

  const step = useMemo(() => {
    if (!isConnected) return Step.INTRO;
    if (isProcessing) return Step.PROCESSING;
    if (apologyId) return Step.SUCCESS;
    return userStep;
  }, [isConnected, isProcessing, apologyId, userStep]);

  const handleDeposit = async () => {
    // 新規送信前に成功結果をクリア
    setIgnoredHash(null);

    const send = () => writeContract({
      address: REGRET_VAULT_ADDRESS,
      abi: REGRET_VAULT_ABI,
      functionName: 'deposit',
      args: [message],
      value: parseEther(amount),
    });

    await ensureBaseChain(send);
  };

  const resetFlow = () => {
    if (hash) setIgnoredHash(hash);
    setMessage('');
    setAmount(DEFAULT_AMOUNT);
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
    isConnected,
    isPending: isWriting || isSwitchingChain,
    isConfirming,
    writeError,
    setMessage,
    setAmount,
    handleDeposit,
    resetFlow,
    nextStep,
    prevStep,
  };
}
