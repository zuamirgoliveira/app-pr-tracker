import { UserEntity } from '../../../../core/entities/user-entity';

export interface AzureUserEntityResponse {
  count: number;
  value: UserEntity[];
}