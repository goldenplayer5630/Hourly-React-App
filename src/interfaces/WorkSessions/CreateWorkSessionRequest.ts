export interface CreateWorkSessionRequest {
    userId: string;
    taskDescription: string;
    startTime: Date;
    endTime: Date;
    factor: number;
    wbso: boolean;
    otherRemarks?: string;
    gitCommitIds?: string[];
  }
  