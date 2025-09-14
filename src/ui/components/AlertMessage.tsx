import clsx from "clsx";

interface AlertMessageProps {
  type: "error" | "info";
  message: string;
}

export function AlertMessage({ type, message }: AlertMessageProps) {
  const getIcon = () => {
    if (type === "error") {
      return (
        <svg
          className="h-5 w-5 flex-shrink-0 text-error"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    }
    return (
      <svg
        className="h-5 w-5 flex-shrink-0 text-blue-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-lg p-4 text-sm",
        type === "error" &&
          "bg-error/10 border border-error/30 text-error",
        type === "info" &&
          "bg-blue-500/10 border border-blue-500/30 text-slate-600 dark:text-slate-400"
      )}
    >
      {getIcon()}
      <span>{message}</span>
    </div>
  );
}