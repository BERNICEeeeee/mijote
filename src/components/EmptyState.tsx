interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="empty-container" role="status">
      <span className="empty-mark" aria-hidden="true">—</span>
      <p>{message}</p>
    </div>
  );
}