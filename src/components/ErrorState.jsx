import { AlertCircle } from 'lucide-react'
import Button from './Button.jsx'

function ErrorState({ title = 'Une erreur est survenue', description = 'Nous n’avons pas pu charger ces informations.', actionLabel = 'Réessayer', onRetry }) {
  return (
    <div className="error-state" role="alert">
      <span className="error-state-icon"><AlertCircle aria-hidden="true" /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>{actionLabel}</Button>}
    </div>
  )
}

export default ErrorState
