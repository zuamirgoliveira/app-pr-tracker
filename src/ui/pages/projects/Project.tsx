import { useState, useMemo } from "react";
import { Project } from "../../../core/entities/project";
import { ArrowLeft, Search, AlertCircle, Lock, Globe } from "lucide-react";

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
  onBackToLogin,
}: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

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
          Projetos – {organization}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Encontrados {projects.length} projeto(s). Selecione um projeto para ver
          seus repositórios.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
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
          Voltar ao Login
        </button>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar projeto..."
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
          {filteredProjects.length} projeto(s) encontrado(s) para "{searchTerm}"
        </p>
      )}

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-200">
          <AlertCircle className="h-5 w-5" />
          <span>
            {searchTerm
              ? `Nenhum projeto encontrado para "${searchTerm}".`
              : "Nenhum projeto encontrado nesta organização."}
          </span>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => !isLoading && onProjectSelect(project)}
              className="p-6 rounded-xl border bg-white shadow hover:shadow-lg transition cursor-pointer
                         dark:bg-slate-800 dark:border-slate-600"
            >
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {project.name}
              </h3>

              <div className="flex items-center gap-3 mb-4">
                
                {project.visibility && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border bg-slate-50 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {project.visibility === "private" ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Globe className="h-3 w-3" />
                    )}
                    {project.visibility}
                  </span>
                )}
              </div>
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
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Carregando repositórios...</span>
        </div>
      )}
    </div>
  );
}
