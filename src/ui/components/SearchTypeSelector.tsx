import { SearchType } from "../../core/entities/search-type";

interface SearchTypeSelectorProps {
  value: SearchType;
  onChange: (value: SearchType) => void;
  disabled?: boolean;
}

export function SearchTypeSelector({
  value,
  onChange,
  disabled = false,
}: SearchTypeSelectorProps) {
  const options = [
    { value: "projects" as SearchType, label: "Projetos" },
    { value: "repositories" as SearchType, label: "Repositórios" },
    { value: "myPullRequests" as SearchType, label: "Meus PRs" },
  ];

  return (
    <div className="mb-4 flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Tipo de Pesquisa
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <input
              type="radio"
              name="searchType"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value as SearchType)}
              disabled={disabled}
              className="h-4 w-4 cursor-pointer accent-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <span className="select-none">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}