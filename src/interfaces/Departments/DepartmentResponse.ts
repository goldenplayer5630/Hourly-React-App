import { UserResponse } from '../Users/UserResponse';

export interface DepartmentResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string | null;
  users: UserResponse[];
}
