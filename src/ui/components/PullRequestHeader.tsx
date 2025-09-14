import { Banner } from "./Banner";

interface PullRequestHeaderProps {
  organization: string;
  project: string;
  filteredCount: number;
  statusFilter: string;
}

export function PullRequestHeader({
  organization,
  project,
  filteredCount,
  statusFilter,
}: PullRequestHeaderProps) {
  return (
    <header className="flex flex-col items-center justify-center gap-4 text-center">
      <Banner src="/banner-pr-tracker.png" alt="PR Tracker Banner" />

      <h1 className="font-michroma text-heading-1 text-slate-900 dark:text-slate-50">
        Meus Pull Requests
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        {organization} / {project} • {filteredCount} PR(s) encontrado(s)
        {statusFilter !== "ALL" && ` (${statusFilter})`}
      </p>
    </header>
  );
}