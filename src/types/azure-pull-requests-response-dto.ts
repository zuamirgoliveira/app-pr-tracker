import { PullRequest } from "./pull-request-dto";

export interface AzurePullRequestsResponse {
  value: PullRequest[];
  count: number;
}