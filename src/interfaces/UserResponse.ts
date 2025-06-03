import { RoleResponse } from './RoleResponse';
import { DepartmentResponse } from './DepartmentResponse';
import { WorkSessionResponse } from './WorkSessions/WorkSessionResponse';
import { GitCommitResponse } from './GitCommitResponse';

export interface UserResponse {
  id: string;

  name: string;
  email: string;

  roleId?: string | null;
  role?: RoleResponse | null;

  departmentId?: string | null;
  department?: DepartmentResponse | null;

  gitEmail?: string | null;
  gitUsername?: string | null;
  gitAccessToken?: string | null;
  tvtHourBalance?: number | null;

  createdAt: string;
  updatedAt?: string | null;

  workSessions: WorkSessionResponse[];
  gitCommits: GitCommitResponse[];
}
