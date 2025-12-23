// Serious Pop Sacrifice Step
'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { ErrorDisplay } from '../ErrorDisplay';
import { LoadingSpinner } from '../LoadingSpinner';
import { CurrentBalance } from '../CurrentEthBalance';
import { DEFAULT_ASSET, SUPPORTED_ASSETS } from '../../constants/assets';

interface SacrificeStepProps {
  amount: string;
  assetId: string;
  onAmountChange: (value: string) => void;
  onAssetChange: (value: string) => void;
  onPrev: () => void;
  onDeposit: () => void;
  error: unknown;
  isLoading?: boolean;
}

export function SacrificeStep({ amount, assetId, onAmountChange, onAssetChange, onPrev, onDeposit, error, isLoading }: SacrificeStepProps) {
  const selectedAsset = SUPPORTED_ASSETS.find((asset) => asset.id === assetId) ?? DEFAULT_ASSET;
  const isValid = amount && Number(amount) > 0;
  const stepValue = selectedAsset.decimals === 0
    ? '1'
    : `0.${'0'.repeat(Math.max(selectedAsset.decimals - 1, 0))}1`;
  const inputStep = selectedAsset.decimals > 6 ? '0.000001' : stepValue;
  
  return (
    <motion.div
      key="sacrifice"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      <div className="card-pop bg-black border-2 border-[var(--color-pop-primary)] relative overflow-hidden">
        {/* Background Grid/Effect */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(var(--color-pop-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-pop-primary) 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }} 
        />

        <div className="relative z-10 flex flex-col items-center py-12">
          <label className="text-[var(--color-pop-primary)] font-[family-name:var(--font-display)] uppercase tracking-widest text-sm mb-4">
            Sacrifice Amount ({selectedAsset.symbol})
          </label>

          <div className="flex flex-col gap-3 items-center w-full px-6">
            <div className="w-full max-w-[420px] text-left">
              <label className="text-xs uppercase text-[var(--color-pop-text-muted)] font-bold tracking-wider">
                Asset
              </label>
              <div className="mt-1 relative">
                <select
                  className="w-full bg-black border border-[var(--color-pop-border)] text-white px-3 py-2 font-mono uppercase tracking-wider"
                  value={selectedAsset.id}
                  onChange={(e) => onAssetChange(e.target.value)}
                  disabled={isLoading}
                >
                  {SUPPORTED_ASSETS.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.label} ({asset.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <CurrentBalance
              asset={selectedAsset}
              className="mb-6 px-3 py-1 border border-[var(--color-pop-border)] bg-[var(--color-pop-surface)]/20"
              label="WALLET BALANCE"
            />
          </div>
          
          <div className="relative flex items-baseline">
            <input
              type="number"
              step={inputStep}
              min="0"
              placeholder="0.0"
              className="bg-transparent text-center text-6xl md:text-8xl font-black text-white focus:outline-none placeholder:text-[var(--color-pop-border)] font-[family-name:var(--font-display)] w-full max-w-[400px]"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
            />
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-[var(--color-pop-error)] bg-[var(--color-pop-error)]/10 px-4 py-2 rounded border border-[var(--color-pop-error)]/30">
            <AlertTriangle size={16} />
            <span className="text-xs uppercase font-bold tracking-wider">Funds will be locked</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="relative z-10 flex justify-between p-6 border-t border-[var(--color-pop-border)] bg-black/80 backdrop-blur-sm">
           <button
              onClick={onPrev}
              disabled={isLoading}
              className="btn-secondary text-xs"
            >
              <ArrowLeft size={16} className="mr-2" />
              BACK
            </button>
            
            <button
              onClick={onDeposit}
              disabled={isLoading || !isValid}
              className={`btn-primary text-xs ${(!isValid || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  SACRIFICE FUNDS
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
        </div>
      </div>

      {Boolean(error) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <ErrorDisplay error={error} />
        </motion.div>
      )}
    </motion.div>
  );
}
