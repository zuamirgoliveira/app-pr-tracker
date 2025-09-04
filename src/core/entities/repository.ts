export interface Repository {
  id: string;
  name: string;
  url: string;
  webUrl: string;
  defaultBranch: string;
  size: number;
  remoteUrl: string;
  sshUrl: string;
  project: {
    id: string;
    name: string;
    description?: string;
    url: string;
    state: string;
    revision: number;
  };
}