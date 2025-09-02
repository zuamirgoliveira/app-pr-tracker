import { Project } from './project-dto';

export interface AzureProjectsResponse {
  value: Project[];
  count: number;
}