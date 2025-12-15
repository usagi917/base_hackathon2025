import { Outcome } from '../types';

export type JudgmentDecisionKey = 'forgive' | 'reject' | 'punish' | 'pending';

export type JudgmentDecisionInfo = {
  key: JudgmentDecisionKey;
  outcome: Outcome;
  labelEn: string;
  labelJa: string;
};

export function getJudgmentDecisionInfo(outcomeValue: unknown): JudgmentDecisionInfo {
  const outcomeNumber =
    typeof outcomeValue === 'bigint' ? Number(outcomeValue) : typeof outcomeValue === 'number' ? outcomeValue : Number(outcomeValue);

  switch (outcomeNumber) {
    case Outcome.Forgiven:
      return { key: 'forgive', outcome: Outcome.Forgiven, labelEn: 'Forgive', labelJa: '和解' };
    case Outcome.Rejected:
      return { key: 'reject', outcome: Outcome.Rejected, labelEn: 'Reject', labelJa: '断罪' };
    case Outcome.Punished:
      return { key: 'punish', outcome: Outcome.Punished, labelEn: 'Punish', labelJa: '憤怒' };
    default:
      return { key: 'pending', outcome: Outcome.Pending, labelEn: 'Pending', labelJa: '未決' };
  }
}

