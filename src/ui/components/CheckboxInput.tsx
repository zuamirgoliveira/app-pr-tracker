interface CheckboxInputProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}

export function CheckboxInput({ checked, onChange, disabled = false, label }: CheckboxInputProps) {
  return (
    <div className="form-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="checkbox-input"
          disabled={disabled}
        />
        <span className="checkbox-text">{label}</span>
      </label>
    </div>
  );
}
