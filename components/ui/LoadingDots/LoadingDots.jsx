// components/ui/LoadingDots/LoadingDots.jsx
import React from "react"
import styles from "./LoadingDots.module.css"

const LoadingDots = ({ className = "" }) => {
  return (
    <div
      className={`${styles.loadingDotsContainer} ${className}`}
      aria-label="Loading content"
    >
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  )
}

export default LoadingDots
