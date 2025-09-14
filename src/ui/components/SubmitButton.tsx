import { SearchType } from "../../core/entities/search-type";
import { Button } from "../../ui/components/Button";

interface SubmitButtonProps {
  isValid: boolean;
  isLoading: boolean;
  searchType: SearchType;
}

export function SubmitButton({ isValid, isLoading, searchType }: SubmitButtonProps) {
  const getButtonText = () => {
    if (isLoading) {
      return searchType === "projects"
        ? "Buscando Projetos..."
        : searchType === "repositories"
        ? "Buscando Repositórios..."
        : "Buscando meus PRs...";
    }
    return searchType === "projects"
      ? "Buscar Projetos"
      : searchType === "repositories"
      ? "Buscar Repositórios"
      : "Buscar meus PRs";
  };

  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      disabled={!isValid || isLoading}
    >
      {isLoading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {getButtonText()}
    </Button>
  );
}