import { useState, useMemo } from "react";
import { Repository } from "../../../core/entities/repository";
import {
  ArrowLeft,
  GitBranch,
  Hash,
  ExternalLink,
  FolderGit2,
} from "lucide-react";

interface RepositoryListProps {
  repositories: Repository[];
  organization: string;
  project: string;
  isLoading?: boolean;
  onPullRequestsSelect: (repository: Repository) => void;
  onBackToLogin: () => void;
  onBackToProjects?: () => void;
}

export default function RepositoryList({
  repositories,
  organization,
  project,
  isLoading = false,
  onPullRequestsSelect,
  onBackToLogin,
  onBackToProjects,
}: RepositoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepositories = useMemo(() => {
    if (!searchTerm.trim()) return repositories;
    return repositories.filter((repository) =>
      repository.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [repositories, searchTerm]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img
            src="/banner-pr-tracker.png"
            alt="PR Tracker Banner"
            className="h-auto max-w-sm rounded-2xl shadow-lg"
          />
        </div>
        <h1 className="text-2xl font-michroma text-slate-800 dark:text-slate-100">
          Repositórios – {project}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {organization} • {repositories.length} repositório(s) encontrado(s)
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={onBackToLogin}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                       bg-slate-200 border border-slate-300 text-slate-800
                       hover:bg-slate-100 hover:border-blue-600 hover:-translate-y-0.5 transition
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
                       dark:bg-slate-700 dark:text-slate-50 dark:border-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Login
          </button>

          {onBackToProjects && (
            <button
              onClick={onBackToProjects}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                         bg-slate-200 border border-slate-300 text-slate-800
                         hover:bg-slate-100 hover:border-blue-600 hover:-translate-y-0.5 transition
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
                         dark:bg-slate-700 dark:text-slate-50 dark:border-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Projetos
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500"
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar repositório..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-lg border-2 border-slate-200 bg-white py-2 pl-10 pr-3 text-sm
                       text-slate-800 placeholder:text-slate-400
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
                       dark:bg-slate-900/50 dark:text-slate-50 dark:border-slate-600"
          />
          {searchTerm && (
            <button
              type="button"
              title="Limpar busca"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Search Result Info */}
      {searchTerm && (
        <p className="text-sm text-slate-500 mb-4">
          {filteredRepositories.length} repositório(s) encontrado(s) para "
          {searchTerm}"
        </p>
      )}

      {/* Repositories */}
      {filteredRepositories.length === 0 ? (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-200">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {searchTerm
              ? `Nenhum repositório encontrado para "${searchTerm}".`
              : "Nenhum repositório encontrado neste projeto."}
          </span>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRepositories.map((repo) => (
            <div
              key={repo.id}
              className="p-6 rounded-xl border bg-white shadow hover:shadow-lg transition
                         dark:bg-slate-800 dark:border-slate-600"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <FolderGit2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {repo.name}
                </h3>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                {repo.defaultBranch && (
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-green-500" />
                    <span>
                      Branch padrão:{" "}
                      <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-xs">
                        {repo.defaultBranch.replace("refs/heads/", "")}
                      </code>
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-purple-500" />
                  <span>
                    ID:{" "}
                    <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-xs">
                      {repo.id}
                    </code>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                  <a
                    href={repo.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Ver no Azure DevOps
                  </a>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => onPullRequestsSelect(repo)}
                disabled={isLoading}
                className="btn btn-primary btn-sm w-full"
              >
                Listar Pull Requests →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Carregando pull requests...</span>
        </div>
      )}
    </div>
  );
}
