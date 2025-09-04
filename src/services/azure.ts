import axios from "axios";
import { Repository } from "../types/repository-dto";
import { AzureReposResponse } from "../types/azure-repos-response-dto";
import { PullRequest } from "../types/pull-request-dto";
import { AzurePullRequestsResponse } from '../types/azure-pull-requests-response-dto';
import { Project } from "../types/project-dto";
import { AzureProjectsResponse } from "../types/azure-projects-response-dto";
import { User } from "../types/user-dto";
import { AzureUserResponse } from "../types/azure-user-response-dto";
import { UserEntity } from "../types/user-entity-dto";
import { AzureUserEntityResponse } from "../types/azure-user-entity-response-dto";

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
    token: string
  ): Promise<PullRequest[]> {
    try {

       const user = await AzureDevOpsService.getUser(organization, token);
        if (!user || !user.emailAddress) {
          throw new Error("Não foi possível obter o e-mail do usuário autenticado.");
        }
        const userEntity = await AzureDevOpsService.getUserEntity(organization, user.emailAddress, token);
        if (!userEntity || !userEntity.id) {
          throw new Error("Não foi possível obter o e-mail do usuário autenticado.");
        }

      const url = `https://dev.azure.com/${organization}/${project}/_apis/git/pullrequests?searchCriteria.reviewerId=${userEntity.id}&searchCriteria.status=all&api-version=7.0`;

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

  static async getUserEntity(
    organization: string,
    emailAddress: string,
    token: string
  ): Promise<UserEntity | null> {
    try {
      const url = `https://vssps.dev.azure.com/${organization}/_apis/identities?searchFilter=General&filterValue=${encodeURIComponent(emailAddress)}&api-version=7.0`;
      
      const response = await axios.get<AzureUserEntityResponse>(url, {
        headers: {
          "Authorization": this.createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 segundos de timeout
      });

      // Return the first user found, or null if no users found
      return response.data.count > 0 ? response.data.value[0] : null;
    } catch (error: unknown) {
      console.error('Error fetching user entity:', error);
      return null;
    }
  }

}