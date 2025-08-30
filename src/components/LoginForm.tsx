import React, { useState } from "react";
import { ConnectionForm } from "../types";

interface LoginFormProps {
  onSubmit: (form: ConnectionForm) => void;
  isLoading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error }) => {
  const [form, setForm] = useState<ConnectionForm>({
    organization: "",
    project: "",
    token: "",
  });

  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.organization && form.project && form.token) {
      onSubmit(form);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = form.organization && form.project && form.token;

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Azure Repos Client
        </h1>
        <p className="text-gray-600">
          Conecte-se ao Azure DevOps para listar seus repositórios
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
            Organização *
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={form.organization}
            onChange={handleInputChange}
            placeholder="ex: minhaempresa"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azure-500 focus:border-transparent"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
            Projeto *
          </label>
          <input
            type="text"
            id="project"
            name="project"
            value={form.project}
            onChange={handleInputChange}
            placeholder="ex: meu-projeto"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azure-500 focus:border-transparent"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
            Personal Access Token (PAT) *
          </label>
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              id="token"
              name="token"
              value={form.token}
              onChange={handleInputChange}
              placeholder="Insira seu PAT Token"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azure-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-400 hover:text-gray-600"
            >
              {showToken ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            O token não será armazenado permanentemente
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-azure-600 text-white py-2 px-4 rounded-md hover:bg-azure-700 focus:outline-none focus:ring-2 focus:ring-azure-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Conectando...
            </span>
          ) : (
            "Buscar Repositórios"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a
          href="https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate"
          target="_blank"
          rel="noopener noreferrer"
          className="text-azure-600 hover:text-azure-700 text-sm underline"
        >
          Como criar um Personal Access Token?
        </a>
      </div>
    </div>
  );
};

export default LoginForm;