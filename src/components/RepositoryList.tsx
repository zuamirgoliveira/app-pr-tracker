import React from "react";
import { Repository } from "../types";

interface RepositoryListProps {
  repositories: Repository[];
  organization: string;
  project: string;
  onDisconnect: () => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ 
  repositories, 
  organization, 
  project, 
  onDisconnect 
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openRepository = (url: string) => {
    // No Tauri, você pode usar a API para abrir URLs
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Repositórios - {organization}/{project}
            </h1>
            <p className="text-gray-600">
              {repositories.length} repositório{repositories.length !== 1 ? 's' : ''} encontrado{repositories.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onDisconnect}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Desconectar
          </button>
        </div>
      </div>

      {/* Repository Grid */}
      {repositories.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Nenhum repositório encontrado
          </h3>
          <p className="text-gray-600">
            Este projeto não possui repositórios ou você não tem permissão para visualizá-los.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="bg-white shadow-sm rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Repository Name */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                    {repo.name}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                    Git
                  </span>
                </div>

                {/* Repository Info */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">ID:</span>
                    <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                      {repo.id.slice(0, 8)}...
                    </span>
                  </div>
                  
                  {repo.defaultBranch && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Branch padrão:</span>
                      <span className="text-azure-600">{repo.defaultBranch}</span>
                    </div>
                  )}

                  {repo.size > 0 && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Tamanho:</span>
                      <span>{formatFileSize(repo.size)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openRepository(repo.webUrl)}
                    className="flex-1 bg-azure-600 hover:bg-azure-700 text-white text-sm px-3 py-2 rounded-md transition-colors"
                  >
                    Abrir no Browser
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(repo.remoteUrl);
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-2 rounded-md transition-colors"
                    title="Copiar URL de clone"
                  >
                    Copiar Clone URL
                  </button>
                </div>

                {/* URLs Section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <details className="group">
                    <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 select-none">
                      Ver URLs completas
                    </summary>
                    <div className="mt-2 space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-gray-600">HTTPS:</span>
                        <div className="font-mono bg-gray-50 p-2 rounded text-gray-800 break-all">
                          {repo.remoteUrl}
                        </div>
                      </div>
                      {repo.sshUrl && (
                        <div>
                          <span className="font-medium text-gray-600">SSH:</span>
                          <div className="font-mono bg-gray-50 p-2 rounded text-gray-800 break-all">
                            {repo.sshUrl}
                          </div>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepositoryList;