import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-600 p-2">
      <div className="text-center text-xs text-slate-400">
        Azure Repos Client - Feito com{" "}
        <Heart className="inline h-4 w-4 text-red-400 animate-pulse" aria-label="amor" /> usando Tauri + React + TypeScript
      </div>
    </footer>
  );
}