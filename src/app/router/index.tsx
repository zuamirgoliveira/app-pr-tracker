import { Routes, Route, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import Login from "../../ui/pages/login/Login";
import ProjectList from "../../ui/pages/projects/Project";
import RepositoryList from "../../ui/pages/repositories/Repository";
import PullRequestList from "../../ui/pages/pullrequests/PullRequest";
import MyPullRequestList from "../../ui/pages/my-pullrequest/MyPullRequest";
import { AzureProjectService } from "../../infra/api/azure/azure-project.service";
import { AzureRepositoryService } from "../../infra/api/azure/azure-repository.service";
import { AzurePullRequestService } from "../../infra/api/azure/azure-pullrequest.service";
import { Repository } from "../../core/entities/repository";
import { Project } from "../../core/entities/project";
import { ConnectionForm } from "../../core/entities/connection-form";

function LoginPage() {
  const navigate = useNavigate();
  const {
    setProjects,
    setRepositories,
    setMyPullRequests,
    setConnectionInfo,
    isLoading,
    setIsLoading,
    error,
    setError
  } = useAppContext();

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
        navigate('/projects');
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
        navigate('/my-pullrequests');
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
        navigate('/repositories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Login
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  );
}

function ProjectsPage() {
  const navigate = useNavigate();
  const {
    projects,
    connectionInfo,
    setRepositories,
    setConnectionInfo,
    isLoading,
    setIsLoading,
    setError
  } = useAppContext();

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
      navigate('/repositories');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar repositórios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  if (!connectionInfo) {
    navigate('/');
    return null;
  }

  return (
    <ProjectList
      projects={projects}
      organization={connectionInfo.organization}
      isLoading={isLoading}
      onProjectSelect={handleProjectSelect}
      onBackToLogin={handleBackToLogin}
    />
  );
}

function RepositoriesPage() {
  const navigate = useNavigate();
  const {
    repositories,
    connectionInfo,
    setPullRequests,
    setSelectedRepository,
    isLoading,
    setIsLoading,
    setError
  } = useAppContext();

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
      navigate('/pullrequests');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar pull requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  if (!connectionInfo) {
    navigate('/');
    return null;
  }

  return (
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
}

function PullRequestsPage() {
  const navigate = useNavigate();
  const {
    pullRequests,
    selectedRepository,
    connectionInfo,
    setPullRequests,
    isLoading,
    setIsLoading,
    setError
  } = useAppContext();

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

  const handleBackToRepositories = () => {
    navigate('/repositories');
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  if (!connectionInfo || !selectedRepository) {
    navigate('/');
    return null;
  }

  return (
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
}

function MyPullRequestsPage() {
  const navigate = useNavigate();
  const {
    myPullRequests,
    connectionInfo,
    setMyPullRequests,
    isLoading,
    setIsLoading,
    setError
  } = useAppContext();

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
      setMyPullRequests(prs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar pull requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  if (!connectionInfo) {
    navigate('/');
    return null;
  }

  return (
    <MyPullRequestList
      pullRequests={myPullRequests}
      organization={connectionInfo.organization}
      project={connectionInfo.project || ''}
      isLoading={isLoading}
      onBackToLogin={handleBackToLogin}
      onRefreshPullRequests={handleRefreshMyPullRequests}
    />
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/repositories" element={<RepositoriesPage />} />
      <Route path="/pullrequests" element={<PullRequestsPage />} />
      <Route path="/my-pullrequests" element={<MyPullRequestsPage />} />
    </Routes>
  );
}
