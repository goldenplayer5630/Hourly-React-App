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
  duration: number;

  wbso?: boolean | null;
  otherRemarks?: string | null;

  gitCommits: GitCommitResponse[];

  createdAt: string;
  updatedAt?: string | null;
}
