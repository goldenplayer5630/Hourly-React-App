import { UserResponse } from '../Users/UserResponse';
import { WorkSessionResponse } from '../WorkSessions/WorkSessionResponse';
import ContractType from '../../enums/ContractType';

export interface UserContractResponse {
    id: string;
    userId: string;
    name: string;
    contractType: ContractType;
    isActive: boolean;
    minWeeklyHours: number;
    maxWeeklyHours: number;
    grossHourlyRate?: number;
    holidayHoursPercentage?: number;
    monthlyPaidHolidayHours: boolean;
    minimumHoursPerMonth: number;
    maximumHoursPerMonth: number;
    startDate: Date;
    endDate?: Date;
    contractFilePath?: string;
    description?: string;
    createdAt: Date;
    updatedAt?: Date;
    user: UserResponse;
    workSessions: WorkSessionResponse[];
}
