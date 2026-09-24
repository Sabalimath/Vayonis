import { useId } from 'react'

function Checkbox({ label, error, helperText, required = false, id, className = '', ...props }) {
  const generatedId = useId()
  const checkboxId = id || generatedId
  const messageId = `${checkboxId}-message`

  return (
    <div className="checkbox-field">
      <label className="checkbox-label" htmlFor={checkboxId}>
        <input
          id={checkboxId}
          className={`checkbox ${error ? 'checkbox-error' : ''} ${className}`.trim()}
          type="checkbox"
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? messageId : undefined}
          {...props}
        />
        <span>{label}</span>
        {required && <span className="required-mark" aria-hidden="true">*</span>}
      </label>
      {(error || helperText) && (
        <p className={`field-message ${error ? 'field-message-error' : ''}`} id={messageId}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}

export default Checkbox