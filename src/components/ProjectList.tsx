import React from "react";
import { Project } from "../types";

interface ProjectListProps {
  projects: Project[];
  organization: string;
  isLoading?: boolean;
  onProjectSelect: (project: Project) => void;
  onBackToLogin: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  organization,
  isLoading = false,
  onProjectSelect,
  onBackToLogin
}) => {

  const openRepository = (url: string) => {
    // No Tauri, você pode usar a API para abrir URLs
    window.open(url, '_blank');
  };

  return (
    <div className="app-header max-w-6xl mx-auto">
      <h1 className="app-title text-2xl font-bold text-gray-800 mb-2">
        Projetos - {organization}
      </h1>
      <p className="app-subtitle text-gray-600">
        Encontrados {projects.length} projeto{projects.length !== 1 ? 's' : ''}. Selecione um projeto para ver seus repositórios.
      </p>

      <div className="main-container">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBackToLogin}
            className="btn btn-secondary bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isLoading}
          >
            ← Voltar ao Login
          </button>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="info-message bg-white shadow-sm rounded-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-gray-600">
              Este projeto não possui projetos ou você não tem permissão para visualizá-los.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card bg-white shadow-sm rounded-lg border hover:shadow-md transition-shadow p-6"
                onClick={() => !isLoading && onProjectSelect(project)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="project-name font-semibold text-gray-800 text-lg leading-tight">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="project-description text-azure-600">{project.description}</p>
                    )}
                    <div className="project-meta">
                      <span className={`status-badge status-${project.state?.toLowerCase()}`}>
                        {project.state || 'Unknown'}
                      </span>
                      {project.visibility && (
                        <span className="visibility-badge">
                          {project.visibility === 'private' ? '🔒' : '🌐'} {project.visibility}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="project-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProjectSelect(project);
                      }}
                      disabled={isLoading}
                      className="btn btn-sm btn-primary flex-1 bg-azure-600 hover:bg-azure-700 text-white text-sm px-3 py-2 rounded-md transition-colors"
                    >
                      Ver Repositórios →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <span>Carregando repositórios...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;