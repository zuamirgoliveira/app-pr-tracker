import { PullRequest } from "../pull-request";

export interface IPullRequestService {
  getPullRequests(
    organization: string,
    project: string,
    repositoryId: string,
    token: string
  ): Promise<PullRequest[]>;
  
  getMyPullRequests(
    organization: string,
    project: string,
    token: string
  ): Promise<PullRequest[]>;
}
