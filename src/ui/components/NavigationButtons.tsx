import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "../../ui/components/Button";

export function NavigationButtons({
  onBackToLogin,
  onRefreshPullRequests,
  isLoading,
}: {
  onBackToLogin: () => void;
  onRefreshPullRequests: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onBackToLogin}
        disabled={isLoading}
        variant="secondary"
        size="md"
      >
        <ArrowLeft className="h-4 w-4" />
        Login
      </Button>

      <Button
        onClick={onRefreshPullRequests}
        disabled={isLoading}
        title="Atualizar lista de PRs"
        variant="secondary"
        size="md"
      >
        <RefreshCw className="h-4 w-4" />
        Atualizar
      </Button>
    </div>
  );
}