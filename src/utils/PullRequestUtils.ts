import { PullRequest } from "../core/entities/pull-request";

interface SLAInfo {
  value: number;
  unit: string;
  icon: string;
}

export class PullRequestUtils {
  filterReviewers(reviewers: any[]): any[] {
    return reviewers.filter(reviewer => 
      reviewer.displayName !== "[APPV - Fb-App-Vivo]\\Revisores N2" &&
      reviewer.displayName !== "[APPV - Fb-App-Vivo]/Revisores N2"
    );
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateSLA(creationDate: string, closedDate?: string): SLAInfo {
    const created = new Date(creationDate);
    const endDate = closedDate ? new Date(closedDate) : new Date();
    const diffInMs = endDate.getTime() - created.getTime();
    
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
  }

  getSLAColorClass(creationDate: string, closedDate?: string): string {
    const created = new Date(creationDate);
    const endDate = closedDate ? new Date(closedDate) : new Date();
    const diffInMs = endDate.getTime() - created.getTime();
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (hours <= 24) {
      return 'sla-fresh';
    } else if (hours <= 72) {
      return 'sla-moderate';
    } else if (hours <= 168) {
      return 'sla-old';
    } else {
      return 'sla-critical';
    }
  }

  formatWebUrl(organization: string, project: string, pr: PullRequest): string {
    return `https://dev.azure.com/${organization}/${project}/_git/${pr.repository.name}/pullrequest/${pr.pullRequestId}`;
  }

  sortReviewers(reviewers: any[]): any[] {
    return reviewers.sort((a, b) => {
      const aVoted = a.vote !== 0 && a.vote !== undefined;
      const bVoted = b.vote !== 0 && b.vote !== undefined;
      
      if (aVoted && !bVoted) return -1;
      if (!aVoted && bVoted) return 1;
      
      return a.displayName.localeCompare(b.displayName, 'pt-BR', { sensitivity: 'base' });
    });
  }

  async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        this.showCopyFeedback('URL copiada com sucesso!');
      } else {
        this.copyWithFallback(text);
        this.showCopyFeedback('URL copiada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao copiar URL:', error);
      this.showCopyFeedback('Erro ao copiar URL', true);
    }
  }

  private copyWithFallback(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.setAttribute('readonly', '');
    
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (!successful) {
      throw new Error('Fallback copy failed');
    }
  }

  showCopyFeedback(message: string, isError = false): void {
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
    
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(feedback)) {
          document.body.removeChild(feedback);
        }
      }, 300);
    }, 3000);
  }

  getStatusColor(status: string): string {
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
  }

  getStatusIcon(status: string): string {
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
  }

  getReviewerStatusIcon(vote: number | undefined): string {
    if (vote === undefined || vote === 0) {
      return '⏳';
    } else if (vote > 0) {
      return '✓';
    } else if (vote < 0) {
      return '✗';
    }
    return '⏳';
  }

  getReviewerStatusClass(vote: number | undefined): string {
    if (vote === undefined || vote === 0) {
      return 'vote-waiting';
    } else if (vote > 0) {
      return 'vote-approved';
    } else if (vote < 0) {
      return 'vote-rejected';
    }
    return 'vote-waiting';
  }

  getReviewerStatusText(vote: number | undefined): string {
    if (vote === undefined || vote === 0) {
      return 'Aguardando revisão';
    } else if (vote > 0) {
      return 'Aprovado';
    } else if (vote < 0) {
      return 'Rejeitado';
    }
    return 'Aguardando revisão';
  }

  sortPullRequests(pullRequests: PullRequest[]): PullRequest[] {
    return pullRequests.sort((a, b) => {
      const aIsActive = a.status.toLowerCase() === 'active';
      const bIsActive = b.status.toLowerCase() === 'active';
      
      // Se ambos são active ou ambos não são active, ordenar por data de criação (mais recente primeiro)
      if (aIsActive === bIsActive) {
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
      }
      
      // Se apenas um é active, o active vem primeiro
      return aIsActive ? -1 : 1;
    });
  }

  validatePRTitle(title: string): { isValid: boolean; errorMessage?: string } {
    // Regex para validar: [HISTORIA|TASK:código] descrição
    const titleRegex = /^\[(HISTORIA|TASK):[A-Z0-9-]+\]\s+.+$/;
    
    if (!title || title.trim() === '') {
      return {
        isValid: false,
        errorMessage: 'Título não pode estar vazio'
      };
    }

    if (!titleRegex.test(title)) {
      // Verificar problemas específicos para dar feedback mais detalhado
      if (!title.startsWith('[')) {
        return {
          isValid: false,
          errorMessage: 'Título deve iniciar com "["'
        };
      }

      if (!title.includes('HISTORIA:') && !title.includes('TASK:')) {
        return {
          isValid: false,
          errorMessage: 'Título deve conter "HISTORIA:" ou "TASK:" após "["'
        };
      }

      if (!title.includes(']')) {
        return {
          isValid: false,
          errorMessage: 'Título deve conter "]" após o código'
        };
      }

      const closingBracketIndex = title.indexOf(']');
      const afterBracket = title.substring(closingBracketIndex + 1);
      
      if (!afterBracket || !afterBracket.trim()) {
        return {
          isValid: false,
          errorMessage: 'Título deve conter uma descrição após "]"'
        };
      }

      if (!afterBracket.startsWith(' ')) {
        return {
          isValid: false,
          errorMessage: 'Deve haver um espaço entre "]" e a descrição'
        };
      }

      return {
        isValid: false,
        errorMessage: 'Formato inválido. Use: [HISTORIA|TASK:código] descrição'
      };
    }

    return { isValid: true };
  }

}
