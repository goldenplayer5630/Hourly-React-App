export interface MonthlySummary {
    userContractId: string;
    year: number;
    month: number;
    totalRawEffectiveHours: number;
    totalNetEffectiveHours: number;
    totalTVTHoursAccrued: number;
    totalTVTHoursUsed: number;
}