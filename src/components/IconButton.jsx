function IconButton({ icon, label, variant = 'ghost', size = 'md', className = '', ...props }) {
  return (
    <button
      className={`icon-button icon-button-${variant} icon-button-${size} ${className}`.trim()}
      type="button"
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  )
}

export default IconButton