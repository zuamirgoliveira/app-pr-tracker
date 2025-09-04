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
  statusFilter
}: PullRequestHeaderProps) {
  return (
    <div className="pr-header">
      <Banner 
        src="/banner-pr-tracker.png" 
        alt="PR Tracker Banner" 
      />
      <h1 className="pr-title">Meus Pull Requests</h1>
      <p className="pr-meta-info">
        {organization} / {project} • {filteredCount} PR(s) encontrado(s)
        {statusFilter !== "ALL" && ` (${statusFilter})`}
      </p>
    </div>
  );
}
