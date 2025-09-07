import { CreateUserContract } from "../interfaces/UserContracts/CreateUserContract";
import { UserContractResponse } from "../interfaces/UserContracts/UserContractResponse";
import { API_BASE } from '../config';
import { authorizedFetch } from "../auth/authorizedFetch";

if (!API_BASE) {
  throw new Error('REACT_APP_API_BASE_URL is not defined');
}

const endpoint = `${API_BASE}/api/usercontract`;

export const userContractService = {

  getAll: async (): Promise<UserContractResponse[]> => {
    const res = await authorizedFetch(endpoint);
    if (!res.ok) throw new Error('Failed to fetch work sessions');
    return res.json();
  },

  filter: async (
    userId?: string,
    year?: number,
    month?: number
  ): Promise<UserContractResponse[]> => {
    const params = new URLSearchParams();
  
    if (userId) params.append('userId', userId);
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());
  
    const res = await authorizedFetch(`${endpoint}/Filter?${params.toString()}`);
    console.log(`${endpoint}/Filter?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to filter user contracts');
    return res.json();
  },  

  getById: async (id: string): Promise<UserContractResponse> => {
    const res = await authorizedFetch(`${endpoint}/${id}`);
    if (!res.ok) throw new Error(`Work session ${id} not found`);
    return res.json();
  },

  getMonthlySummary: async (userContractId: string, year: number, month: number): Promise<any> => {
    const res = await authorizedFetch(`${endpoint}/${userContractId}/MonthlySummary?year=${year}&month=${month}`);
    if (!res.ok) throw new Error(`Failed to fetch monthly summary for contract ${userContractId}`);
    return res.json();
  },

  getYearlySummary: async (userContractId: string, year: number): Promise<any> => {
    const res = await authorizedFetch(`${endpoint}/${userContractId}/YearlySummary?year=${year}`);
    if (!res.ok) throw new Error(`Failed to fetch yearly summary for contract ${userContractId}`);
    return res.json();
  },

  create: async (payload: Partial<CreateUserContract>): Promise<UserContractResponse> => {
    const res = await authorizedFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
      // Try to parse the response body (assuming it's JSON)
      const contentType = res.headers.get('Content-Type');
      let errorMessage = res.statusText;
  
      if (contentType?.includes('application/json')) {
        const body = await res.json().catch(() => null);
        if (body?.errors) {
          // Get first error message from model state
          const firstError = Object.values(body.errors).flat()[0];
          if (firstError) errorMessage = String(firstError);
        } else if (body?.message) {
          errorMessage = body.message;
        }
      } else {
        // fallback to plain text if JSON fails
        const text = await res.text().catch(() => '');
        if (text) errorMessage = text;
      }
  
      throw new Error(errorMessage);
    }
  
    return res.json();
  },

  update: async (id: string, payload: Partial<CreateUserContract>): Promise<UserContractResponse> => {
    const res = await authorizedFetch(`${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // Try to parse the response body (assuming it's JSON)
      const contentType = res.headers.get('Content-Type');
      let errorMessage = res.statusText;
  
      if (contentType?.includes('application/json')) {
        const body = await res.json().catch(() => null);
        if (body?.errors) {
          // Get first error message from model state
          const firstError = Object.values(body.errors).flat()[0];
          if (firstError) errorMessage = String(firstError);
        } else if (body?.message) {
          errorMessage = body.message;
        }
      } else {
        // fallback to plain text if JSON fails
        const text = await res.text().catch(() => '');
        if (text) errorMessage = text;
      }
  
      throw new Error(errorMessage);
    }
    return res.json();
  },

  lockMonth: async (id: string, year: number, month: number): Promise<UserContractResponse> => {
    const res = await authorizedFetch(`${endpoint}/${id}/LockMonth/?year=${year}&month=${month}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: null,
    });

    if (!res.ok) {
      // Try to parse the response body (assuming it's JSON)
      const contentType = res.headers.get('Content-Type');
      let errorMessage = res.statusText;
  
      if (contentType?.includes('application/json')) {
        const body = await res.json().catch(() => null);
        if (body?.errors) {
          // Get first error message from model state
          const firstError = Object.values(body.errors).flat()[0];
          if (firstError) errorMessage = String(firstError);
        } else if (body?.message) {
          errorMessage = body.message;
        }
      } else {
        // fallback to plain text if JSON fails
        const text = await res.text().catch(() => '');
        if (text) errorMessage = text;
      }
  
      throw new Error(errorMessage);
    }
    return res.json();
  },

  unlockMonth: async (id: string, year: number, month: number): Promise<UserContractResponse> => {
    const res = await authorizedFetch(`${endpoint}/${id}/UnlockMonth?year=${year}&month=${month}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: null,
    });

    if (!res.ok) {
      // Try to parse the response body (assuming it's JSON)
      const contentType = res.headers.get('Content-Type');
      let errorMessage = res.statusText;
  
      if (contentType?.includes('application/json')) {
        const body = await res.json().catch(() => null);
        if (body?.errors) {
          // Get first error message from model state
          const firstError = Object.values(body.errors).flat()[0];
          if (firstError) errorMessage = String(firstError);
        } else if (body?.message) {
          errorMessage = body.message;
        }
      } else {
        // fallback to plain text if JSON fails
        const text = await res.text().catch(() => '');
        if (text) errorMessage = text;
      }
  
      throw new Error(errorMessage);
    }
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await authorizedFetch(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete work session ${id}`);
  },
}