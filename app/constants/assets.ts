import { formatUnits } from 'viem';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

export type AssetConfig = {
  id: string;
  symbol: string;
  label: string;
  address: `0x${string}`;
  decimals: number;
  isNative: boolean;
};

const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913') as `0x${string}`;

export const SUPPORTED_ASSETS: AssetConfig[] = [
  {
    id: 'eth',
    symbol: 'ETH',
    label: 'Base ETH',
    address: ZERO_ADDRESS,
    decimals: 18,
    isNative: true,
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    label: 'USDC',
    address: USDC_ADDRESS,
    decimals: 6,
    isNative: false,
  },
];

export const DEFAULT_ASSET = SUPPORTED_ASSETS[0];

export function findAssetByAddress(address?: string): AssetConfig | null {
  if (!address) return null;
  const lower = address.toLowerCase();
  const found = SUPPORTED_ASSETS.find((asset) => asset.address.toLowerCase() === lower);
  return found ?? null;
}

export function formatAssetAmount(value: bigint, asset?: AssetConfig): string {
  if (!asset) return value.toString();
  return formatUnits(value, asset.decimals);
}
