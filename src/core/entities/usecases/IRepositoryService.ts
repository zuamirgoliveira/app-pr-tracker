import { Repository } from "../repository";

export interface IRepositoryService {
  getRepositories(organization: string, project: string, token: string): Promise<Repository[]>;
  testConnection(organization: string, project: string, token: string): Promise<boolean>;
}
