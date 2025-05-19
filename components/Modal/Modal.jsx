// components/Modal/Modal.jsx
"use client"
import React, { useEffect, useRef } from "react"
import styles from "./Modal.module.css"
import { LuX } from "react-icons/lu"

const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <LuX size={24} />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
