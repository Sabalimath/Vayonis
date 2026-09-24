import { useId } from 'react'

function Select({ label, options = [], placeholder, error, helperText, required = false, id, className = '', ...props }) {
  const generatedId = useId()
  const selectId = id || generatedId
  const messageId = `${selectId}-message`

  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={selectId}>
          {label}
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`input select ${error ? 'input-error' : ''} ${className}`.trim()}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? messageId : undefined}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p className={`field-message ${error ? 'field-message-error' : ''}`} id={messageId}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}

export default Select