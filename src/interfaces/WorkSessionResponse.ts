// src/types/WorkSessionResponse.ts

import { GitCommitResponse } from './GitCommitResponse';
import { UserResponse } from './UserResponse';

export interface WorkSessionResponse {
  id: string;
  userId: string;
  user?: UserResponse;

  taskDescription: string;
  startTime: string;
  endTime: string;
  factor: number;
  duration: number;

  wbso: boolean;
  otherRemarks?: string;

  gitCommits: GitCommitResponse[];

  createdAt: string;
  updatedAt?: string;
}
