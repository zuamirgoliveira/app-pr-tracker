import { Info } from "lucide-react";

interface EmptyMessageProps {
  statusFilter: string;
}

export function EmptyMessage({ statusFilter }: EmptyMessageProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">
      <Info className="h-5 w-5 flex-shrink-0" />
      <span>
        {statusFilter === "ALL"
          ? "Nenhum pull request encontrado neste repositório."
          : `Nenhum pull request com status "${statusFilter}" encontrado.`}
      </span>
    </div>
  );
}
