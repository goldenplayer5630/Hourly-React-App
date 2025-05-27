import { GitCommitResponse } from '../interfaces/GitCommits/GitCommitResponse';

const API_BASE = 'https://localhost:7280/api/GitCommit';

export const gitCommitService = {
  getAll: async (): Promise<GitCommitResponse[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch GitCommits');
    return res.json();
  },

  filter: async (
    GitCommitId?: string,
    year?: number,
    month?: number,
    wbso?: boolean
  ): Promise<GitCommitResponse[]> => {
    const params = new URLSearchParams();
  
    if (GitCommitId) params.append('GitCommitId', GitCommitId);
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());
    if (wbso !== undefined) params.append('wbso', wbso.toString());
  
    const res = await fetch(`${API_BASE}/Filter?${params.toString()}`);
    console.log(`${API_BASE}/Filter?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to filter GitCommits');
    return res.json();
  },  

  getById: async (id: string): Promise<GitCommitResponse> => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`GitCommit ${id} not found`);
    return res.json();
  },

  create: async (payload: Partial<GitCommitResponse>): Promise<GitCommitResponse> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create GitCommit');
    return res.json();
  },

  update: async (id: string, payload: Partial<GitCommitResponse>): Promise<GitCommitResponse> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to update GitCommit ${id}`);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete GitCommit ${id}`);
  },
};
