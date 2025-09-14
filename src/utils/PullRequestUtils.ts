// src/utils/PullRequestUtils.ts
import { PullRequest } from "../core/entities/pull-request";
import type { LucideIcon } from "lucide-react";
import {
  Zap,
  Clock as ClockIcon,
  Timer,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  Hourglass,
  Check,
  X,
  FileText,
  Loader,
} from "lucide-react";

interface SLAInfo {
  value: number;
  unit: string;
  icon: LucideIcon; // referência ao componente (sem JSX aqui)
}

export class PullRequestUtils {
  filterReviewers(reviewers: any[]): any[] {
    return reviewers.filter(
      (r) =>
        r.displayName !== "[APPV - Fb-App-Vivo]\\Revisores N2" &&
        r.displayName !== "[APPV - Fb-App-Vivo]/Revisores N2"
    );
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  calculateSLA(creationDate: string, closedDate?: string): SLAInfo {
    const created = new Date(creationDate);
    const end = closedDate ? new Date(closedDate) : new Date();
    const diff = end.getTime() - created.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (seconds <= 59) {
      return { value: seconds, unit: seconds === 1 ? "segundo" : "segundos", icon: Zap };
    } else if (minutes <= 59) {
      return { value: minutes, unit: minutes === 1 ? "minuto" : "minutos", icon: ClockIcon };
    } else if (hours <= 23) {
      return { value: hours, unit: hours === 1 ? "hora" : "horas", icon: Timer };
    } else if (days <= 6) {
      return { value: days, unit: days === 1 ? "dia" : "dias", icon: CalendarDays };
    } else if (weeks <= 4) {
      return { value: weeks, unit: weeks === 1 ? "semana" : "semanas", icon: CalendarRange };
    } else {
      return { value: months, unit: months === 1 ? "mês" : "meses", icon: CalendarCheck };
    }
  }

  getSLAColorClass(creationDate: string, closedDate?: string): string {
    const created = new Date(creationDate);
    const end = closedDate ? new Date(closedDate) : new Date();
    const diff = end.getTime() - created.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours <= 24) return "sla-fresh";
    if (hours <= 72) return "sla-moderate";
    if (hours <= 168) return "sla-old";
    return "sla-critical";
  }

  formatWebUrl(org: string, project: string, pr: PullRequest): string {
    return `https://dev.azure.com/${org}/${project}/_git/${pr.repository.name}/pullrequest/${pr.pullRequestId}`;
  }

  sortReviewers(reviewers: any[]): any[] {
    return reviewers.sort((a, b) => {
      const aVoted = a.vote !== 0 && a.vote !== undefined;
      const bVoted = b.vote !== 0 && b.vote !== undefined;
      if (aVoted && !bVoted) return -1;
      if (!aVoted && bVoted) return 1;
      return a.displayName.localeCompare(b.displayName, "pt-BR", { sensitivity: "base" });
    });
  }

  async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        this.showCopyFeedback("URL copiada com sucesso!");
      } else {
        this.copyWithFallback(text);
        this.showCopyFeedback("URL copiada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao copiar URL:", error);
      this.showCopyFeedback("Erro ao copiar URL", true);
    }
  }

  private copyWithFallback(text: string): void {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.setAttribute("readonly", "");
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!ok) throw new Error("Fallback copy failed");
  }

  showCopyFeedback(message: string, isError = false): void {
    const feedback = document.createElement("div");
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${isError ? "#f44336" : "#4caf50"};
      color: white;
      border-radius: 4px;
      font-size: 14px;
      z-index: 10000;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => {
      feedback.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(feedback)) document.body.removeChild(feedback);
      }, 300);
    }, 3000);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "active":
        return "status-active";
      case "completed":
        return "status-completed";
      case "abandoned":
        return "status-abandoned";
      default:
        return "status-default";
    }
  }

  getStatusIcon(status: string): LucideIcon {
    switch (status.toLowerCase()) {
      case "active":
        return Loader;
      case "completed":
        return Check;
      case "abandoned":
        return X;
      default:
        return FileText;
    }
  }

  getReviewerStatusIcon(vote?: number): LucideIcon {
    if (vote === undefined || vote === 0) return Hourglass;
    if (vote > 0) return Check;
    if (vote < 0) return X;
    return Hourglass;
  }

  getReviewerStatusClass(vote?: number): string {
    if (vote === undefined || vote === 0) return "vote-waiting";
    if (vote > 0) return "vote-approved";
    if (vote < 0) return "vote-rejected";
    return "vote-waiting";
  }

  getReviewerStatusText(vote?: number): string {
    if (vote === undefined || vote === 0) return "Aguardando revisão";
    if (vote > 0) return "Aprovado";
    if (vote < 0) return "Rejeitado";
    return "Aguardando revisão";
  }

  sortPullRequests(list: PullRequest[]): PullRequest[] {
    return list.sort((a, b) => {
      const aActive = a.status.toLowerCase() === "active";
      const bActive = b.status.toLowerCase() === "active";
      if (aActive === bActive) {
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
      }
      return aActive ? -1 : 1;
    });
  }

  validatePRTitle(title: string): { isValid: boolean; errorMessage?: string } {
    const titleRegex = /^\[(HISTORIA|TASK):[A-Z0-9-]+\]\s+.+$/;
    if (!title?.trim()) return { isValid: false, errorMessage: "Título não pode estar vazio" };
    if (!titleRegex.test(title)) {
      if (!title.startsWith("[")) return { isValid: false, errorMessage: 'Título deve iniciar com "["' };
      if (!title.includes("HISTORIA:") && !title.includes("TASK:"))
        return { isValid: false, errorMessage: 'Título deve conter "HISTORIA:" ou "TASK:" após "["' };
      if (!title.includes("]")) return { isValid: false, errorMessage: 'Título deve conter "]" após o código' };
      const closingBracketIndex = title.indexOf("]");
      const afterBracket = title.substring(closingBracketIndex + 1);
      if (!afterBracket?.trim()) return { isValid: false, errorMessage: 'Título deve conter uma descrição após "]"' };
      if (!afterBracket.startsWith(" ")) return { isValid: false, errorMessage: 'Deve haver um espaço entre "]" e a descrição' };
      return { isValid: false, errorMessage: "Formato inválido. Use: [HISTORIA|TASK:código] descrição" };
    }
    return { isValid: true };
  }
}