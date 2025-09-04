import { useState, useMemo } from "react";
import { Project } from "../../../core/entities/project";

interface ProjectListProps {
  projects: Project[];
  organization: string;
  isLoading?: boolean;
  onProjectSelect: (project: Project) => void;
  onBackToLogin: () => void;
}

export default function ProjectList({
  projects,
  organization,
  isLoading = false,
  onProjectSelect,
  onBackToLogin
}: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) {
      return projects;
    }
    return projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div className="banner-container">
          <img 
            src="/banner-pr-tracker.png" 
            alt="PR Tracker Banner" 
            className="page-banner"
          />
        </div>
        <h1 className="projects-title">Projetos - {organization}</h1>
        <p className="projects-subtitle">
          Encontrados {projects.length} projeto(s). Selecione um projeto para ver seus repositórios.
        </p>
      </div>

      <div className="projects-main-container">
        {/* Header Actions */}
        <div className="nav-buttons">
          <button
            onClick={onBackToLogin}
            className="nav-btn"
            disabled={isLoading}
          >
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao Login
          </button>
        </div>

        {/* Search Section */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              disabled={isLoading}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="search-clear"
                type="button"
                title="Limpar busca"
              >
                ×
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="search-results">
              {filteredProjects.length} projeto(s) encontrado(s) para "{searchTerm}"
            </p>
          )}
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <div className="empty-message">
            <svg className="alert-icon" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {searchTerm 
                ? `Nenhum projeto encontrado para "${searchTerm}".`
                : "Nenhum projeto encontrado nesta organização."
              }
            </span>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => !isLoading && onProjectSelect(project)}
              >
                <div className="project-card-content">
                  <div className="project-info">
                    <h3 className="project-name">{project.name}</h3>
                    {project.description && (
                      <p className="project-description">{project.description}</p>
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
                      className="btn btn-primary btn-sm"
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
}