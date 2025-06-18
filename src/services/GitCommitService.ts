import dayjs from 'dayjs';
import { GitCommitResponse } from '../interfaces/GitCommits/GitCommitResponse';
import { API_BASE } from '../config';

if (!API_BASE) {
  throw new Error('REACT_APP_API_BASE_URL is not defined');
}

const endpoint = `${API_BASE}/api/gitcommit`;

export const gitCommitService = {
  getAll: async (): Promise<GitCommitResponse[]> => {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Failed to fetch GitCommits');
    return res.json();
  },

  filter: async (
    repositoryId?: string,
    authorId?: string,
    authoredDate?: dayjs.Dayjs | string,
  ): Promise<GitCommitResponse[]> => {
    const params = new URLSearchParams();
  
    if (repositoryId) params.append('RepositoryId', repositoryId);
    if (authorId) params.append('AuthorId', authorId);
    if (authoredDate) params.append('AuthoredDate', authoredDate.toString());
  
    const res = await fetch(`${endpoint}/Filter?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to filter GitCommits');
    return res.json();
  },  

  getById: async (id: string): Promise<GitCommitResponse> => {
    const res = await fetch(`${endpoint}/${id}`);
    if (!res.ok) throw new Error(`GitCommit ${id} not found`);
    return res.json();
  },

  create: async (payload: Partial<GitCommitResponse>): Promise<GitCommitResponse> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create GitCommit');
    return res.json();
  },

  update: async (id: string, payload: Partial<GitCommitResponse>): Promise<GitCommitResponse> => {
    const res = await fetch(`${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to update GitCommit ${id}`);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete GitCommit ${id}`);
  },
};
