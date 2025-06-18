import { CreateWorkSessionRequest } from '../interfaces/WorkSessions/CreateWorkSessionRequest';
import { WorkSessionResponse } from '../interfaces/WorkSessions/WorkSessionResponse';

const API_BASE = process.env.REACT_APP_API_BASE_URL;
if (!API_BASE) {
  throw new Error('REACT_APP_API_BASE_URL is not defined');
}

export const workSessionService = {
  getAll: async (): Promise<WorkSessionResponse[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch work sessions');
    return res.json();
  },

  filter: async (
    userContractId?: string,
    year?: number,
    month?: number,
    wbso?: boolean
  ): Promise<WorkSessionResponse[]> => {
    const params = new URLSearchParams();
  
    if (userContractId) params.append('userContractId', userContractId);
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());
    if (wbso == true) params.append('wbso', wbso.toString());
  
    const res = await fetch(`${API_BASE}/Filter?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to filter work sessions');
    return res.json();
  },  

  getById: async (id: string): Promise<WorkSessionResponse> => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Work session ${id} not found`);
    return res.json();
  },

  create: async (payload: Partial<CreateWorkSessionRequest>): Promise<WorkSessionResponse> => {
    const res = await fetch(API_BASE, {
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
  
  update: async (id: string, payload: Partial<CreateWorkSessionRequest>): Promise<WorkSessionResponse> => {
    const res = await fetch(`${API_BASE}/${id}`, {
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

  updateLock: async (id: string, locked: boolean): Promise<WorkSessionResponse> => {
    const res = await fetch(`${API_BASE}/${id}?locked=${locked}`, {
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
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete work session ${id}`);
  },

  addGitCommit: async (workSessionId: string, gitCommitId: string): Promise<WorkSessionResponse> => {
    const res = await fetch(`${API_BASE}/${workSessionId}/AddGitCommit/${gitCommitId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to add Git commit');
    return res.json();
  },

  removeGitCommit: async (workSessionId: string, gitCommitId: string): Promise<WorkSessionResponse> => {
    const res = await fetch(`${API_BASE}/${workSessionId}/RemoveGitCommit/${gitCommitId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to remove Git commit');
    return res.json();
  },
};
