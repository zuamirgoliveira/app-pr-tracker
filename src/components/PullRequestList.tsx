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

  const getReviewerStatusIcon = (vote: number | undefined) => {
    if (vote === undefined || vote === 0) {
      return '⏳'; // No review yet / Wait for author
    } else if (vote > 0) {
      return '✓'; // Approved
    } else if (vote < 0) {
      return '✗'; // Rejected
    }
    return '⏳';
  };

  const getReviewerStatusClass = (vote: number | undefined) => {
    if (vote === undefined || vote === 0) {
      return 'vote-waiting'; // No review yet / Wait for author
    } else if (vote > 0) {
      return 'vote-approved'; // Approved
    } else if (vote < 0) {
      return 'vote-rejected'; // Rejected
    }
    return 'vote-waiting';
  };

  const getReviewerStatusText = (vote: number | undefined) => {
    if (vote === undefined || vote === 0) {
      return 'Aguardando revisão';
    } else if (vote > 0) {
      return 'Aprovado';
    } else if (vote < 0) {
      return 'Rejeitado';
    }
    return 'Aguardando revisão';
  };

  const filterReviewers = (reviewers: any[]) => {
    return reviewers.filter(reviewer => 
      reviewer.displayName !== "[APPV - Fb-App-Vivo]\\Revisores N2" &&
      reviewer.displayName !== "[APPV - Fb-App-Vivo]/Revisores N2"
    );
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

  const calculateSLA = (creationDate: string) => {
    const created = new Date(creationDate);
    const now = new Date();
    const diffInMs = now.getTime() - created.getTime();
    
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (seconds <= 59) {
      return {
        value: seconds,
        unit: seconds === 1 ? 'segundo' : 'segundos',
        icon: '⚡'
      };
    } else if (minutes <= 59) {
      return {
        value: minutes,
        unit: minutes === 1 ? 'minuto' : 'minutos',
        icon: '🕐'
      };
    } else if (hours <= 23) {
      return {
        value: hours,
        unit: hours === 1 ? 'hora' : 'horas',
        icon: '⏰'
      };
    } else if (days <= 6) {
      return {
        value: days,
        unit: days === 1 ? 'dia' : 'dias',
        icon: '📅'
      };
    } else if (weeks <= 4) {
      return {
        value: weeks,
        unit: weeks === 1 ? 'semana' : 'semanas',
        icon: '📆'
      };
    } else {
      return {
        value: months,
        unit: months === 1 ? 'mês' : 'meses',
        icon: '🗓️'
      };
    }
  };

  const getSLAColorClass = (creationDate: string) => {
    const created = new Date(creationDate);
    const now = new Date();
    const diffInMs = now.getTime() - created.getTime();
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));

    // Definir cores baseadas no tempo decorrido
    if (hours <= 24) {
      return 'sla-fresh'; // Verde - recente
    } else if (hours <= 72) {
      return 'sla-moderate'; // Amarelo - moderado
    } else if (hours <= 168) {
      return 'sla-old'; // Laranja - antigo
    } else {
      return 'sla-critical'; // Vermelho - crítico
    }
  };

  const copyToClipboard = async (pr : any): Promise<void> => {
    try {
      var webUrl = await formattWebUrl(pr);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(webUrl);
        // Melhor UX: mostrar feedback visual temporário ao invés de alert
        showCopyFeedback('URL copiada com sucesso!');
      } else {
        // Fallback otimizado para navegadores antigos
        copyWithFallback(webUrl);
        showCopyFeedback('URL copiada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao copiar URL:', error);
      showCopyFeedback('Erro ao copiar URL', true);
    }
  };

  const copyWithFallback = (text: string): void => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.setAttribute('readonly', '');
    
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999); // Para dispositivos móveis
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (!successful) {
      throw new Error('Fallback copy failed');
    }
  };

  const showCopyFeedback = (message: string, isError = false): void => {
    // Criar elemento de feedback temporário
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${isError ? '#f44336' : '#4caf50'};
      color: white;
      border-radius: 4px;
      font-size: 14px;
      z-index: 10000;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    // Remover após 3 segundos
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(feedback)) {
          document.body.removeChild(feedback);
        }
      }, 300);
    }, 3000);
  };

  const formattWebUrl = (pr : any): Promise<string> => {
    return new Promise((resolve) => {
      var webUrl = `https://dev.azure.com/${organization}/${project}/_git/${pr.repository.name}/pullrequest/${pr.pullRequestId}`;
      resolve(webUrl);
    });
  };

  const sortReviewers = (reviewers: any[]) => {
    return reviewers.sort((a, b) => {
      // Primeiro critério: revisores que votaram (vote !== 0) vêm primeiro
      const aVoted = a.vote !== 0 && a.vote !== undefined;
      const bVoted = b.vote !== 0 && b.vote !== undefined;
      
      if (aVoted && !bVoted) return -1;
      if (!aVoted && bVoted) return 1;
      
      // Segundo critério: ordem alfabética dentro do mesmo grupo
      return a.displayName.localeCompare(b.displayName, 'pt-BR', { sensitivity: 'base' });
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
            {pullRequests.map((pr) => {
              const filteredReviewers = pr.reviewers ? filterReviewers(pr.reviewers) : [];
              const sla = calculateSLA(pr.creationDate);
              
              return (
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
                    </div>
                    
                    <div className="pr-actions">
                      <button
                        onClick={async () => {
                          const url = await formattWebUrl(pr);
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                        className="pr-action-btn pr-view-btn"
                      >
                        🔗 Ver PR
                      </button>
                      <button
                        onClick={() => copyToClipboard(pr)}
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
                    {/* SLA */}
                    <div className="pr-detail-item">
                      <span className="detail-icon">{sla.icon}</span>
                      <span className="detail-content">
                        <span className="detail-label">SLA:</span>{' '}
                        <span className={`sla-value ${getSLAColorClass(pr.creationDate)}`}>
                          {sla.value} {sla.unit}
                        </span>
                      </span>
                    </div>

                    {/* Reviewers */}
                    {/* Reviewers */}
                    {filteredReviewers.length > 0 && (
                      <div className="pr-detail-item pr-reviewers-section">
                        <span className="detail-icon">👥</span>
                        <div className="reviewers-content-vertical">
                          <span className="detail-label">Revisores:</span>
                          <div className="reviewers-vertical-list">
                            {sortReviewers(filteredReviewers).map((reviewer, index) => (
                              <div key={index} className="reviewer-item-vertical">
                                <span 
                                  className={`reviewer-vote-icon ${getReviewerStatusClass(reviewer.vote)}`}
                                  title={getReviewerStatusText(reviewer.vote)}
                                >
                                  {getReviewerStatusIcon(reviewer.vote)}
                                </span>
                                <span className="reviewer-name-vertical">
                                  {reviewer.displayName}
                                </span>
                              </div>
                            ))}
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