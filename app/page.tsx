// Serious Pop Layout
'use client';

import { useConfessionFlow } from './hooks/useConfessionFlow';
import { Step } from './types';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { StepProgress } from './components/StepProgress';
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
    isPending,
    writeError,
    setMessage,
    setAmount,
    handleDeposit,
    resetFlow,
    nextStep,
    prevStep,
  } = useConfessionFlow();

  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-hidden">
      <Header />

      <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
        <div className="por-container pt-20 pb-8 max-w-5xl mx-auto w-full flex flex-col justify-center min-h-[calc(100vh-80px)]">
          <div className="space-y-6">
            <StepProgress step={step} />

            <AnimatePresence mode="wait">
              {step === Step.INTRO && (
                <IntroStep isConnected={isConnected} />
              )}

              {step === Step.CONFESS && (
                <ConfessStep
                  message={message}
                  onMessageChange={setMessage}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}

              {step === Step.SACRIFICE && (
                <SacrificeStep
                  amount={amount}
                  onAmountChange={setAmount}
                  onPrev={prevStep}
                  onDeposit={handleDeposit}
                  error={writeError}
                  isLoading={isPending}
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
        </div>
      </div>
    </main>
  );
}
