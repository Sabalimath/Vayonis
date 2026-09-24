function Card({ children, as: Element = 'div', className = '', ...props }) {
  return (
    <Element className={`card ${className}`.trim()} {...props}>
      {children}
    </Element>
  )
}

export default Card