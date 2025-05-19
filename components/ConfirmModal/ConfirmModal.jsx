// components/ConfirmModal/ConfirmModal.jsx
"use client"

import Button from "@/components/Button/Button"
import styles from "./ConfirmModal.module.css"

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <Button
            onClick={onClose}
            variant="secondary"
            className={styles.actionButton}
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            className={styles.actionButton}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
