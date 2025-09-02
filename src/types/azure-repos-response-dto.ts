import { Repository } from "./repository-dto";

export interface AzureReposResponse {
  value: Repository[];
  count: number;
}