import { AlertCircle, CheckCircle2, TriangleAlert, X } from 'lucide-react'

function Toast({ message, onClose, tone = 'success' }) {
  const Icon = tone === 'error' ? AlertCircle : tone === 'warning' ? TriangleAlert : CheckCircle2

  return (
    <div className={`toast toast-${tone}`} role="status">
      <Icon aria-hidden="true" />
      <span>{message}</span>
      {onClose && (
        <button className="toast-close" type="button" aria-label="Fermer" onClick={onClose}>
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export default Toast