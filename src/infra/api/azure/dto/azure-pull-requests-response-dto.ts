import { PullRequest } from "../../../../core/entities/pull-request";

export interface AzurePullRequestsResponse {
  value: PullRequest[];
  count: number;
}