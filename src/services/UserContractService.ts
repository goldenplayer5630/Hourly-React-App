import { UserContractResponse } from "../interfaces/UserContracts/UserContractResponse";

const API_BASE = 'https://localhost:7280/api/UserContract';

export const userContractService = {

  filter: async (
    userContractId?: string,
    year?: number,
    month?: number
  ): Promise<UserContractResponse[]> => {
    const params = new URLSearchParams();
  
    if (userContractId) params.append('userContractId', userContractId);
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());
  
    const res = await fetch(`${API_BASE}/Filter?${params.toString()}`);
    console.log(`${API_BASE}/Filter?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to filter user contracts');
    return res.json();
  },  
}