import { UserResponse } from './UserResponse';
import { GitRepository } from './GitRepositoryResponse';
import { WorkSessionResponse } from './WorkSessionResponse';

export interface GitCommitResponse {
  id: string;
  repositoryId: string;
  extCommitId: string;
  extCommitShortId: string;
  title: string;
  comment?: string | null;
  authorId: string;
  webUrl: string;
  createdAt: string;
  updatedAt?: string | null;

  author: UserResponse | null;
  repository: GitCommitResponse | null;
  workSessions: WorkSessionResponse[];
}
