export interface CreateWorkSessionRequest {
    userContractId: string;
    taskDescription: string;
    startTime: Date;
    endTime: Date;
    breakTime: number;
    factor: number;
    wbso: boolean;
    tvtAccruedHours: number;
    tvtUsedHours: number;
    otherRemarks?: string;
    gitCommitIds?: string[];
  }
  