import { cn } from "../../lib/utils";
import {
  Link as LinkIcon,
  Clipboard,
  User,
  Clock,
  GitBranch,
  Users,
  AlertTriangle,
  ArrowRight,
  DraftingCompass, // só para ilustrar "draft"
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";
import { PullRequestController, ProcessedPullRequest } from "../../controllers/pullrequest-controller";

interface PullRequestCardProps {
  pullRequest: ProcessedPullRequest;
  controller: PullRequestController;
  onCopyToClipboard: (pr: ProcessedPullRequest) => void;
  onOpenPR: (pr: ProcessedPullRequest) => void;
}

const statusClasses: Record<string, string> = {
  active: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
  abandoned: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30",
  new: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30",
  default: "bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-400 border border-slate-300 dark:border-slate-600",
};

const slaClasses: Record<string, string> = {
  fresh: "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30",
  moderate: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30",
  old: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/30",
  critical: "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30",
};

export function PullRequestCard({
  pullRequest: pr,
  controller,
  onCopyToClipboard,
  onOpenPR,
}: PullRequestCardProps) {
  // Deriva variantes (fallbacks seguros)
  const statusVariant = (pr.status?.toLowerCase() || "default") as keyof typeof statusClasses;
  const statusBadgeClass = statusClasses[statusVariant] ?? statusClasses.default;

  const slaVariant = (pr.sla?.variant || pr.slaColorClass || "fresh") as keyof typeof slaClasses;
  const slaBadgeClass = slaClasses[slaVariant] ?? slaClasses.fresh;

  const titleInvalid = !pr.titleValidation.isValid;

  return (
    <div
      className={cn(
        "rounded-xl border p-6 transition-all duration-300 bg-white border-slate-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-700/30 dark:border-slate-600",
        titleInvalid && "border-l-2 border-amber-400 bg-amber-50/40 dark:bg-amber-50/10"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              #{pr.pullRequestId}
            </span>

            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium uppercase", statusBadgeClass)}>
              {/* status icon heurística */}
              {statusVariant === "completed" ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : statusVariant === "abandoned" ? (
                <XCircle className="h-3.5 w-3.5" />
              ) : statusVariant === "new" ? (
                <Hourglass className="h-3.5 w-3.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 opacity-70" />
              )}
              {pr.status}
            </span>

            {pr.isDraft && (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600 dark:border-slate-600 dark:bg-slate-700/40 dark:text-slate-300">
                <DraftingCompass className="h-3.5 w-3.5" />
                Draft
              </span>
            )}

            {titleInvalid && (
              <span
                className="inline-flex items-center gap-1 rounded-full border border-amber-400 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800 cursor-help transition-colors hover:bg-amber-200"
                title={pr.titleValidation.errorMessage}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Título
              </span>
            )}
          </div>

          {/* Repo + Title */}
          <span className="truncate text-xs text-slate-500 dark:text-slate-400">{pr.repository.name}</span>
          <h3
            className={cn(
              "truncate font-lexend text-base font-medium text-slate-900 dark:text-slate-50",
              titleInvalid && "pl-3 border-l-4 border-red-600 text-red-700 dark:text-red-400"
            )}
            title={pr.title}
          >
            {pr.title}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            onClick={() => onOpenPR(pr)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-200 px-3 py-2 text-sm text-slate-800 transition-all duration-300 hover:bg-slate-100 hover:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-700/80 dark:text-slate-50 dark:border-slate-600"
          >
            <LinkIcon className="h-4 w-4" />
            Ver PR
          </button>
          <button
            onClick={() => onCopyToClipboard(pr)}
            type="button"
            title="Copiar URL do PR"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-200 px-3 py-2 text-sm text-slate-800 transition-all duration-300 hover:bg-slate-100 hover:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-700/80 dark:text-slate-50 dark:border-slate-600"
          >
            <Clipboard className="h-4 w-4" />
            Copiar URL
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {/* Author */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium text-slate-600 dark:text-slate-400">Autor:</span> {pr.createdBy.displayName}
          </span>
        </div>

        {/* Creation Date */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium text-slate-600 dark:text-slate-400">Criado:</span> {pr.formattedCreationDate}
          </span>
        </div>

        {/* Branches */}
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <code className="rounded bg-slate-900/50 px-2 py-1 font-mono text-xs text-green-300">
              {pr.sourceRefName.replace("refs/heads/", "")}
            </code>
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <code className="rounded bg-slate-900/50 px-2 py-1 font-mono text-xs text-blue-300">
              {pr.targetRefName.replace("refs/heads/", "")}
            </code>
          </span>
        </div>

        {/* SLA */}
        <div className="flex items-center gap-2">
          {/* Se quiser mapear ícone por SLA: */}
          {slaVariant === "fresh" ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : slaVariant === "critical" ? (
            <XCircle className="h-4 w-4 text-red-500" />
          ) : (
            <Hourglass className="h-4 w-4 text-amber-500" />
          )}
          <span className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium text-slate-600 dark:text-slate-400">SLA:</span>{" "}
            <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-sm", slaBadgeClass)}>
              {pr.sla.value} {pr.sla.unit}
            </span>
          </span>
        </div>

        {/* Reviewers */}
        {pr.filteredReviewers.length > 0 && (
          <div className="md:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Revisores:</span>
            </div>
            <div className="flex flex-col gap-2">
              {pr.filteredReviewers.map((reviewer, index) => {
                const reviewerData = controller.processReviewerData(reviewer.vote);
                // reviewerData.className/icon vinham do legado; vamos normalizar:
                const voteClass =
                  reviewerData?.className === "vote-approved"
                    ? "bg-green-500/20 text-green-700 dark:text-green-400 border-l-green-500"
                    : reviewerData?.className === "vote-rejected"
                    ? "bg-red-500/20 text-red-700 dark:text-red-400 border-l-red-500"
                    : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-l-yellow-500";

                const VoteIcon =
                  reviewerData?.className === "vote-approved"
                    ? CheckCircle2
                    : reviewerData?.className === "vote-rejected"
                    ? XCircle
                    : Hourglass;

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-3 rounded-md border-l-2 p-2 transition-all duration-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/30 dark:hover:bg-slate-900/50",
                      voteClass
                    )}
                    title={reviewerData?.text}
                  >
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                      <VoteIcon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{reviewer.displayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}