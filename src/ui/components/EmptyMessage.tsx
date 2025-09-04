interface EmptyMessageProps {
  statusFilter: string;
}

export function EmptyMessage({ statusFilter }: EmptyMessageProps) {
  return (
    <div className="pr-empty-message">
      <span className="info-icon">ℹ️</span>
      <span>
        {statusFilter === "ALL" 
          ? "Nenhum pull request encontrado neste repositório."
          : `Nenhum pull request com status "${statusFilter}" encontrado.`
        }
      </span>
    </div>
  );
}
