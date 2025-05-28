import { UserResponse } from '../Users/UserResponse';
import { GitRepositoryResponse } from '../GitRepositories/GitRepositoryResponse';
import { WorkSessionResponse } from '../WorkSessions/WorkSessionResponse';

export interface GitCommitResponse {
  id: string;
  repositoryId: string;
  extCommitId: string;
  extCommitShortId: string;
  title: string;
  comment?: string | null;
  authorId: string;
  authoredDate: string;
  webUrl: string;
  createdAt: string;
  updatedAt?: string | null;

  author: UserResponse | null;
  repository: GitRepositoryResponse | null;
  workSessions: WorkSessionResponse[];
}
