// トランザクション関連のユーティリティ関数

import { decodeEventLog } from 'viem';
import { REGRET_VAULT_ABI, REGRET_VAULT_ADDRESS } from '../constants';

/**
 * トランザクションレシートからApology IDを抽出
 */
export function extractApologyIdFromReceipt(receipt: { logs: Array<{ address: string; data: `0x${string}`; topics: `0x${string}`[] }> }): string | null {
  try {
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() === REGRET_VAULT_ADDRESS.toLowerCase()) {
        try {
          const decoded = decodeEventLog({
            abi: REGRET_VAULT_ABI,
            data: log.data,
            topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
          });
          
          if (decoded.eventName === 'Deposited' && decoded.args.id !== undefined) {
            return decoded.args.id.toString();
          }
        } catch {
          continue;
        }
      }
    }
  } catch (error) {
    console.error('Failed to extract apology ID:', error);
  }
  return null;
}

/**
 * シェアリンクを生成（origin は SSR と CSR で安定させるため引数で渡す）
 */
export function generateShareLink(apologyId: string | null, origin: string): string {
  if (!apologyId || !origin) return '';
  const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  return `${normalizedOrigin}/resolve/${apologyId}`;
}












