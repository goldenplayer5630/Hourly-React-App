export interface UserResponse {
    id: string;
    userId: string;
  
    taskDescription: string;
    startTime: string;     // ISO string from API (can be parsed into Date in JS)
    endTime: string;
    factor: number;
  
    wbso: boolean;
    otherRemarks?: string;

  
    createdAt: string;
    updatedAt?: string;
  }
  