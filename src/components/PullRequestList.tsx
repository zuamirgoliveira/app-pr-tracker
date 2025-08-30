import { PullRequest, Repository } from "../types";

interface PullRequestListProps {
  pullRequests: PullRequest[];
  repository: Repository;
  organization: string;
  project: string;
  isLoading?: boolean;
  onBackToRepositories: () => void;
  onBackToProjects?: () => void;
  onBackToLogin: () => void;
}

export default function PullRequestList({
  pullRequests,
  repository,
  organization,
  project,
  isLoading = false,
  onBackToRepositories,
  onBackToProjects,
  onBackToLogin
}: PullRequestListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'abandoned':
        return 'status-abandoned';
      default:
        return 'status-default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '⏱️';
      case 'completed':
        return '✅';
      case 'abandoned':
        return '❌';
      default:
        return '📝';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="pr-list-container">
      {/* Header Section */}
      <div className="pr-header">
        <div className="banner-container">
          <img 
            src="/banner-pr-tracker.png" 
            alt="PR Tracker Banner" 
            className="page-banner"
          />
        </div>
        <h1 className="pr-title">Pull Requests</h1>
        <p className="pr-repo-name">{repository.name}</p>
        <p className="pr-meta-info">
          {organization} / {project} • {pullRequests.length} PR(s) encontrado(s)
        </p>
      </div>

      {/* Main Container */}
      <div className="pr-main-container">
        {/* Header Actions */}
        <div className="pr-nav-buttons">
          <button
            onClick={onBackToLogin}
            className="nav-btn"
            disabled={isLoading}
          >
            ← Login
          </button>
          {onBackToProjects && (
            <button
              onClick={onBackToProjects}
              className="nav-btn"
              disabled={isLoading}
            >
              ← Projetos
            </button>
          )}
          <button
            onClick={onBackToRepositories}
            className="nav-btn"
            disabled={isLoading}
          >
            ← Repositórios
          </button>
        </div>

        {/* Pull Requests List */}
        {pullRequests.length === 0 ? (
          <div className="pr-empty-message">
            <span className="info-icon">ℹ️</span>
            <span>Nenhum pull request encontrado neste repositório.</span>
          </div>
        ) : (
          <div className="pr-list">
            {pullRequests.map((pr) => (
              <div key={pr.pullRequestId} className="pr-card">
                {/* PR Header */}
                <div className="pr-card-header">
                  <div className="pr-header-left">
                    <div className="pr-badges">
                      <span className="pr-id">#{pr.pullRequestId}</span>
                      <span className={`pr-status ${getStatusColor(pr.status)}`}>
                        <span className="status-icon">{getStatusIcon(pr.status)}</span>
                        {pr.status}
                      </span>
                      {pr.isDraft && (
                        <span className="pr-draft-badge">DRAFT</span>
                      )}
                    </div>
                    <h3 className="pr-card-title">{pr.title}</h3>
                    {pr.description && (
                      <p className="pr-description">{pr.description}</p>
                    )}
                  </div>
                  
                  <div className="pr-actions">
                    <a
                      href={pr.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pr-view-btn"
                    >
                      🔗 Ver PR
                    </a>
                  </div>
                </div>

                {/* PR Details */}
                <div className="pr-details">
                  {/* Author */}
                  <div className="pr-detail-item">
                    <span className="detail-icon">👤</span>
                    <span className="detail-content">
                      <span className="detail-label">Autor:</span> {pr.createdBy.displayName}
                    </span>
                  </div>

                  {/* Creation Date */}
                  <div className="pr-detail-item">
                    <span className="detail-icon">🕒</span>
                    <span className="detail-content">
                      <span className="detail-label">Criado:</span> {formatDate(pr.creationDate)}
                    </span>
                  </div>

                  {/* Branches */}
                  <div className="pr-detail-item">
                    <span className="detail-icon">🌿</span>
                    <span className="detail-content">
                      <code className="branch-name source-branch">
                        {pr.sourceRefName.replace('refs/heads/', '')}
                      </code>
                      <span className="branch-arrow">→</span>
                      <code className="branch-name target-branch">
                        {pr.targetRefName.replace('refs/heads/', '')}
                      </code>
                    </span>
                  </div>

                  {/* Reviewers */}
                  {pr.reviewers && pr.reviewers.length > 0 && (
                    <div className="pr-detail-item pr-reviewers">
                      <span className="detail-icon">👥</span>
                      <div className="reviewers-content">
                        <span className="detail-label">Revisores:</span>
                        <div className="reviewers-list">
                          {pr.reviewers.map((reviewer, index) => (
                            <span key={index} className="reviewer-item">
                              <span className="reviewer-name">{reviewer.displayName}</span>
                              {reviewer.vote !== undefined && reviewer.vote !== 0 && (
                                <span className={`reviewer-vote ${reviewer.vote > 0 ? 'vote-approved' : 'vote-rejected'}`}>
                                  {reviewer.vote > 0 ? '✓' : '✗'}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <span>Carregando pull requests...</span>
          </div>
        )}
      </div>
    </div>
  );
}