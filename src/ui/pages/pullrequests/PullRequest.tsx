import { useMemo, useState } from "react";
import { PullRequest } from "../../../core/entities/pull-request";
import { Repository } from "../../../core/entities/repository";
import { PullRequestController } from "../../../controllers/pullrequest-controller";
import {
  ArrowLeft,
  RefreshCcw,
  User,
  Clock,
  GitBranch,
  Users,
  AlertTriangle,
  Clipboard,
  Link as LinkIcon,
  X,
} from "lucide-react";

interface PullRequestListProps {
  pullRequests: PullRequest[];
  repository: Repository;
  organization: string;
  project: string;
  isLoading?: boolean;
  onBackToRepositories: () => void;
  onBackToProjects?: () => void;
  onBackToLogin: () => void;
  onRefreshPullRequests: () => void;
}

export default function PullRequestList({
  pullRequests,
  repository,
  organization,
  project,
  isLoading = false,
  onBackToRepositories,
  onBackToProjects,
  onBackToLogin,
  onRefreshPullRequests,
}: PullRequestListProps) {
  const controller = useMemo(() => new PullRequestController(), []);
  const [statusFilter, setStatusFilter] = useState("Active");

  const availableStatuses = useMemo(() => {
    const statuses = Array.from(new Set(pullRequests.map((pr) => pr.status)));
    return ["ALL", ...statuses];
  }, [pullRequests]);

  const filteredPullRequests = useMemo(() => {
    if (statusFilter === "ALL") return pullRequests;
    return pullRequests.filter(
      (pr) => pr.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [pullRequests, statusFilter]);

  const processedPullRequests = useMemo(() => {
    const sorted = controller.sortPullRequests(filteredPullRequests);
    return sorted.map((pr) =>
      controller.processPullRequestData(pr, organization, project)
    );
  }, [filteredPullRequests, organization, project, controller]);

  const handleCopyToClipboard = async (pr: PullRequest) => {
    await controller.handleCopyToClipboard(pr, organization, project);
  };

  const handleOpenPR = async (pr: PullRequest) => {
    await controller.handleOpenPR(pr, organization, project);
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-6xl px-6 md:px-10 lg:px-16 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img
              src="/banner-pr-tracker.png"
              alt="PR Tracker Banner"
              className="h-auto max-w-sm rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-michroma text-slate-800 dark:text-slate-100">
            Pull Requests – {repository.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {organization} / {project} • {filteredPullRequests.length} PR(s)
            {statusFilter !== "ALL" && ` (${statusFilter})`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-between items-center mb-8">
          <div className="flex gap-3">
            <button
              onClick={onBackToLogin}
              disabled={isLoading}
              className="nav-btn"
            >
              <ArrowLeft className="h-4 w-4" /> Login
            </button>
            {onBackToProjects && (
              <button
                onClick={onBackToProjects}
                disabled={isLoading}
                className="nav-btn"
              >
                <ArrowLeft className="h-4 w-4" /> Projetos
              </button>
            )}
            <button
              onClick={onBackToRepositories}
              disabled={isLoading}
              className="nav-btn"
            >
              <ArrowLeft className="h-4 w-4" /> Repositórios
            </button>
            <button
              onClick={onRefreshPullRequests}
              disabled={isLoading}
              title="Atualizar lista de PRs"
              className="nav-btn"
            >
              <RefreshCcw className="h-4 w-4" /> Atualizar
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <label htmlFor="status-filter" className="text-sm font-medium">
              Filtrar por status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={isLoading}
              className="rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
                        dark:bg-slate-900/50 dark:text-slate-50 dark:border-slate-600"
            >
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "Todos os Status" : status}
                </option>
              ))}
            </select>
            {statusFilter !== "ALL" && (
              <button
                onClick={() => setStatusFilter("ALL")}
                type="button"
                title="Limpar filtro"
                className="filter-clear-btn"
              >
                <X className="h-4 w-4" /> Limpar
              </button>
            )}
          </div>
        </div>

        {/* Pull Requests */}
        {filteredPullRequests.length === 0 ? (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5" />
            <span>
              {statusFilter === "ALL"
                ? "Nenhum pull request encontrado neste repositório."
                : `Nenhum pull request com status "${statusFilter}" encontrado.`}
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            {processedPullRequests.map((pr) => {
              const statusData = controller.processStatusData(pr.status);

              return (
                <div
                  key={pr.pullRequestId}
                  className="p-6 rounded-xl border bg-white shadow hover:shadow-lg transition
                            dark:bg-slate-800 dark:border-slate-600"
                >
                  {/* PR Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700">
                          #{pr.pullRequestId}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${statusData.color}`}
                        >
                          <statusData.icon className="h-3 w-3 inline mr-1" /> {pr.status}
                        </span>
                        {pr.isDraft && (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-slate-200 dark:bg-slate-700">
                            DRAFT
                          </span>
                        )}
                        {!pr.titleValidation.isValid && (
                          <span
                            className="pr-title-invalid-badge"
                            title={pr.titleValidation.errorMessage}
                          >
                            <AlertTriangle className="h-4 w-4 text-amber-500" /> TÍTULO
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold">{pr.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenPR(pr)}
                        className="btn btn-secondary btn-sm"
                      >
                        <LinkIcon className="h-4 w-4" /> Ver PR
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(pr)}
                        className="btn btn-secondary btn-sm"
                        title="Copiar URL do PR"
                      >
                        <Clipboard className="h-4 w-4" /> Copiar URL
                      </button>
                    </div>
                  </div>

                  {/* PR Details */}
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        <strong>Autor:</strong> {pr.createdBy.displayName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        <strong>Criado:</strong> {pr.formattedCreationDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-green-500" />
                      <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-xs">
                        {pr.sourceRefName.replace("refs/heads/", "")}
                      </code>
                      →
                      <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-xs">
                        {pr.targetRefName.replace("refs/heads/", "")}
                      </code>
                    </div>
                    <div>
                      <strong>SLA:</strong>{" "}
                      <span className={`sla-value ${pr.slaColorClass}`}>
                        {pr.sla.value} {pr.sla.unit}
                      </span>
                    </div>

                    {/* Reviewers */}
                    {pr.filteredReviewers.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4" />
                          <span className="font-semibold">Revisores:</span>
                        </div>
                        <div className="space-y-1">
                          {pr.filteredReviewers.map((reviewer, idx) => {
                            const reviewerData =
                              controller.processReviewerData(reviewer.vote);
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 rounded-md bg-slate-50 dark:bg-slate-900/30"
                              >
                                <span
                                  className={`h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold ${reviewerData.className}`}
                                  title={reviewerData.text}
                                >
                                  <reviewerData.icon className="h-4 w-4" />
                                </span>
                                <span>{reviewer.displayName}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading */}
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