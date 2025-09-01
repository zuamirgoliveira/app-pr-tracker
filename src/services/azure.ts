import axios from "axios";
import { Repository, AzureReposResponse, PullRequest, AzurePullRequestsResponse, Project, AzureProjectsResponse } from "../types";

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

  static async getMinePullRequests(
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
}