import React from "react";
import { Repository } from "../types";

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
  onBackToProjects
}: RepositoryListProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 text-shadow">
          Repositórios - {project}
        </h1>
        <p className="text-lg text-slate-300">
          {organization} • {repositories.length} repositório(s) encontrado(s)
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-lg border border-slate-600 rounded-2xl p-8 shadow-2xl">
        {/* Header Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={onBackToLogin}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Login
          </button>
          {onBackToProjects && (
            <button
              onClick={onBackToProjects}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Projetos
            </button>
          )}
        </div>

        {/* Repositories List */}
        {repositories.length === 0 ? (
          <div className="flex items-center gap-3 p-6 bg-blue-900/30 border border-blue-700/50 rounded-lg text-blue-200">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Nenhum repositório encontrado neste projeto.</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 hover:bg-slate-700/50 transition-all duration-200 hover:border-blue-500/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Repository Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7v8.3c0 1.2-.8 2.3-2 2.7L12 18l-5-2c-1.2-.4-2-1.5-2-2.7V4h14zM7 4v6l5 2 5-2V4H7z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-white">
                        {repo.name}
                      </h3>
                    </div>

                    {/* Repository Info */}
                    <div className="space-y-2 text-sm">
                      {repo.defaultBranch && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Branch padrão: <code className="bg-slate-800 px-2 py-1 rounded text-blue-300">{repo.defaultBranch.replace('refs/heads/', '')}</code></span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-slate-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>ID: <code className="bg-slate-800 px-2 py-1 rounded text-blue-300">{repo.id}</code></span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <a 
                          href={repo.webUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Ver no Azure DevOps
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex flex-col gap-2">
                    <button
                      onClick={() => onPullRequestsSelect(repo)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Listar Pull Requests
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-slate-200 font-medium">Carregando pull requests...</span>
          </div>
        )}
      </div>
    </div>
  );
}