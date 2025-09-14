import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-slate-900/80 backdrop-blur-sm">
      <Loader2 className="h-6 w-6 animate-spin text-slate-200" />
      <span className="text-sm text-slate-200">
        Carregando pull requests...
      </span>
    </div>
  );
}
