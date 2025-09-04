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
  isLoading
}: StatusFilterProps) {
  return (
    <div className="status-filter-container">
      <div className="status-filter-wrapper">
        <label htmlFor="status-filter" className="filter-label">
          Filtrar por status:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="status-filter-select"
          disabled={isLoading}
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
          className="filter-clear-btn"
          type="button"
          title="Limpar filtro"
        >
          ✕ Limpar filtro
        </button>
      )}
    </div>
  );
}
