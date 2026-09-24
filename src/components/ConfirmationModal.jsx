import Button from './Button.jsx'
import Modal from './Modal.jsx'

function ConfirmationModal({ isOpen, onClose, onConfirm, title, description, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', loading = false, tone = 'primary' }) {
  return (
    <Modal isOpen={isOpen} onClose={loading ? undefined : onClose} title={title} size="sm">
      <div className="confirmation-modal-content">
        <p>{description}</p>
        <div className="confirmation-modal-actions">
          <Button variant="secondary" disabled={loading} onClick={onClose}>{cancelLabel}</Button>
          <Button variant={tone} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
