'use client';

import { useConfessionFlow } from './hooks/useConfessionFlow';
import { Step } from './types';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { IntroStep } from './components/steps/IntroStep';
import { ConfessStep } from './components/steps/ConfessStep';
import { SacrificeStep } from './components/steps/SacrificeStep';
import { ProcessingStep } from './components/steps/ProcessingStep';
import { SuccessStep } from './components/steps/SuccessStep';

export default function Home() {
  const {
    step,
    message,
    amount,
    apologyId,
    isConnected,
    writeError,
    setMessage,
    setAmount,
    handleDeposit,
    resetFlow,
    nextStep,
    prevStep,
  } = useConfessionFlow();

  return (
    <main className="relative min-h-screen w-full font-vt323 selection:bg-black selection:text-white p-4 pb-20 overflow-x-hidden">
      {/* Scanlines Overlay */}
      <div className="scanlines fixed inset-0 pointer-events-none z-0" />

      {/* Header / Player Status */}
      <Header />

      {/* Main Game Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] pt-24">
        <AnimatePresence mode="wait">
          {step === Step.INTRO && (
            <IntroStep isConnected={isConnected} />
          )}

          {step === Step.CONFESS && (
            <ConfessStep
              message={message}
              onMessageChange={setMessage}
              onNext={nextStep}
            />
          )}

          {step === Step.SACRIFICE && (
            <SacrificeStep
              amount={amount}
              onAmountChange={setAmount}
              onPrev={prevStep}
              onDeposit={handleDeposit}
              error={writeError}
            />
          )}

          {step === Step.PROCESSING && (
            <ProcessingStep />
          )}

          {step === Step.SUCCESS && (
            <SuccessStep
              apologyId={apologyId}
              onReset={resetFlow}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
