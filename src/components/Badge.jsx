function Badge({ children, tone = 'default', className = '', ...props }) {
  return (
    <span className={`badge badge-${tone} ${className}`.trim()} {...props}>
      {children}
    </span>
  )
}

export default Badge