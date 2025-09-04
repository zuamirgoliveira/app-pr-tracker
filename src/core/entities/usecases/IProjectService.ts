import { Project } from "../project";

export interface IProjectService {
  getProjects(organization: string, token: string): Promise<Project[]>;
}
