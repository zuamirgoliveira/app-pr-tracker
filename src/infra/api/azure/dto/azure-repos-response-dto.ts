import { Repository } from "../../../../core/entities/repository";

export interface AzureReposResponse {
  value: Repository[];
  count: number;
}