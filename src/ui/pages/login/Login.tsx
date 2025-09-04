import { useState, useEffect } from "react";
import { ConnectionForm } from "../../../core/entities/connection-form";
import { SearchType } from "../../../core/entities/search-type";
import { cacheUtils } from "../../../utils/cache";
import { Banner } from "../../components/Banner";
import { SearchTypeSelector } from "../../components/SearchTypeSelector";
import { FormInput } from "../../components/FormInput";
import { TokenInput } from "../../components/TokenInput";
import { CheckboxInput } from "../../components/CheckboxInput";
import { SubmitButton } from "../../components/SubmitButton";
import { AlertMessage } from "../../components/AlertMessage";
import { HelpLink } from "../../components/HelpLink";

interface LoginProps {
  onSubmit: (form: ConnectionForm) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function Login({ onSubmit, isLoading = false, error }: LoginProps) {
  const [organization, setOrganization] = useState("");
  const [project, setProject] = useState("");
  const [token, setToken] = useState("");
  const [searchType, setSearchType] = useState<SearchType>('projects');
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

    if (searchType === 'repositories' || searchType === 'myPullRequests') {
      form.project = project.trim();
    }

    if (saveCredentials) {
      const credentialsToCache = {
        organization: organization.trim(),
        project: searchType === 'repositories' || searchType === 'myPullRequests' ? project.trim() : undefined,
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

  const shouldShowProjectField = searchType === 'repositories' || searchType === 'myPullRequests';

  return (
    <div className="login-container">
      <div className="login-header">
        <Banner 
          src="/banner-pr-tracker.png" 
          alt="PR Tracker Banner" 
        />
        <h1 className="login-title">Azure Repos Client</h1>
        <p className="login-subtitle">
          Conecte-se ao Azure DevOps para listar seus projetos ou repositórios
        </p>
      </div>

      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <SearchTypeSelector
            value={searchType}
            onChange={setSearchType}
            disabled={isLoading}
          />

          <FormInput
            id="organization"
            label="Organização *"
            value={organization}
            onChange={setOrganization}
            placeholder="ex: minhaempresa"
            disabled={isLoading}
            required
          />

          {shouldShowProjectField && (
            <FormInput
              id="project"
              label="Projeto *"
              value={project}
              onChange={setProject}
              placeholder="ex: meu-projeto"
              disabled={isLoading}
              required
            />
          )}

          <TokenInput
            value={token}
            onChange={setToken}
            disabled={isLoading}
          />

          <CheckboxInput
            checked={saveCredentials}
            onChange={handleSaveCredentialsChange}
            disabled={isLoading}
            label="Salvar informações localmente"
          />

          <SubmitButton
            isValid={isFormValid()}
            isLoading={isLoading}
            searchType={searchType}
          />

          {error && (
            <AlertMessage type="error" message={error} />
          )}

          <AlertMessage 
            type="info" 
            message={
              saveCredentials 
                ? "As informações serão salvas localmente no seu aplicativo" 
                : "O token não será armazenado permanentemente"
            }
          />

          <HelpLink
            href="https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate"
            text="Como criar um Personal Access Token?"
          />
        </form>
      </div>
    </div>
  );
}