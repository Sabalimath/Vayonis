import { useId } from 'react'

function Input({ label, error, helperText, required = false, id, className = '', ...props }) {
  const generatedId = useId()
  const inputId = id || generatedId
  const messageId = `${inputId}-message`

  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input ${error ? 'input-error' : ''} ${className}`.trim()}
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

export default Input