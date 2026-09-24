import { useId } from 'react'

function Textarea({ label, error, helperText, required = false, id, className = '', ...props }) {
  const generatedId = useId()
  const textareaId = id || generatedId
  const messageId = `${textareaId}-message`

  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={textareaId}>
          {label}
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`input textarea ${error ? 'input-error' : ''} ${className}`.trim()}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? messageId : undefined}
        {...props}
      />
      {(error || helperText) && (
        <p className={`field-message ${error ? 'field-message-error' : ''}`} id={messageId}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}

export default Textarea