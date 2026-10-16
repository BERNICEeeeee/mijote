interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-container" role="alert">
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-retry">
          Réessayer
        </button>
      )}
    </div>
  );
}