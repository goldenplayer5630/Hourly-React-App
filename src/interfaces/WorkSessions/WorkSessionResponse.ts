// src/types/WorkSessionResponse.ts

import { GitCommitResponse } from '../GitCommitResponse';
import { UserResponse } from '../UserResponse';

export interface WorkSessionResponse {
  id: string;
  userId: string;
  user?: UserResponse | null;

  taskDescription: string;
  startTime: string;
  endTime: string;
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
