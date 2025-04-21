// src/types/WorkSessionResponse.ts

import { GitCommitResponse } from './GitCommitResponse';
import { UserResponse } from './UserResponse';

export interface WorkSessionResponse {
  id: string;
  userId: string;
  user?: UserResponse;

  taskDescription: string;
  startTime: string;     // ISO string from API (can be parsed into Date in JS)
  endTime: string;
  factor: number;

  wbso: boolean;
  otherRemarks?: string;

  gitCommits: GitCommitResponse[];

  createdAt: string;
  updatedAt?: string;
}
