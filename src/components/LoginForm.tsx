import { useState, useEffect } from "react";
import { ConnectionForm } from "../types/connection-form-dto";
import { SearchType } from "../types/search-type-dto";
import { cacheUtils } from "../utils/cache";

interface LoginFormProps {
  onSubmit: (form: ConnectionForm) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  const [organization, setOrganization] = useState("");
  const [project, setProject] = useState("");
  const [token, setToken] = useState("");
  const [searchType, setSearchType] = useState<SearchType>('projects');
  const [showToken, setShowToken] = useState(false);
  const [saveCredentials, setSaveCredentials] = useState(false);

  // Load cached credentials on mount
  useEffect(() => {
    const cached = cacheUtils.load();
    if (cached) {
      setOrganization(cached.organization);
      setProject(cached.project || "");
      setToken(cached.token);
      setSearchType(cached.searchType);
      setSaveCredentials(true);
    }
  }, []);

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

    // Handle cache based on checkbox
    if (saveCredentials) {
      const credentialsToCache = {
        organization: organization.trim(),
        project: searchType === 'repositories' ? project.trim() : undefined,
        token: token.trim(),
        searchType
      };
      cacheUtils.save(credentialsToCache);
    } else {
      cacheUtils.clear();
    }

    onSubmit(form);
  };

  const handleSaveCredentialsChange = (checked: boolean) => {
    setSaveCredentials(checked);
    if (!checked) {
      cacheUtils.clear();
    }
  };

  const isFormValid = () => {
    const hasOrg = organization.trim().length > 0;
    const hasToken = token.trim().length > 0;
    const hasProject = searchType === 'projects' || project.trim().length > 0;
    
    return hasOrg && hasToken && hasProject;
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="banner-container">
          <img 
            src="/banner-pr-tracker.png" 
            alt="PR Tracker Banner" 
            className="page-banner"
          />
        </div>
        <h1 className="login-title">Azure Repos Client</h1>
        <p className="login-subtitle">
          Conecte-se ao Azure DevOps para listar seus projetos ou repositórios
        </p>
      </div>

      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          {/* Search Type Selection */}
          <div className="form-group">
            <label className="form-label">Tipo de Pesquisa</label>
            <div className="search-type-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="searchType"
                  value="projects"
                  checked={searchType === 'projects'}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                  className="radio-input"
                />
                <span className="radio-text">Buscar Projetos</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="searchType"
                  value="repositories"
                  checked={searchType === 'repositories'}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                  className="radio-input"
                />
                <span className="radio-text">Buscar Repositórios</span>
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
                {showToken ? (
                  <svg className="visibility-icon" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="visibility-icon" viewBox="0 0 24 24">
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Save Credentials Checkbox */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={saveCredentials}
                onChange={(e) => handleSaveCredentialsChange(e.target.checked)}
                className="checkbox-input"
                disabled={isLoading}
              />
              <span className="checkbox-text">Salvar informações localmente</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="btn btn-primary"
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
            <div className="alert-message alert-error">
              <svg className="alert-icon" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Info Message */}
          <div className="alert-message alert-info">
            <svg className="alert-icon" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {saveCredentials 
                ? "As informações serão salvas localmente no seu navegador" 
                : "O token não será armazenado permanentemente"
              }
            </span>
          </div>

          {/* Help Link */}
          <div className="help-link">
            <a
              href="https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Como criar um Personal Access Token?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}