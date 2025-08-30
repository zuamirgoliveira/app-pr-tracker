import React from "react";
import { Project } from "../types";

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

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="empty-message">
            <svg className="alert-icon" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Nenhum projeto encontrado nesta organização.</span>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map((project) => (
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