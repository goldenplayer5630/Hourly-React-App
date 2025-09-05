import { MonthlySummary } from "./MonthlySummary";

export interface YearlySummary {
    userContractId: string; // Guid is represented as a string in TypeScript
    year: number;
    totalRawEffectiveHours: number;
    totalNetEffectiveHours: number;
    totalTVTHoursAccrued: number;
    totalTVTHoursUsed: number;

    // Navigation properties
    monthlySummaries: MonthlySummary[];
}

// Assuming MonthlySummary is defined elsewhere, you can import or define it as needed.
