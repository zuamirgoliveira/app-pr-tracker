interface NavigationButtonsProps {
  onBackToLogin: () => void;
  onRefreshPullRequests: () => void;
  isLoading: boolean;
}

export function NavigationButtons({
  onBackToLogin,
  onRefreshPullRequests,
  isLoading
}: NavigationButtonsProps) {
  return (
    <div className="pr-nav-buttons">
      <button
        onClick={onBackToLogin}
        className="nav-btn"
        disabled={isLoading}
      >
        ← Login
      </button>
      <button
        onClick={onRefreshPullRequests}
        className="nav-btn"
        disabled={isLoading}
        title="Atualizar lista de PRs"
      >
        🔄 Atualizar
      </button>
    </div>
  );
}
