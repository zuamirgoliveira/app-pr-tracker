import { X } from "lucide-react";

interface StatusFilterProps {
  statusFilter: string;
  availableStatuses: string[];
  onStatusFilterChange: (status: string) => void;
  isLoading: boolean;
}

export function StatusFilter({
  statusFilter,
  availableStatuses,
  onStatusFilterChange,
  isLoading,
}: StatusFilterProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/30 md:flex-row md:items-center">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <label
          htmlFor="status-filter"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Filtrar por status:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          disabled={isLoading}
          className="min-w-[180px] rounded-md border-2 border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
        >
          {availableStatuses.map((status) => (
            <option key={status} value={status}>
              {status === "ALL" ? "Todos os Status" : status}
            </option>
          ))}
        </select>
      </div>

      {statusFilter !== "ALL" && (
        <button
          onClick={() => onStatusFilterChange("ALL")}
          type="button"
          title="Limpar filtro"
          disabled={isLoading}
          className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-500 transition duration-200 hover:border-gray-400 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <X className="h-4 w-4" />
          Limpar filtro
        </button>
      )}
    </div>
  );
}