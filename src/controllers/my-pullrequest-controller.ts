import { PullRequest } from "../core/entities/pull-request";
import { PullRequestUtils } from "../utils/PullRequestUtils";

export class MyPullRequestController {
  private utils: PullRequestUtils;

  constructor() {
    this.utils = new PullRequestUtils();
  }

  processStatusData(status: string) {
    return {
      color: this.utils.getStatusColor(status),
      icon: this.utils.getStatusIcon(status)
    };
  }

  processReviewerData(vote: number | undefined) {
    return {
      icon: this.utils.getReviewerStatusIcon(vote),
      className: this.utils.getReviewerStatusClass(vote),
      text: this.utils.getReviewerStatusText(vote)
    };
  }

  processPullRequestData(pr: PullRequest, organization: string, project: string) {
    const filteredReviewers = this.utils.filterReviewers(pr.reviewers || []);
    const closedDate = (pr.status.toLowerCase() === 'abandoned' || pr.status.toLowerCase() === 'completed') 
      ? pr.closedDate 
      : undefined;
    const sla = this.utils.calculateSLA(pr.creationDate, closedDate);
    const slaColorClass = this.utils.getSLAColorClass(pr.creationDate, closedDate);
    const webUrl = this.utils.formatWebUrl(organization, project, pr);
    const titleValidation = this.utils.validatePRTitle(pr.title);
    
    return {
      ...pr,
      filteredReviewers: this.utils.sortReviewers(filteredReviewers),
      sla,
      slaColorClass,
      webUrl,
      formattedCreationDate: this.utils.formatDate(pr.creationDate),
      titleValidation
    };
  }

  async handleCopyToClipboard(pr: PullRequest, organization: string, project: string): Promise<void> {
    const webUrl = this.utils.formatWebUrl(organization, project, pr);
    await this.utils.copyToClipboard(webUrl);
  }

  async handleOpenPR(pr: PullRequest, organization: string, project: string): Promise<void> {
    const webUrl = this.utils.formatWebUrl(organization, project, pr);
    window.open(webUrl, "_blank", "noopener,noreferrer");
  }

  sortPullRequests(pullRequests: PullRequest[]): PullRequest[] {
    return this.utils.sortPullRequests(pullRequests);
  }

}
