import { DepartmentResponse } from '../interfaces/Departments/DepartmentResponse';

const API_BASE = 'http://localhost:5000/api/Department';

export const departmentService = {
  getAll: async (): Promise<DepartmentResponse[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch Departments');
    return res.json();
  },

  filter: async (
    DepartmentId?: string,
    year?: number,
    month?: number,
    wbso?: boolean
  ): Promise<DepartmentResponse[]> => {
    const params = new URLSearchParams();
  
    if (DepartmentId) params.append('DepartmentId', DepartmentId);
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());
    if (wbso !== undefined) params.append('wbso', wbso.toString());
  
    const res = await fetch(`${API_BASE}/Filter?${params.toString()}`);
    console.log(`${API_BASE}/Filter?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to filter Departments');
    return res.json();
  },  

  getById: async (id: string): Promise<DepartmentResponse> => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Department ${id} not found`);
    return res.json();
  },

  create: async (payload: Partial<DepartmentResponse>): Promise<DepartmentResponse> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create Department');
    return res.json();
  },

  update: async (id: string, payload: Partial<DepartmentResponse>): Promise<DepartmentResponse> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to update Department ${id}`);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete Department ${id}`);
  },
};
