// 告白フロー管理用のカスタムフック

// biome-ignore assist/source/organizeImports: explain why this is needed
import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { parseEther } from 'viem';
import { REGRET_VAULT_ABI, REGRET_VAULT_ADDRESS } from '../constants';
import { Step } from '../types';
import { DEFAULT_AMOUNT } from '../constants/config';
import { extractApologyIdFromReceipt } from '../utils/transaction';

export function useConfessionFlow() {
  const { isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [step, setStep] = useState<Step>(Step.INTRO);
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [apologyId, setApologyId] = useState<string | null>(null);
  const [pendingDeposit, setPendingDeposit] = useState<{ message: string; amount: string } | null>(null);

  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });

  // ウォレット接続時にBase Sepoliaに自動切り替え
  useEffect(() => {
    if (isConnected && chain && chain.id !== baseSepolia.id) {
      switchChain({ chainId: baseSepolia.id });
    }
  }, [isConnected, chain, switchChain]);

  // ネットワークがBase Sepoliaに切り替わったら、保留中の送信を実行
  useEffect(() => {
    if (pendingDeposit && chain && chain.id === baseSepolia.id) {
      // ネットワークが正しく切り替わったら送信
      writeContract({
        address: REGRET_VAULT_ADDRESS,
        abi: REGRET_VAULT_ABI,
        functionName: 'deposit',
        args: [pendingDeposit.message],
        value: parseEther(pendingDeposit.amount),
      });
      setPendingDeposit(null);
    }
  }, [chain, pendingDeposit, writeContract]);

  // ウォレット接続状態に応じてステップを更新
  useEffect(() => {
    if (!isConnected) {
      setStep(Step.INTRO);
    } else if (step === Step.INTRO && isConnected) {
      // 接続されていればCONFESSステップに進む（ネットワーク切り替えは別で処理）
      setStep(Step.CONFESS);
    }
  }, [isConnected, step]);

  // トランザクション処理中はPROCESSINGステップに
  useEffect(() => {
    if (isPending || isConfirming) {
      setStep(Step.PROCESSING);
    }
  }, [isPending, isConfirming]);

  // トランザクション成功時にIDを抽出してSUCCESSステップに
  useEffect(() => {
    if (isSuccess && receipt) {
      const id = extractApologyIdFromReceipt(receipt);
      if (id) {
        setApologyId(id);
        setStep(Step.SUCCESS);
      }
    }
  }, [isSuccess, receipt]);

  const handleDeposit = async () => {
    // 送信前にネットワークがBase Sepoliaか確認
    if (!chain || chain.id !== baseSepolia.id) {
      // Base Sepoliaに切り替え、送信情報を保留
      setPendingDeposit({ message, amount });
      try {
        await switchChain({ chainId: baseSepolia.id });
      } catch (error) {
        // ネットワーク切り替えが拒否された場合
        setPendingDeposit(null);
        console.error('ネットワーク切り替えが拒否されました:', error);
      }
      return;
    }
    
    // Base Sepoliaで送信
    writeContract({
      address: REGRET_VAULT_ADDRESS,
      abi: REGRET_VAULT_ABI,
      functionName: 'deposit',
      args: [message],
      value: parseEther(amount),
    });
  };

  const resetFlow = () => {
    setApologyId(null);
    setMessage('');
    setAmount(DEFAULT_AMOUNT);
    setStep(Step.CONFESS);
  };

  const nextStep = () => {
    if (step === Step.CONFESS && !message.trim()) return;
    
    // ステップを次のステップに進める
    const nextStepValue = step + 1;
    if (nextStepValue <= Step.SUCCESS) {
      setStep(nextStepValue as Step);
    }
  };

  const prevStep = () => {
    // ステップを前のステップに戻す
    const prevStepValue = step - 1;
    if (prevStepValue >= Step.INTRO) {
      setStep(prevStepValue as Step);
    }
  };

  return {
    step,
    message,
    amount,
    apologyId,
    isConnected,
    isPending,
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

