import { useState } from "react";
import { ConnectionForm, SearchType } from "../types";

interface LoginFormProps {
  onSubmit: (form: ConnectionForm) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  const [organization, setOrganization] = useState("");
  const [project, setProject] = useState("");
  const [token, setToken] = useState("");
  const [searchType, setSearchType] = useState<SearchType>('repositories');
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form: ConnectionForm = {
      organization: organization.trim(),
      token: token.trim(),
      searchType
    };

    if (searchType === 'repositories') {
      form.project = project.trim();
    }

    onSubmit(form);
  };

  const isFormValid = () => {
    const hasOrg = organization.trim().length > 0;
    const hasToken = token.trim().length > 0;
    const hasProject = searchType === 'projects' || project.trim().length > 0;
    
    return hasOrg && hasToken && hasProject;
  };

  return (
    <div className="app-header">
      <img 
        src="/banner-pr-tracker.png" 
        alt="PR Tracker" 
        className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg"
      />
      <h1 className="app-title">Azure Repos Client</h1>
      <p className="app-subtitle">
        Conecte-se ao Azure DevOps para listar seus projetos ou repositórios
      </p>

      <div className="main-container">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Type Selection */}
          <div className="form-group">
            <label className="form-label">Tipo de Pesquisa</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="projects"
                  checked={searchType === 'projects'}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                  className="mr-2 text-blue-500"
                />
                <span className="text-slate-200">Projetos</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="repositories"
                  checked={searchType === 'repositories'}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                  className="mr-2 text-blue-500"
                />
                <span className="text-slate-200">Repositórios</span>
              </label>
            </div>
          </div>

          {/* Organization */}
          <div className="form-group">
            <label htmlFor="organization" className="form-label">
              Organização *
            </label>
            <input
              id="organization"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="ex: minhaempresa"
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          {/* Project - Only show if searching repositories */}
          {searchType === 'repositories' && (
            <div className="form-group">
              <label htmlFor="project" className="form-label">
                Projeto *
              </label>
              <input
                id="project"
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="ex: meu-projeto"
                className="form-input"
                disabled={isLoading}
                required
              />
            </div>
          )}

          {/* Token */}
          <div className="form-group">
            <label htmlFor="token" className="form-label">
              Personal Access Token (PAT) *
            </label>
            <div className="token-input-container">
              <input
                id="token"
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Insira seu PAT Token"
                className="form-input token-input"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="toggle-visibility-btn"
                disabled={isLoading}
              >
                {showToken ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                {searchType === 'projects' ? 'Buscando Projetos...' : 'Buscando Repositórios...'}
              </>
            ) : (
              searchType === 'projects' ? 'Buscar Projetos' : 'Buscar Repositórios'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="info-message warning-message">
              ⚠️ {error}
            </div>
          )}

          {/* Info Message */}
          <div className="info-message">
            ℹ️ O token não será armazenado permanentemente
          </div>

          {/* Help Link */}
          <div className="text-center">
            <a
              href="https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate"
              target="_blank"
              rel="noopener noreferrer"
              className="link text-sm"
            >
              Como criar um Personal Access Token?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}