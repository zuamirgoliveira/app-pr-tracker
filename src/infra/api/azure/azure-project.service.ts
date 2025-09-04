import axios from "axios";
import { Project } from "../../../core/entities/project";
import { AzureProjectsResponse } from "./dto/azure-projects-response-dto";
import { createAuthHeader } from "./util/azure-auth.util";

export class AzureProjectService {
  static async getProjects(
    organization: string,
    token: string
  ): Promise<Project[]> {
    try {
      const url = `https://dev.azure.com/${organization}/_apis/projects?api-version=7.0`;
      const response = await axios.get<AzureProjectsResponse>(url, {
        headers: {
          "Authorization": createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000
      });
      return response.data.value;
    } catch (error: unknown) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }
}
