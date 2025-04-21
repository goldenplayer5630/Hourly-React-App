import { WorkSessionResponse } from '../interfaces/WorkSessionResponse';

const API_BASE = 'https://localhost:7280/api/WorkSession';

export const workSessionService = {
  getAll: async (): Promise<WorkSessionResponse[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch work sessions');
    return res.json();
  },

  getById: async (id: string): Promise<WorkSessionResponse> => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Work session ${id} not found`);
    return res.json();
  },

  create: async (payload: Partial<WorkSessionResponse>): Promise<WorkSessionResponse> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create work session');
    return res.json();
  },

  update: async (id: string, payload: Partial<WorkSessionResponse>): Promise<WorkSessionResponse> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to update work session ${id}`);
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
