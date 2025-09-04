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