import { User } from "../user";
import { UserEntity } from "../user-entity";

export interface IUserService {
  getUser(organization: string, token: string): Promise<User | null>;
  getUserEntity(
    organization: string,
    emailAddress: string,
    token: string
  ): Promise<UserEntity | null>;
}
