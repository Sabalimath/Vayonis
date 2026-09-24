import { LoaderCircle } from 'lucide-react'

function Spinner({ size = 'md', label = 'Chargement en cours' }) {
  return (
    <span className={`spinner spinner-${size}`} role="status" aria-label={label}>
      <LoaderCircle aria-hidden="true" />
    </span>
  )
}

export function Loading({ label = 'Chargement en cours' }) {
  return (
    <div className="loading" role="status">
      <Spinner label={label} />
      <span>{label}</span>
    </div>
  )
}

export default Spinner