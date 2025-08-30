import React from "react";
import { Project } from "../types";

interface ProjectListProps {
  projects: Project[];
  organization: string;
  onDisconnect: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  organization,
  onDisconnect 
}) => {

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
              Projetos - {organization}
            </h1>
            <p className="text-gray-600">
              {projects.length} projeto{projects.length !== 1 ? 's' : ''} encontrado{projects.length !== 1 ? 's' : ''}
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

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-gray-600">
            Este projeto não possui projetos ou você não tem permissão para visualizá-los.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white shadow-sm rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Project Name */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                    {project.name}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                    Git
                  </span>
                </div>

                {/* Project Info */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">ID:</span>
                    <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                      {project.id.slice(0, 8)}...
                    </span>
                  </div>
                  
                  {project.description && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Descrição:</span>
                      <span className="text-azure-600">{project.description}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openRepository(project.url ?? "")}
                    className="flex-1 bg-azure-600 hover:bg-azure-700 text-white text-sm px-3 py-2 rounded-md transition-colors"
                  >
                    Abrir no Browser
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;