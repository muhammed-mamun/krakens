interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, title, message, onClose }: AlertProps) {
  const styles = {
    info: 'bg-primary/5 border-primary/20 text-foreground',
    success: 'bg-success/5 border-success/20 text-foreground',
    warning: 'bg-warning/5 border-warning/20 text-foreground',
    error: 'bg-error/5 border-error/20 text-foreground',
  };

  const icons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div className={`border rounded-lg p-4 ${styles[type]} relative`}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-current opacity-50 hover:opacity-100"
        >
          ×
        </button>
      )}
      <div className="flex items-start">
        <span className="text-2xl mr-3">{icons[type]}</span>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
