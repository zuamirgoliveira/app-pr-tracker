import { UserEntity } from './user-entity-dto';

export interface AzureUserEntityResponse {
  count: number;
  value: UserEntity[];
}