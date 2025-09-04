import axios from "axios";
import { Repository } from "../../../core/entities/repository";
import { AzureReposResponse } from "./dto/azure-repos-response-dto";
import { createAuthHeader } from "./util/azure-auth.util";

export class AzureRepositoryService {
  static async getRepositories(
    organization: string, 
    project: string, 
    token: string
  ): Promise<Repository[]> {
    try {
      const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories?api-version=7.0`;
      const response = await axios.get<AzureReposResponse>(url, {
        headers: {
          "Authorization": createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000
      });
      return response.data.value;
    } catch (error: unknown) {
      return [];
    }
  }

  static async testConnection(
    organization: string,
    project: string, 
    token: string
  ): Promise<boolean> {
    try {
      await this.getRepositories(organization, project, token);
      return true;
    } catch {
      return false;
    }
  }
}
