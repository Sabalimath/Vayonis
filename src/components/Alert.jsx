import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
}

function Alert({ children, title, tone = 'info', className = '' }) {
  const Icon = icons[tone] || icons.info

  return (
    <div className={`alert alert-${tone} ${className}`.trim()} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon aria-hidden="true" />
      <div>
        {title && <p className="alert-title">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Alert