import { createContext, useContext, useState, ReactNode } from "react";
import { Repository } from "../core/entities/repository";
import { Project } from "../core/entities/project";
import { ConnectionForm } from "../core/entities/connection-form";
import { PullRequest } from "../core/entities/pull-request";

interface AppContextType {
  repositories: Repository[];
  setRepositories: (repos: Repository[]) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  pullRequests: PullRequest[];
  setPullRequests: (prs: PullRequest[]) => void;
  myPullRequests: PullRequest[];
  setMyPullRequests: (prs: PullRequest[]) => void;
  selectedRepository: Repository | null;
  setSelectedRepository: (repo: Repository | null) => void;
  connectionInfo: ConnectionForm | null;
  setConnectionInfo: (info: ConnectionForm | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [myPullRequests, setMyPullRequests] = useState<PullRequest[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionForm | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{
      repositories,
      setRepositories,
      projects,
      setProjects,
      pullRequests,
      setPullRequests,
      myPullRequests,
      setMyPullRequests,
      selectedRepository,
      setSelectedRepository,
      connectionInfo,
      setConnectionInfo,
      isLoading,
      setIsLoading,
      error,
      setError
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
