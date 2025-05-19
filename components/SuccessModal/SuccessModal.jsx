// components/SuccessModal/SuccessModal.jsx
"use client"

import { useRouter } from "next/navigation"
import Button from "@/components/Button/Button"
import styles from "./SuccessModal.module.css"

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Success!",
  message,
  eventSlug,
}) {
  const router = useRouter()

  if (!isOpen) {
    return null
  }

  const handlePrimaryAction = () => {
    if (eventSlug) {
      router.push(`/events/${eventSlug}`)
    }
    onClose()
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <svg
          className={styles.successIcon}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          width="40px"
          height="40px"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <Button
            onClick={handlePrimaryAction}
            className={styles.closeButton}
            variant="primary"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}
