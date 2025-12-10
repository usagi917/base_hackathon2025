'use client';
// biome-ignore assist/source/organizeImports: explain why this is needed
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { formatEther } from 'viem';
import { REGRET_VAULT_ABI, REGRET_VAULT_ADDRESS } from '../../constants';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Identity, Address, EthBalance } from '@coinbase/onchainkit/identity';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Shield, Sword, Scroll, Skull } from 'lucide-react';
import { type Apology, Outcome } from '../../types';
import { ErrorDisplay } from '../../components/ErrorDisplay';

export default function ResolvePage() {
    const params = useParams();
    const id = params.id as string;
    const { isConnected, chain } = useAccount();
    const { switchChain } = useSwitchChain();

    // ウォレット接続時にBase Sepoliaに自動切り替え
    useEffect(() => {
        if (isConnected && chain && chain.id !== baseSepolia.id) {
            switchChain({ chainId: baseSepolia.id });
        }
    }, [isConnected, chain, switchChain]);

    const { data: apology, isLoading: isReading, refetch: refetchApology } = useReadContract({
        address: REGRET_VAULT_ADDRESS,
        abi: REGRET_VAULT_ABI,
        functionName: 'getApology',
        args: [BigInt(id || 0)],
        query: { enabled: !!id, refetchInterval: 2000 } // 2秒ごとに自動再フェッチ
    });

    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({ hash });

    // トランザクションが成功したら即座に再フェッチ
    useEffect(() => {
        if (isTransactionSuccess) {
            refetchApology();
        }
    }, [isTransactionSuccess, refetchApology]);

    const handleDecision = async (decision: Outcome) => {
        // 送信前にネットワークがBase Sepoliaか確認
        if (!chain || chain.id !== baseSepolia.id) {
            // Base Sepoliaに切り替え
            try {
                await switchChain({ chainId: baseSepolia.id });
            } catch (error) {
                // ネットワーク切り替えが拒否された場合
                console.error('ネットワーク切り替えが拒否されました:', error);
            }
            // ネットワーク切り替えが完了するまで待つ（ユーザーが再度ボタンを押す必要がある）
            return;
        }
        
        // Base Sepoliaで送信
        writeContract({
            address: REGRET_VAULT_ADDRESS,
            abi: REGRET_VAULT_ABI,
            functionName: 'resolve',
            args: [BigInt(id), decision],
        });
    }

    if (!id) {
        return (
            <div className="h-screen flex items-center justify-center font-pixel text-red-500">
                無効なID
            </div>
        );
    }

    if (isReading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-blue-600">
                <div className="font-pixel text-white text-2xl animate-bounce">セーブデータ読み込み中...</div>
            </div>
        );
    }

    if (!apology) {
        return (
            <div className="h-screen flex items-center justify-center font-pixel text-4xl text-red-500">
                クエストが見つかりません
            </div>
        );
    }

    // 型安全にApologyデータを取得
    const apologyData = apology as Apology;
    const outcomeInt = Number(apologyData.outcome);

    // Resolution Screen (Game Over / Outcome)
    if (outcomeInt !== Outcome.Pending) {
        return (
            <main className="min-h-screen w-full font-vt323 p-4 flex flex-col items-center justify-center bg-purple-700 relative overflow-hidden">
                 <div className="scanlines fixed inset-0 pointer-events-none z-0" />
                 
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="z-10 text-center max-w-4xl w-full"
                >
                     <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 border-4 border-white font-pixel text-sm">
                            ミッション結果
                        </div>

                        <div className="text-[100px] leading-none mb-4">
                            {outcomeInt === Outcome.Forgiven && "🏆"}
                            {outcomeInt === Outcome.Rejected && "🛑"}
                            {outcomeInt === Outcome.Punished && "💀"}
                        </div>
                        
                        <h1 className="text-5xl md:text-8xl font-pixel text-stroke-md text-black mb-4 uppercase tracking-tighter">
                            {outcomeInt === Outcome.Forgiven && "許された"}
                            {outcomeInt === Outcome.Rejected && "拒否された"}
                            {outcomeInt === Outcome.Punished && "罰を受けた"}
                        </h1>
                        
                         <div className={clsx(
                            "text-2xl md:text-3xl font-bold p-4 border-4 border-black inline-block bg-gray-100",
                            outcomeInt === Outcome.Forgiven && "text-green-600 bg-green-100",
                            outcomeInt === Outcome.Rejected && "text-gray-600",
                            outcomeInt === Outcome.Punished && "text-red-600 bg-red-100"
                        )}>
                            {outcomeInt === Outcome.Forgiven && "あなたは謝罪を受け入れました。"}
                            {outcomeInt === Outcome.Rejected && "あなたは供物を返却しました。"}
                            {outcomeInt === Outcome.Punished && "あなたは供物を燃やしました。"}
                        </div>
                    </div>
                </motion.div>
            </main>
        )
    }

    // Active Screen (Boss Battle)
    return (
        <main className="min-h-screen w-full font-vt323 p-4 pb-20 bg-blue-600 selection:bg-yellow-300 selection:text-black overflow-x-hidden">
             <div className="scanlines fixed inset-0 pointer-events-none z-0" />

            {/* Navbar */}
            <div className="fixed top-4 right-4 z-50">
                 <div className="bg-white border-4 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Wallet>
                        <ConnectWallet className="bg-transparent text-black font-pixel text-xs px-2 py-2 !rounded-none">
                            <Avatar className="h-6 w-6 rounded-none border-2 border-black" />
                            <Name />
                        </ConnectWallet>
                        <WalletDropdown>
                            <Identity className="px-4 pt-3 pb-2 bg-white" hasCopyAddressOnClick>
                                <Avatar /><Name /><Address /><EthBalance />
                            </Identity>
                            <WalletDropdownDisconnect className="bg-red-500 text-white font-pixel hover:bg-red-600" />
                        </WalletDropdown>
                    </Wallet>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left: Quest Log */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <div className="bg-yellow-300 border-4 border-black p-2 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                         <h2 className="font-pixel text-sm flex items-center gap-2">
                             <Scroll size={16} /> 新しいクエストが利用可能
                         </h2>
                    </div>

                    <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                         {/* Tape decoration */}
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-200/80 transform -rotate-2 border border-gray-300"></div>

                        <div className="flex justify-between items-end mb-4 border-b-4 border-black pb-4">
                             <div>
                                 <p className="font-pixel text-xs text-gray-500 mb-1">戦利品:</p>
                                 <h1 className="text-5xl font-pixel text-green-600 text-shadow-retro">
                                     {formatEther(apologyData.amount)} ETH
                                 </h1>
                             </div>
                             <div className="text-right">
                                 <p className="font-pixel text-xs text-gray-500">プレイヤー:</p>
                                 <p className="font-mono text-sm bg-gray-100 p-1 border-2 border-black truncate w-32 md:w-auto">
                                     {apologyData.sender}
                                 </p>
                             </div>
                        </div>

                        <div className="bg-gray-100 border-4 border-gray-300 inset-0 p-4 min-h-[200px]">
                             <p className="text-3xl leading-relaxed text-black font-vt323">
                                "{apologyData.message}"
                            </p>
                        </div>
                    </div>

                    {!isConnected && (
                        <div className="bg-red-500 border-4 border-black p-4 text-white text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                            <p className="font-pixel mb-2">審判者が見つかりません</p>
                            <Wallet className="w-full flex justify-center">
                                <ConnectWallet className="bg-white text-black font-pixel text-xs px-4 py-3 hover:bg-gray-200" />
                            </Wallet>
                        </div>
                    )}
                </motion.div>

                {/* Right: Battle Commands */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-black/20 p-6 rounded-xl border-4 border-black backdrop-blur-sm"
                >
                    <div className="mb-4 font-pixel text-white text-center border-b-4 border-black pb-2">
                        アクションを選択
                    </div>

                    <div className="space-y-4">
                        {isConnected ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleDecision(Outcome.Forgiven)}
                                    disabled={isPending || isConfirming}
                                    className="w-full pixel-btn pixel-btn-success flex items-center justify-between group h-24"
                                >
                                    <div className="text-left">
                                        <span className="block text-2xl mb-1">許す</span>
                                        <span className="text-xs opacity-70">戦利品を受け取る</span>
                                    </div>
                                    <Shield size={32} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDecision(Outcome.Rejected)}
                                    disabled={isPending || isConfirming}
                                    className="w-full pixel-btn pixel-btn-danger flex items-center justify-between group h-24"
                                >
                                    <div className="text-left">
                                        <span className="block text-2xl mb-1">拒否</span>
                                        <span className="text-xs opacity-70">送信者に返却</span>
                                    </div>
                                    <Sword size={32} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDecision(Outcome.Punished)}
                                    disabled={isPending || isConfirming}
                                    className="w-full pixel-btn pixel-btn-danger flex items-center justify-between group h-24"
                                >
                                    <div className="text-left">
                                        <span className="block text-2xl mb-1">罰する</span>
                                        <span className="text-xs opacity-70">すべて燃やす</span>
                                    </div>
                                    <Skull size={32} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
                                </button>
                            </>
                        ) : (
                            <div className="text-white text-center font-vt323 text-2xl opacity-50">
                                コインを投入して操作を有効化
                            </div>
                        )}

                        {(isPending || isConfirming) && (
                            <div className="bg-yellow-400 border-4 border-black p-2 text-center font-pixel text-xs animate-pulse mt-4">
                                {isPending ? 'ウォレットを確認中...' : '実行中...'}
                            </div>
                        )}

                        {writeError && <ErrorDisplay error={writeError} className="mt-4" />}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}