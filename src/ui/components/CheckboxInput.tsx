interface CheckboxInputProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}

export function CheckboxInput({
  checked,
  onChange,
  disabled = false,
  label,
}: CheckboxInputProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 my-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 cursor-pointer accent-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <span className="font-normal hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed">
        {label}
      </span>
    </label>
  );
}