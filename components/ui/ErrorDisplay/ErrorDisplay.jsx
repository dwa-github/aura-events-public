// components/ui/ErrorDisplay/ErrorDisplay.jsx
import React from "react"
import Link from "next/link"
import styles from "./ErrorDisplay.module.css"

const ErrorDisplay = ({
  title = "Something went wrong",
  message = "We encountered an unexpected issue. Please try again or return to the homepage.",
  icon = "⚠️",
  actionButtonText,
  onActionButtonClick,
  linkButtonText = "Go to Homepage",
  linkButtonHref = "/",
}) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      <div className={styles.buttonContainer}>
        {onActionButtonClick && actionButtonText ? (
          <button onClick={onActionButtonClick} className={styles.button}>
            {actionButtonText}
          </button>
        ) : linkButtonText && linkButtonHref ? (
          <Link href={linkButtonHref} className={styles.button}>
            {linkButtonText}
          </Link>
        ) : null}
      </div>
    </div>
  )
}

export default ErrorDisplay
