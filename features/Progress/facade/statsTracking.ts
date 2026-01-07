'use client';

import useStatsStore from '../store/useStatsStore';

type StatsState = ReturnType<typeof useStatsStore.getState>;

export type RecordGauntletRunParams = Parameters<
  StatsState['recordGauntletRun']
>[0];

export type RecordBlitzSessionParams = Parameters<
  StatsState['recordBlitzSession']
>[0];

export const statsTracking = {
  recordBlitzSession: (params: RecordBlitzSessionParams) =>
    useStatsStore.getState().recordBlitzSession(params),
  recordGauntletRun: (params: RecordGauntletRunParams) =>
    useStatsStore.getState().recordGauntletRun(params),
  recordChallengeModeUsed: (challengeMode: string) =>
    useStatsStore.getState().recordChallengeModeUsed(challengeMode),
  recordDojoUsed: (dojo: string) =>
    useStatsStore.getState().recordDojoUsed(dojo)
};
