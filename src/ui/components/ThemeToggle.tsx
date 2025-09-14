import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border bg-white dark:bg-slate-800 
                 border-slate-300 dark:border-slate-600 
                 shadow-sm hover:shadow transition flex items-center gap-2"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-5 w-5 text-slate-700" />
          <span className="text-sm">Dark</span>
        </>
      ) : (
        <>
          <Sun className="h-5 w-5 text-yellow-400" />
          <span className="text-sm">Light</span>
        </>
      )}
    </button>
  );
}