import { Project } from '../../../../core/entities/project';

export interface AzureProjectsResponse {
  value: Project[];
  count: number;
}