interface AlertMessageProps {
  type: 'error' | 'info';
  message: string;
}

export function AlertMessage({ type, message }: AlertMessageProps) {
  const getIcon = () => {
    if (type === 'error') {
      return (
        <svg className="alert-icon" viewBox="0 0 24 24">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    }
    return (
      <svg className="alert-icon" viewBox="0 0 24 24">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className={`alert-message alert-${type}`}>
      {getIcon()}
      <span>{message}</span>
    </div>
  );
}
