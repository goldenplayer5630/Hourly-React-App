import { UserResponse } from './UserResponse';
import { GitCommitResponse } from './GitCommitResponse';

export interface RoleResponse {
  id: string;
  name: string;
  permissions: string; // stored as JSON string (or convert to object if parsed)
  createdAt: string;
  updatedAt?: string | null;
  users: UserResponse[];
  gitCommits: GitCommitResponse[];
}
