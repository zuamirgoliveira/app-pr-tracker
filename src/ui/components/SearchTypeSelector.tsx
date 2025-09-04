import { SearchType } from "../../core/entities/search-type";

interface SearchTypeSelectorProps {
  value: SearchType;
  onChange: (value: SearchType) => void;
  disabled?: boolean;
}

export function SearchTypeSelector({ value, onChange, disabled = false }: SearchTypeSelectorProps) {
  const options = [
    { value: 'projects' as SearchType, label: 'Projetos' },
    { value: 'repositories' as SearchType, label: 'Repositórios' },
    { value: 'myPullRequests' as SearchType, label: 'Meus PRs' },
  ];

  return (
    <div className="form-group">
      <label className="form-label">Tipo de Pesquisa</label>
      <div className="search-type-group">
        {options.map((option) => (
          <label key={option.value} className="radio-label">
            <input
              type="radio"
              name="searchType"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value as SearchType)}
              className="radio-input"
              disabled={disabled}
            />
            <span className="radio-text">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
