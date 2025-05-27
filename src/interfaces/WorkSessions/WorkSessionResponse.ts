// src/types/WorkSessionResponse.ts

import { GitCommitResponse } from '../GitCommits/GitCommitResponse';
import { UserContractResponse } from '../UserContracts/UserContractResponse';
import { UserResponse } from '../Users/UserResponse';

export interface WorkSessionResponse {
  id: string;
  userContractId: string;
  userContract?: UserContractResponse | null;

  taskDescription: string;
  startTime: string;
  endTime: string;
  breakTime: number;
  factor: number;
  rawEffectiveHours: number;
  netEffectiveHours: number;

  wbso?: boolean | null;
  locked ?: boolean | null;
  otherRemarks?: string | null;

  tvtAccruedHours: number;
  tvtUsedHours: number;

  gitCommits: GitCommitResponse[];

  createdAt: string;
  updatedAt?: string | null;
}
