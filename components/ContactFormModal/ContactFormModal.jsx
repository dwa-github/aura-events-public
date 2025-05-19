// components/ContactUs/ContactFormModal.jsx
"use client"

import { useState, useEffect } from "react"
import Modal from "@/components/Modal/Modal"
import Button from "@/components/Button/Button"
import styles from "./ContactFormModal.module.css"

export default function ContactFormModal({ isOpen, onClose, onSubmitSuccess }) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) {
      setName("")
      setMessage("")
      setErrors({})
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors = {}
    if (!name.trim()) {
      newErrors.name = "Name is required."
    }
    if (!message.trim()) {
      newErrors.message = "Message is required."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmitSuccess()
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Contact Us"
      ariaLabelledBy="contact-modal-title"
    >
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="contact-name" className={styles.label}>
            Name <span className={styles.requiredIndicator}>*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${styles.input} ${
              errors.name ? styles.inputError : ""
            }`}
            aria-required="true"
            aria-describedby={errors.name ? "name-error-message" : undefined}
          />
          {errors.name && (
            <p id="name-error-message" className={styles.errorMessage}>
              {errors.name}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact-message" className={styles.label}>
            Message <span className={styles.requiredIndicator}>*</span>
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            className={`${styles.textarea} ${
              errors.message ? styles.inputError : ""
            }`}
            aria-required="true"
            aria-describedby={
              errors.message ? "message-error-message" : undefined
            }
          />
          {errors.message && (
            <p id="message-error-message" className={styles.errorMessage}>
              {errors.message}
            </p>
          )}
        </div>

        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Send Message
          </Button>
        </div>
      </form>
    </Modal>
  )
}
