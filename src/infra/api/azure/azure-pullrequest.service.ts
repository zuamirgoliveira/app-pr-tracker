import axios from "axios";
import { PullRequest } from "../../../core/entities/pull-request";
import { AzurePullRequestsResponse } from './dto/azure-pull-requests-response-dto';
import { createAuthHeader } from "./util/azure-auth.util";
import { AzureUserService } from "./azure-user.service";

export class AzurePullRequestService {
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
          "Authorization": createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000
      });
      return response.data.value;
    } catch (error: unknown) {
      console.error('Error fetching pull requests:', error);
      return [];
    }
  }

  static async getMyPullRequests(
    organization: string,
    project: string,
    token: string
  ): Promise<PullRequest[]> {
    try {
      const user = await AzureUserService.getUser(organization, token);
      if (!user || !user.emailAddress) {
        throw new Error("Não foi possível obter o e-mail do usuário autenticado.");
      }
      const userEntity = await AzureUserService.getUserEntity(organization, user.emailAddress, token);
      if (!userEntity || !userEntity.id) {
        throw new Error("Não foi possível obter o e-mail do usuário autenticado.");
      }
      const url = `https://dev.azure.com/${organization}/${project}/_apis/git/pullrequests?searchCriteria.reviewerId=${userEntity.id}&searchCriteria.status=all&api-version=7.0`;
      const response = await axios.get<AzurePullRequestsResponse>(url, {
        headers: {
          "Authorization": createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000
      });
      return response.data.value;
    } catch (error: unknown) {
      console.error('Error fetching reviewer pull requests:', error);
      return [];
    }
  }
}
