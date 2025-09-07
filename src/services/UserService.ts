import { UserResponse } from '../interfaces/Users/UserResponse';
import { API_BASE } from '../config';
import { apiConfig } from "../auth/msalConfig";
import { authorizedFetch } from "../auth/authorizedFetch";

if (!API_BASE) {
  throw new Error('REACT_APP_API_BASE_URL is not defined');
}


export async function bootstrapMe() {
  const res = await authorizedFetch(`${apiConfig.baseUrl}/api/user/me/bootstrap`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getMe() {
  const res = await authorizedFetch(`${apiConfig.baseUrl}/api/user/me`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const endpoint = `${API_BASE}/api/user`;

export const userService = {
  getAll: async (): Promise<UserResponse[]> => {
    const res = await authorizedFetch(endpoint);
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

    const res = await authorizedFetch(`${endpoint}/Filter?${params.toString()}`);
    console.log(`${endpoint}/Filter?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to filter users');
    return res.json();
  },

  getById: async (id: string): Promise<UserResponse> => {
    const res = await authorizedFetch(`${endpoint}/${id}`);
    if (!res.ok) throw new Error(`user ${id} not found`);
    return res.json();
  },

  create: async (payload: Partial<UserResponse>): Promise<UserResponse> => {
    const res = await authorizedFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },

  update: async (id: string, payload: Partial<UserResponse>): Promise<UserResponse> => {
    const res = await authorizedFetch(`${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to update user ${id}`);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await authorizedFetch(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete user ${id}`);
  },

  addDepartment: async (UserId: string, departmentId: string): Promise<UserResponse> => {
    const res = await authorizedFetch(`${endpoint}/${UserId}/AddDepartment/${departmentId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to add department');
    return res.json();
  },

  removeDepartment: async (UserId: string, departmentId: string): Promise<UserResponse> => {
    const res = await authorizedFetch(`${endpoint}/${UserId}/RemoveDepartment/${departmentId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to remove department');
    return res.json();
  },
};
