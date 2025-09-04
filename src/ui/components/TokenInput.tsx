import { useState } from "react";

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TokenInput({ value, onChange, disabled = false }: TokenInputProps) {
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor="token" className="form-label">
        Personal Access Token (PAT) *
      </label>
      <div className="token-input-container">
        <input
          id="token"
          type={showToken ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Insira seu PAT Token"
          className="form-input token-input"
          disabled={disabled}
          required
        />
        <button
          type="button"
          onClick={() => setShowToken(!showToken)}
          className="toggle-visibility-btn"
          disabled={disabled}
        >
          {showToken ? (
            <svg className="visibility-icon" viewBox="0 0 24 24">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="visibility-icon" viewBox="0 0 24 24">
              <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
