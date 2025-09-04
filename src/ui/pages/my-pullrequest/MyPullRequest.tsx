import { PullRequest } from "../../../core/entities/pull-request";
import { PullRequestController, ProcessedPullRequest } from "../../../controllers/pullrequest-controller";
import { useMemo, useState } from "react";
import { PullRequestHeader } from "../../components/PullRequestHeader";
import { NavigationButtons } from "../../components/NavigationButtons";
import { StatusFilter } from "../../components/StatusFilter";
import { PullRequestList } from "../../components/PullRequestList";
import { LoadingOverlay } from "../../components/LoadingOverlay";

interface MyPullRequestListProps {
  pullRequests: PullRequest[];
  organization: string;
  project: string;
  isLoading?: boolean;
  onBackToLogin: () => void;
  onRefreshPullRequests: () => void;
}

export default function MyPullRequestList({
  pullRequests,
  organization,
  project,
  isLoading = false,
  onBackToLogin,
  onRefreshPullRequests
}: MyPullRequestListProps) {
  const controller = useMemo(() => new PullRequestController(), []);
  const [statusFilter, setStatusFilter] = useState("Active");

  const availableStatuses = useMemo(() => {
    const statuses = Array.from(new Set(pullRequests.map(pr => pr.status)));
    return ["ALL", ...statuses];
  }, [pullRequests]);

  const filteredPullRequests = useMemo(() => {
    if (statusFilter === "ALL") {
      return pullRequests;
    }
    return pullRequests.filter(pr => pr.status.toLowerCase() === statusFilter.toLowerCase());
  }, [pullRequests, statusFilter]);

  const processedPullRequests = useMemo(() => {
    const sortedPullRequests = controller.sortPullRequests(filteredPullRequests);
    return sortedPullRequests.map(pr => 
      controller.processPullRequestData(pr, organization, project)
    );
  }, [filteredPullRequests, organization, project, controller]);

  const handleCopyToClipboard = async (pr: ProcessedPullRequest) => {
    await controller.handleCopyToClipboard(pr, organization, project);
  };

  const handleOpenPR = async (pr: ProcessedPullRequest) => {
    await controller.handleOpenPR(pr, organization, project);
  };

  return (
    <div className="pr-list-container">
      <PullRequestHeader
        organization={organization}
        project={project}
        filteredCount={filteredPullRequests.length}
        statusFilter={statusFilter}
      />

      <div className="pr-main-container">
        <NavigationButtons
          onBackToLogin={onBackToLogin}
          onRefreshPullRequests={onRefreshPullRequests}
          isLoading={isLoading}
        />

        <StatusFilter
          statusFilter={statusFilter}
          availableStatuses={availableStatuses}
          onStatusFilterChange={setStatusFilter}
          isLoading={isLoading}
        />

        <PullRequestList
          pullRequests={processedPullRequests}
          statusFilter={statusFilter}
          controller={controller}
          onCopyToClipboard={handleCopyToClipboard}
          onOpenPR={handleOpenPR}
        />

        {isLoading && <LoadingOverlay />}
      </div>
    </div>
  );
}