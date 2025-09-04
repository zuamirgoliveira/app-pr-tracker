import { useState } from "react";
import LoginForm from "../ui/pages/login/Login";
import ProjectList from "../ui/pages/projects/Project";
import RepositoryList from "../ui/pages/repositories/Repository";
import PullRequestList from "../ui/pages/pullrequests/PullRequest";
import MyPullRequestList from "../ui/pages/my-pullrequest/MyPullRequest";
import { AzureProjectService } from "../infra/api/azure/azure-project.service";
import { AzureRepositoryService } from "../infra/api/azure/azure-repository.service";
import { AzurePullRequestService } from "../infra/api/azure/azure-pullrequest.service";
import { Repository } from "../core/entities/repository";
import { Project } from "../core/entities/project";
import { ConnectionForm } from "../core/entities/connection-form";
import { PullRequest } from "../core/entities/pull-request";
import "./App.css";
import "./ui/styles/search.css";
import "./ui/styles/status-filter.css";
import "./ui/styles/title-validation.css";
import "./ui/styles/checkbox.css";
import "./ui/styles/typography.css";

type Page = 'login' | 'projects' | 'repositories' | 'pullrequests' | 'myPullRequests';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [myPullRequests, setMyPullRequests] = useState<PullRequest[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionForm | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (form: ConnectionForm) => {
    setIsLoading(true);
    setError(null);

    try {
      if (form.searchType === 'projects') {
        const projectList = await AzureProjectService.getProjects(
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
        const myPRList = await AzurePullRequestService.getMyPullRequests(
          form.organization,
          form.project,
          form.token
        );
        setMyPullRequests(myPRList);
        setConnectionInfo(form);
        setCurrentPage('myPullRequests');
      } else {
        if (!form.project) {
          throw new Error('Projeto é obrigatório para buscar repositórios');
        }
        const repos = await AzureRepositoryService.getRepositories(
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
      const repos = await AzureRepositoryService.getRepositories(
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
      const prs = await AzurePullRequestService.getPullRequests(
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
      const prs = await AzurePullRequestService.getPullRequests(
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
      const prs = await AzurePullRequestService.getMyPullRequests(
        connectionInfo.organization,
        connectionInfo.project,
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
            pullRequests={myPullRequests}
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