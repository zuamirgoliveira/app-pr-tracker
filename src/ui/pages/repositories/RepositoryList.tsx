import { useState, useMemo } from "react";
import { Repository } from "../../types/repository-dto";

interface RepositoryListProps {
  repositories: Repository[];
  organization: string;
  project: string;
  isLoading?: boolean;
  onPullRequestsSelect: (repository: Repository) => void;
  onBackToLogin: () => void;
  onBackToProjects?: () => void;
}

export default function RepositoryList({
  repositories,
  organization,
  project,
  isLoading = false,
  onPullRequestsSelect,
  onBackToLogin,
  onBackToProjects
}: RepositoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepositories = useMemo(() => {
    if (!searchTerm.trim()) {
      return repositories;
    }
    return repositories.filter(repository =>
      repository.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [repositories, searchTerm]);

  return (
    <div className="repositories-container">
      <div className="repositories-header">
        <div className="banner-container">
          <img 
            src="/banner-pr-tracker.png" 
            alt="PR Tracker Banner" 
            className="page-banner"
          />
        </div>
        <h1 className="repositories-title">Repositórios - {project}</h1>
        <p className="repositories-subtitle">
          {organization} • {repositories.length} repositório(s) encontrado(s)
        </p>
      </div>

      <div className="repositories-main-container">
        {/* Header Actions */}
        <div className="nav-buttons">
          <button
            onClick={onBackToLogin}
            className="nav-btn"
            disabled={isLoading}
          >
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Login
          </button>
          {onBackToProjects && (
            <button
              onClick={onBackToProjects}
              className="nav-btn"
              disabled={isLoading}
            >
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Projetos
            </button>
          )}
        </div>

        {/* Search Section */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar repositório..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              disabled={isLoading}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="search-clear"
                type="button"
                title="Limpar busca"
              >
                ×
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="search-results">
              {filteredRepositories.length} repositório(s) encontrado(s) para "{searchTerm}"
            </p>
          )}
        </div>

        {/* Repositories List */}
        {filteredRepositories.length === 0 ? (
          <div className="empty-message">
            <svg className="alert-icon" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {searchTerm 
                ? `Nenhum repositório encontrado para "${searchTerm}".`
                : "Nenhum repositório encontrado neste projeto."
              }
            </span>
          </div>
        ) : (
          <div className="repositories-grid">
            {filteredRepositories.map((repo) => (
              <div key={repo.id} className="repository-card">
                <div className="repository-card-content">
                  <div className="repository-info">
                    <div className="repository-header">
                      <svg className="repository-icon" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6-4h6m2 5l-1.5 1.5L17 16l-2-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z" />
                      </svg>
                      <h3 className="repository-name">{repo.name}</h3>
                    </div>

                    <div className="repository-details">
                      {repo.defaultBranch && (
                        <div className="repository-detail">
                          <svg className="detail-icon" viewBox="0 0 24 24">
                            <path d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            Branch padrão: <code className="code-text">{repo.defaultBranch.replace('refs/heads/', '')}</code>
                          </span>
                        </div>
                      )}
                      
                      <div className="repository-detail">
                        <svg className="detail-icon" viewBox="0 0 24 24">
                          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>ID: <code className="code-text">{repo.id}</code></span>
                      </div>

                      <div className="repository-detail">
                        <svg className="detail-icon" viewBox="0 0 24 24">
                          <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <a 
                          href={repo.webUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="external-link"
                        >
                          Ver no Azure DevOps
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="repository-actions">
                    <button
                      onClick={() => onPullRequestsSelect(repo)}
                      disabled={isLoading}
                      className="btn btn-primary btn-sm"
                    >
                      <svg className="detail-icon" viewBox="0 0 24 24">
                        <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Listar Pull Requests
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <span>Carregando pull requests...</span>
          </div>
        )}
      </div>
    </div>
  );
}