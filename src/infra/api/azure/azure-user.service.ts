import axios from "axios";
import { User } from "../../../core/entities/user";
import { AzureUserResponse } from "./dto/azure-user-response-dto";
import { UserEntity } from "../../../core/entities/user-entity";
import { AzureUserEntityResponse } from "./dto/azure-user-entity-response-dto";
import { createAuthHeader } from "./util/azure-auth.util";

export class AzureUserService {
  static async getUser(
    organization: string,
    token: string
  ): Promise<User | null> {
    try {
      const url = `https://vssps.dev.azure.com/${organization}/_apis/profile/profiles/me?api-version=7.0`;
      const response = await axios.get<AzureUserResponse>(url, {
        headers: {
          "Authorization": createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000
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
          "Authorization": createAuthHeader(token),
          "Content-Type": "application/json"
        },
        timeout: 10000
      });
      return response.data.count > 0 ? response.data.value[0] : null;
    } catch (error: unknown) {
      console.error('Error fetching user entity:', error);
      return null;
    }
  }
}
