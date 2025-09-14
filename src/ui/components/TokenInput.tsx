import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TokenInput({ value, onChange, disabled = false }: TokenInputProps) {
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="mb-4 flex flex-col gap-2">
      <label
        htmlFor="token"
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        Personal Access Token (PAT) *
      </label>

      <div className="relative flex w-full items-center">
        <input
          id="token"
          type={showToken ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Insira seu PAT Token"
          disabled={disabled}
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pr-10 text-sm text-slate-800 placeholder:text-slate-400 transition duration-300 outline-none
                     focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                     disabled:cursor-not-allowed disabled:opacity-60
                     dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-500"
        />

        <button
          type="button"
          onClick={() => setShowToken(!showToken)}
          disabled={disabled}
          className="absolute right-2 flex h-6 w-6 items-center justify-center text-slate-500 transition hover:text-slate-700 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:text-slate-200"
        >
          {showToken ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}