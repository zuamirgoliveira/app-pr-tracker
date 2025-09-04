import { PullRequestController, ProcessedPullRequest } from "../../controllers/pullrequest-controller";

interface PullRequestCardProps {
  pullRequest: ProcessedPullRequest;
  controller: PullRequestController;
  onCopyToClipboard: (pr: ProcessedPullRequest) => void;
  onOpenPR: (pr: ProcessedPullRequest) => void;
}

export function PullRequestCard({
  pullRequest: pr,
  controller,
  onCopyToClipboard,
  onOpenPR
}: PullRequestCardProps) {
  return (
    <div className="pr-card">
      {/* PR Header */}
      <div className="pr-card-header">
        <div className="pr-header-left">
          <div className="pr-badges">
            <span className="pr-id">#{pr.pullRequestId}</span>
            <span className={`pr-status ${pr.statusData.color}`}>
              <span className="status-icon">{pr.statusData.icon}</span>
              {pr.status}
            </span>
            {pr.isDraft && (
              <span className="pr-draft-badge">DRAFT</span>
            )}
            {!pr.titleValidation.isValid && (
              <span 
                className="pr-title-invalid-badge"
                title={`${pr.titleValidation.errorMessage}`}
              >
                ⚠️ TÍTULO
              </span>
            )}
          </div>
          <span className="pr-id">{pr.repository.name}</span>
          <h3 className={`pr-card-title`}>
            {pr.title}
          </h3>
        </div>
        
        <div className="pr-actions">
          <button
            onClick={() => onOpenPR(pr)}
            className="pr-action-btn pr-view-btn"
          >
            🔗 Ver PR
          </button>
          <button
            onClick={() => onCopyToClipboard(pr)}
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
}