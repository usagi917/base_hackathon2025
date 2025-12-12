// エラー処理関連のユーティリティ関数

import { WriteError } from '../types';

/**
 * エラーメッセージを取得（ユーザーフレンドリーな形式）
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  // wagmiのWriteError型の場合
  const writeError = error as WriteError;
  if (writeError.shortMessage) {
    return writeError.shortMessage;
  }
  if (writeError.message) {
    return writeError.message;
  }
  
  return 'An unexpected error occurred';
}




