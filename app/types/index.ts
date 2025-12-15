// 型定義ファイル

export enum Step {
  INTRO = 0,
  CONFESS = 1,
  SACRIFICE = 2,
  PROCESSING = 3,
  SUCCESS = 4
}

export enum Outcome {
  Pending = 0,
  Forgiven = 1,
  Rejected = 2,
  Punished = 3
}

export interface Apology {
  sender: `0x${string}`;
  amountDeposited: bigint;
  message: string;
  outcome: Outcome;
  depositedAt: bigint;
  resolver: `0x${string}`;
  resolvedAt: bigint;
  settled: boolean;
}

export interface WriteError {
  shortMessage?: string;
  message: string;
  name?: string;
}
