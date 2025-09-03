import axios from "axios";
import { Repository } from "../types/repository-dto";
import { AzureReposResponse } from "../types/azure-repos-response-dto";
import { PullRequest } from "../types/pull-request-dto";
import { AzurePullRequestsResponse } from '../types/azure-pull-requests-response-dto';
import { Project } from "../types/project-dto";
import { AzureProjectsResponse } from "../types/azure-projects-response-dto";
import { User } from "../types/user-dto";
import { AzureUserResponse } from "../types/azure-user-response-dto";

export class AzureDevOpsService {
  private static createAuthHeader(token: string): string {
    // Azure DevOps usa Basic auth com token como username e senha vazia
    const auth = btoa(`:${token}`);
    return `Basic ${auth}`;
  }

  static async getRepositories(
    organization: string, 
    project: string, 
    token: string
  ): Promise<Repository[]> {
    try {
      const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories?api-version=7.0`;
      
      const response = await axios.get<AzureReposResponse>(url, {
        headers: {
          "Authorization": this.createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 segundos de timeout
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

  static async getPullRequests(
    organization: string,
    project: string,
    repositoryId: string,
    token: string
  ): Promise<PullRequest[]> {
    try {
      const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullrequests?searchCriteria.status=all&api-version=7.0`;
      
      const response = await axios.get<AzurePullRequestsResponse>(url, {
        headers: {
          "Authorization": this.createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 segundos de timeout
      });

      return response.data.value;
    } catch (error: unknown) {
      console.error('Error fetching pull requests:', error);
      return [];
    }
  }

  static async getProjects(
    organization: string,
    token: string
  ): Promise<Project[]> {
    try {
      const url = `https://dev.azure.com/${organization}/_apis/projects?api-version=7.0`;
      
      const response = await axios.get<AzureProjectsResponse>(url, {
        headers: {
          "Authorization": this.createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 segundos de timeout
      });

      return response.data.value;
    } catch (error: unknown) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  static async getMyPullRequests(
    organization: string,
    project: string,
    userId: string,
    token: string
  ): Promise<PullRequest[]> {
    try {
      const url = `https://dev.azure.com/${organization}/${project}/_apis/git/pullrequests?searchCriteria.reviewerId=${userId}&searchCriteria.status=all&api-version=7.0`;

      const response = await axios.get<AzurePullRequestsResponse>(url, {
        headers: {
          "Authorization": this.createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 segundos de timeout
      });
      
      return response.data.value;
    } catch (error: unknown) {
      console.error('Error fetching reviewer pull requests:', error);
      return [];
    }
  }

  static async getUser(
    organization: string,
    token: string
  ): Promise<User | null> {
    try {
      const url = `https://vssps.dev.azure.com/${organization}/_apis/profile/profiles/me?api-version=7.0`;
      
      const response = await axios.get<AzureUserResponse>(url, {
        headers: {
          "Authorization": this.createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 segundos de timeout
      });

      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
}