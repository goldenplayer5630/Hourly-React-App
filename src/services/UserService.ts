import { UserResponse } from '../interfaces/UserResponse';

const API_BASE = 'https://localhost:7280/api/User';

export const userService = {
  getAll: async (): Promise<UserResponse[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  filter: async (
    userId?: string,
    year?: number,
    month?: number,
    wbso?: boolean
  ): Promise<UserResponse[]> => {
    const params = new URLSearchParams();
  
    if (userId) params.append('userId', userId);
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());
    if (wbso !== undefined) params.append('wbso', wbso.toString());
  
    const res = await fetch(`${API_BASE}/Filter?${params.toString()}`);
    console.log(`${API_BASE}/Filter?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to filter users');
    return res.json();
  },  

  getById: async (id: string): Promise<UserResponse> => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`user ${id} not found`);
    return res.json();
  },

  create: async (payload: Partial<UserResponse>): Promise<UserResponse> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },

  update: async (id: string, payload: Partial<UserResponse>): Promise<UserResponse> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to update user ${id}`);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete user ${id}`);
  },

  addDepartment: async (UserId: string, departmentId: string): Promise<UserResponse> => {
    const res = await fetch(`${API_BASE}/${UserId}/AddDepartment/${departmentId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to add department');
    return res.json();
  },

  removeDepartment: async (UserId: string, departmentId: string): Promise<UserResponse> => {
    const res = await fetch(`${API_BASE}/${UserId}/RemoveDepartment/${departmentId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to remove department');
    return res.json();
  },
};
