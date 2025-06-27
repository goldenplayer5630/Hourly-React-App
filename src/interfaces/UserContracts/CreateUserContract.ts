import { UserResponse } from '../Users/UserResponse';
import { WorkSessionResponse } from '../WorkSessions/WorkSessionResponse';
import ContractType from '../../enums/ContractType';

export interface CreateUserContract {
    userId: string;
    name: string;
    contractType: ContractType;
    isActive: boolean;
    
    minWeeklyHours: number;
    maxWeeklyHours: number;
    
    grossHourlyRate?: number;
    
    holidayHoursPercentage?: number;
    monthlyPaidHolidayHours: boolean;
    
    startDate: Date;
    endDate?: Date;
    contractFilePath?: string;
    description?: string;
}