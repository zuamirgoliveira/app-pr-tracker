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
  type = "text",
}: FormInputProps) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 
                   transition duration-300 outline-none
                   focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600/10
                   disabled:cursor-not-allowed disabled:opacity-60
                   dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-500"
      />
    </div>
  );
}
