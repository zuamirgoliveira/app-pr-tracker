import { PullRequest, Repository } from "../types";
import { PullRequestController } from "../controllers/PullRequestController";
import { useMemo } from "react";

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
  const controller = useMemo(() => new PullRequestController(), []);

  const processedPullRequests = useMemo(() => {
    const sortedPullRequests = controller.sortPullRequests(pullRequests);
    return sortedPullRequests.map(pr => 
      controller.processPullRequestData(pr, organization, project)
    );
  }, [pullRequests, organization, project, controller]);

  const handleCopyToClipboard = async (pr: PullRequest) => {
    await controller.handleCopyToClipboard(pr, organization, project);
  };

  const handleOpenPR = async (pr: PullRequest) => {
    await controller.handleOpenPR(pr, organization, project);
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
            {processedPullRequests.map((pr) => {
              const statusData = controller.processStatusData(pr.status);
              
              return (
                <div key={pr.pullRequestId} className="pr-card">
                  {/* PR Header */}
                  <div className="pr-card-header">
                    <div className="pr-header-left">
                      <div className="pr-badges">
                        <span className="pr-id">#{pr.pullRequestId}</span>
                        <span className={`pr-status ${statusData.color}`}>
                          <span className="status-icon">{statusData.icon}</span>
                          {pr.status}
                        </span>
                        {pr.isDraft && (
                          <span className="pr-draft-badge">DRAFT</span>
                        )}
                      </div>
                      <h3 className="pr-card-title">{pr.title}</h3>
                    </div>
                    
                    <div className="pr-actions">
                      <button
                        onClick={() => handleOpenPR(pr)}
                        className="pr-action-btn pr-view-btn"
                      >
                        🔗 Ver PR
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(pr)}
                        className="pr-action-btn pr-view-btn"
                        type="button"
                        title="Copiar URL do PR"
                      >
                        📋 Copiar URL
                      </button>
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
                        <span className="detail-label">Criado:</span> {pr.formattedCreationDate}
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
                    {/* SLA */}
                    <div className="pr-detail-item">
                      <span className="detail-icon">{pr.sla.icon}</span>
                      <span className="detail-content">
                        <span className="detail-label">SLA:</span>{' '}
                        <span className={`sla-value ${pr.slaColorClass}`}>
                          {pr.sla.value} {pr.sla.unit}
                        </span>
                      </span>
                    </div>

                    {/* Reviewers */}
                    {pr.filteredReviewers.length > 0 && (
                      <div className="pr-detail-item pr-reviewers-section">
                        <span className="detail-icon">👥</span>
                        <div className="reviewers-content-vertical">
                          <span className="detail-label">Revisores:</span>
                          <div className="reviewers-vertical-list">
                            {pr.filteredReviewers.map((reviewer, index) => {
                              const reviewerData = controller.processReviewerData(reviewer.vote);
                              
                              return (
                                <div key={index} className="reviewer-item-vertical">
                                  <span 
                                    className={`reviewer-vote-icon ${reviewerData.className}`}
                                    title={reviewerData.text}
                                  >
                                    {reviewerData.icon}
                                  </span>
                                  <span className="reviewer-name-vertical">
                                    {reviewer.displayName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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