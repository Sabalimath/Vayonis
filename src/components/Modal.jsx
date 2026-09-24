import { X } from 'lucide-react'

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`modal modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="heading-md">{title}</h2>
          <button className="icon-button" type="button" aria-label="Fermer" onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </section>
    </div>
  )
}

export default Modal