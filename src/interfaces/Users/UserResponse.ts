import { RoleResponse } from '../Roles/RoleResponse';
import { DepartmentResponse } from '../Departments/DepartmentResponse';
import { WorkSessionResponse } from '../WorkSessions/WorkSessionResponse';
import { GitCommitResponse } from '../GitCommits/GitCommitResponse';
import { UserContractResponse } from '../UserContracts/UserContractResponse';

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

  createdAt: string;
  updatedAt?: string | null;

  gitCommits: GitCommitResponse[];
  userContracts: UserContractResponse[];
}
