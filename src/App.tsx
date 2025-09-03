import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ProjectList from "./components/ProjectList";
import RepositoryList from "./components/RepositoryList";
import PullRequestList from "./components/PullRequestList";
import MyPullRequestList from "./components/MyPullRequestList";
import { AzureDevOpsService } from "./services/azure";
import { Repository } from "./types/repository-dto";
import { Project } from "./types/project-dto";
import { ConnectionForm } from "./types/connection-form-dto";
import { PullRequest } from "./types/pull-request-dto";
import "./App.css";
import "./styles/search.css";
import "./styles/status-filter.css";
import "./styles/title-validation.css";
import "./styles/checkbox.css";
import "./styles/typography.css";

type Page = 'login' | 'projects' | 'repositories' | 'pullrequests' | 'myPullRequests';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionForm | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (form: ConnectionForm) => {
    setIsLoading(true);
    setError(null);

    try {
      if (form.searchType === 'projects') {
        const projectList = await AzureDevOpsService.getProjects(
          form.organization,
          form.token
        );
        setProjects(projectList);
        setConnectionInfo(form);
        setCurrentPage('projects');
      } else if (form.searchType === 'myPullRequests') {
        if (!form.project) {
          throw new Error('Projeto é obrigatório para buscar seus PRs');
        }
        setConnectionInfo(form);
        setCurrentPage('myPullRequests');
      } else {
        if (!form.project) {
          throw new Error('Projeto é obrigatório para buscar repositórios');
        }
        const repos = await AzureDevOpsService.getRepositories(
          form.organization,
          form.project,
          form.token
        );
        setRepositories(repos);
        setConnectionInfo(form);
        setCurrentPage('repositories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSelect = async (project: Project) => {
    if (!connectionInfo) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const repos = await AzureDevOpsService.getRepositories(
        connectionInfo.organization,
        project.name,
        connectionInfo.token
      );
      setRepositories(repos);
      setConnectionInfo({
        ...connectionInfo,
        project: project.name
      });
      setCurrentPage('repositories');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar repositórios");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePullRequestsSelect = async (repository: Repository) => {
    if (!connectionInfo || !connectionInfo.project) return;
    
    setIsLoading(true);
    setError(null);
    setSelectedRepository(repository);

    try {
      const prs = await AzureDevOpsService.getPullRequests(
        connectionInfo.organization,
        connectionInfo.project,
        repository.id,
        connectionInfo.token
      );
      setPullRequests(prs);
      setCurrentPage('pullrequests');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar pull requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
    setRepositories([]);
    setProjects([]);
    setPullRequests([]);
    setSelectedRepository(null);
    setConnectionInfo(null);
    setError(null);
  };

  const handleBackToProjects = () => {
    setCurrentPage('projects');
    setRepositories([]);
    setPullRequests([]);
    setSelectedRepository(null);
    setError(null);
  };

  const handleBackToRepositories = () => {
    setCurrentPage('repositories');
    setPullRequests([]);
    setSelectedRepository(null);
    setError(null);
  };

  const handleRefreshPullRequests = async () => {
    if (!connectionInfo || !connectionInfo.project || !selectedRepository) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const prs = await AzureDevOpsService.getPullRequests(
        connectionInfo.organization,
        connectionInfo.project,
        selectedRepository.id,
        connectionInfo.token
      );
      setPullRequests(prs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar pull requests");
    } finally {
      setIsLoading(false);
    }
  };

   const handleRefreshMyPullRequests = async () => {
    if (!connectionInfo || !connectionInfo.project) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const user = await AzureDevOpsService.getUser(connectionInfo.organization, connectionInfo.token);
      
      if (!user || !user.id) {
        throw new Error("Não foi possível obter o usuário autenticado.");
      }

      const prs = await AzureDevOpsService.getMyPullRequests(
        connectionInfo.organization,
        connectionInfo.project,
        user.id,
        connectionInfo.token
      );
      setPullRequests(prs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar pull requests");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
        );
      
      case 'projects':
        return connectionInfo && (
          <ProjectList
            projects={projects}
            organization={connectionInfo.organization}
            isLoading={isLoading}
            onProjectSelect={handleProjectSelect}
            onBackToLogin={handleBackToLogin}
          />
        );
      
      case 'repositories':
        return connectionInfo && (
          <RepositoryList
            repositories={repositories}
            organization={connectionInfo.organization}
            project={connectionInfo.project || ''}
            isLoading={isLoading}
            onPullRequestsSelect={handlePullRequestsSelect}
            onBackToLogin={handleBackToLogin}
            onBackToProjects={connectionInfo.searchType === 'projects' ? handleBackToProjects : undefined}
          />
        );
      
      case 'pullrequests':
        return connectionInfo && selectedRepository && (
          <PullRequestList
            pullRequests={pullRequests}
            repository={selectedRepository}
            organization={connectionInfo.organization}
            project={connectionInfo.project || ''}
            isLoading={isLoading}
            onBackToRepositories={handleBackToRepositories}
            onBackToProjects={connectionInfo.searchType === 'projects' ? handleBackToProjects : undefined}
            onBackToLogin={handleBackToLogin}
            onRefreshPullRequests={handleRefreshPullRequests}
          />
        );
      
      case 'myPullRequests':
        return connectionInfo && (
          <MyPullRequestList
            pullRequests={pullRequests}
            organization={connectionInfo.organization}
            project={connectionInfo.project || ''}
            isLoading={isLoading}
            onBackToLogin={handleBackToLogin}
            onRefreshPullRequests={handleRefreshMyPullRequests}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      {renderCurrentPage()}
      
      <footer className="app-footer">
        <div className="footer-content">
          Azure Repos Client - Feito com <span className="heart">❤️</span> usando Tauri + React + TypeScript
        </div>
      </footer>
    </div>
  );
}

export default App;