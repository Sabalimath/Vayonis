import Spinner from './Spinner.jsx'

function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  icon,
  className = '',
  ...props
}) {
  return (
    <button
      className={`button button-${variant} ${className}`.trim()}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? <Spinner size="sm" label="Action en cours" /> : icon}
      {children}
    </button>
  )
}

export default Button