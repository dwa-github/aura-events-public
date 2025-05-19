// components/Button/Button.jsx
import React from "react"
import styles from "./Button.module.css"

const Button = ({
  variant = "primary",
  href,
  onClick,
  children,
  className = "",
  type = "button",
  disabled,
  as: Component = href ? "a" : "button",
  ...rest
}) => {
  const combinedClassName = `
    ${styles.button}
    ${styles[variant] || styles.primary}
    ${className}
  `.trim()

  const componentProps = {
    className: combinedClassName,
    ...rest,
  }

  if (
    Component === "a" ||
    (typeof Component === "string" && Component.toLowerCase() === "a")
  ) {
    componentProps.href = href
  } else if (
    Component === "button" ||
    (typeof Component === "string" && Component.toLowerCase() === "button")
  ) {
    componentProps.type = type
    componentProps.onClick = onClick
    componentProps.disabled = disabled
  } else {
    componentProps.href = href
  }

  return <Component {...componentProps}>{children}</Component>
}

export default Button
