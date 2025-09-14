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
import { ThemeToggle } from "../../components/ThemeToggle"; // ⬅️ novo botão

interface LoginProps {
  onSubmit: (form: ConnectionForm) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function Login({ onSubmit, isLoading = false, error }: LoginProps) {
  const [organization, setOrganization] = useState("");
  const [project, setProject] = useState("");
  const [token, setToken] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("projects");
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
      searchType,
    };

    if (searchType === "repositories" || searchType === "myPullRequests") {
      form.project = project.trim();
    }

    if (saveCredentials) {
      const credentialsToCache = {
        organization: organization.trim(),
        project:
          searchType === "repositories" || searchType === "myPullRequests"
            ? project.trim()
            : undefined,
        token: token.trim(),
        searchType,
      };
      cacheUtils.save(credentialsToCache);
    } else {
      cacheUtils.clear();
    }

    onSubmit(form);
  };

  const handleSaveCredentialsChange = (checked: boolean) => {
    setSaveCredentials(checked);
    if (!checked) cacheUtils.clear();
  };

  const isFormValid = () => {
    const hasOrg = organization.trim().length > 0;
    const hasToken = token.trim().length > 0;
    const hasProject = searchType === "projects" || project.trim().length > 0;
    return hasOrg && hasToken && hasProject;
  };

  const shouldShowProjectField =
    searchType === "repositories" || searchType === "myPullRequests";

  return (
    <div className="min-h-screen w-full px-4 py-8 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center mb-8 flex flex-col items-center gap-4">
        <Banner src="/banner-pr-tracker.png" alt="PR Tracker Banner" />
        <h1 className="font-michroma text-heading-1 text-slate-900 dark:text-slate-50">
          Azure Repos Client
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          Conecte-se ao Azure DevOps para listar seus projetos ou repositórios
        </p>
        {/* Botão de tema */}
        <ThemeToggle />
      </div>

      {/* Card/Form container */}
      <div className="w-full max-w-md rounded-2xl border p-6 md:p-8 shadow-2xl bg-white/80 backdrop-blur-xl border-slate-200 dark:bg-slate-800/10 dark:border-slate-600">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

          <TokenInput value={token} onChange={setToken} disabled={isLoading} />

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

          {error && <AlertMessage type="error" message={error} />}

          <AlertMessage
            type="info"
            message={
              saveCredentials
                ? "Os dados serão salvos localmente no app."
                : "O token não será armazenado."
            }
          />

          <div className="text-center">
            <HelpLink
              href="https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate"
              text="Como criar um Personal Access Token?"
            />
          </div>
        </form>
      </div>
    </div>
  );
}