function Skeleton({ variant = 'text', className = '', ...props }) {
  return <span className={`skeleton skeleton-${variant} ${className}`.trim()} aria-hidden="true" {...props} />
}

export default Skeleton
