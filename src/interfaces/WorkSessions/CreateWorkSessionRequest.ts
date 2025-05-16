export interface CreateWorkSessionRequest {
    userId: string;
    taskDescription: string;
    startTime: Date;
    endTime: Date;
    factor: number;
    wbso: boolean;
    tvtAccruedHours: number;
    tvtUsedHours: number;
    otherRemarks?: string;
    gitCommitIds?: string[];
  }
  