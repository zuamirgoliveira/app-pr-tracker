import { SearchType } from "../../core/entities/search-type";

interface SubmitButtonProps {
  isValid: boolean;
  isLoading: boolean;
  searchType: SearchType;
}

export function SubmitButton({ isValid, isLoading, searchType }: SubmitButtonProps) {
  const getButtonText = () => {
    if (isLoading) {
      return searchType === 'projects' ? 'Buscando Projetos...' : 
             searchType === 'repositories' ? 'Buscando Repositórios...' : 
             'Buscando meus PRs...';
    }
    return searchType === 'projects' ? 'Buscar Projetos' : 
           searchType === 'repositories' ? 'Buscar Repositórios' :
           'Buscar meus PRs';
  };

  return (
    <button
      type="submit"
      disabled={!isValid || isLoading}
      className="btn btn-primary"
    >
      {isLoading && <div className="spinner" />}
      {getButtonText()}
    </button>
  );
}
