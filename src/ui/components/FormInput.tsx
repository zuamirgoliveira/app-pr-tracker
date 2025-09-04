interface FormInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
}

export function FormInput({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  disabled = false, 
  required = false,
  type = "text"
}: FormInputProps) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
        disabled={disabled}
        required={required}
      />
    </div>
  );
}
