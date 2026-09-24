import { Inbox } from 'lucide-react'

function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon"><Icon aria-hidden="true" /></span>
      <h2 className="heading-md">{title}</h2>
      {description && <p className="text-muted">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  )
}

export default EmptyState