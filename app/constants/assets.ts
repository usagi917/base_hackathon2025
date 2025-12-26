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

// Polygon USDC (Native USDC on Polygon)
const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359') as `0x${string}`;

// Polygon JPYC
const JPYC_ADDRESS = (process.env.NEXT_PUBLIC_JPYC_ADDRESS ||
  '0x6AE7Dfc73E0dDE2aa99ac063DcF7e8A63265108c') as `0x${string}`;

export const SUPPORTED_ASSETS: AssetConfig[] = [
  {
    id: 'jpyc',
    symbol: 'JPYC',
    label: 'JPYC',
    address: JPYC_ADDRESS,
    decimals: 18,
    isNative: false,
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
