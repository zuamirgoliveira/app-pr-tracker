import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ProjectList from "./components/ProjectList";
import RepositoryList from "./components/RepositoryList";
import PullRequestList from "./components/PullRequestList";
import { AzureDevOpsService } from "./services/azure";
import { Repository, Project, ConnectionForm, PullRequest } from "./types";

type Page = 'login' | 'projects' | 'repositories' | 'pullrequests';

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
        // Buscar projetos
        const projectList = await AzureDevOpsService.getProjects(
          form.organization,
          form.token
        );
        setProjects(projectList);
        setConnectionInfo(form);
        setCurrentPage('projects');
      } else {
        // Buscar repositórios
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
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {renderCurrentPage()}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 bg-opacity-90 border-t border-slate-700 py-2">
        <div className="text-center text-xs text-slate-400">
          Azure Repos Client - Feito com ❤️ usando Tauri + React + TypeScript
        </div>
      </footer>
    </div>
  );
}

export default App;