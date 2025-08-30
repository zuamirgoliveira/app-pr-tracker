export interface Repository {
  id: string;
  name: string;
  url: string;
  webUrl: string;
  defaultBranch: string;
  size: number;
  remoteUrl: string;
  sshUrl: string;
  project: {
    id: string;
    name: string;
    description?: string;
    url: string;
    state: string;
    revision: number;
  };
}

export interface AzureReposResponse {
  value: Repository[];
  count: number;
}

export type SearchType = 'projects' | 'repositories';

export interface ConnectionForm {
  organization: string;
  project?: string; // Opcional agora
  token: string;
  searchType: SearchType;
}

export interface PullRequest {
  pullRequestId: number;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'abandoned';
  createdBy: {
    id: string;
    displayName: string;
    uniqueName: string;
    url: string;
    imageUrl: string;
  };
  creationDate: string;
  closedDate?: string;
  sourceRefName: string;
  targetRefName: string;
  mergeStatus: 'succeeded' | 'failed' | 'conflicts' | 'queued' | 'rejectedByPolicy' | 'notSet';
  isDraft: boolean;
  repository: {
    id: string;
    name: string;
    url: string;
  };
  reviewers: Array<{
    id: string;
    displayName: string;
    uniqueName: string;
    vote: number;
    isRequired: boolean;
  }>;
  url: string;
  webUrl: string;
}

export interface AzurePullRequestsResponse {
  value: PullRequest[];
  count: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  url?: string;
  state: 'deleting' | 'new' | 'wellFormed' | 'createPending' | 'unchanged' | 'deleted';
  revision?: number;
  visibility?: 'private' | 'public';
  lastUpdateTime?: string;
}

export interface AzureProjectsResponse {
  value: Project[];
  count: number;
}