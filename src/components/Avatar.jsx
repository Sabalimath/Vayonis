function Avatar({ src, alt = '', name, size = 'md', className = '' }) {
  const initials = name
    ? name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : '?'

  return (
    <span className={`avatar avatar-${size} ${className}`.trim()}>
      {src ? <img src={src} alt={alt || name || ''} /> : initials}
    </span>
  )
}

export default Avatar