import { ProcessedPullRequest, PullRequestController } from "../../controllers/pullrequest-controller";
import { PullRequestCard } from "./PullRequestCard";
import { EmptyMessage } from "./EmptyMessage";

interface PullRequestListProps {
  pullRequests: ProcessedPullRequest[];
  statusFilter: string;
  controller: PullRequestController;
  onCopyToClipboard: (pr: ProcessedPullRequest) => void;
  onOpenPR: (pr: ProcessedPullRequest) => void;
}

export function PullRequestList({
  pullRequests,
  statusFilter,
  controller,
  onCopyToClipboard,
  onOpenPR,
}: PullRequestListProps) {
  if (pullRequests.length === 0) {
    return <EmptyMessage statusFilter={statusFilter} />;
  }

  return (
    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
      {pullRequests.map((pr) => (
        <PullRequestCard
          key={pr.pullRequestId}
          pullRequest={pr}
          controller={controller}
          onCopyToClipboard={onCopyToClipboard}
          onOpenPR={onOpenPR}
        />
      ))}
    </div>
  );
}