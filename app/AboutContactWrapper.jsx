// app/AboutContactWrapper.jsx
"use client"

import { useState } from "react"
import AboutContactSection from "@/components/AboutContactSection/AboutContactSection"
import ContactFormModal from "@/components/ContactFormModal/ContactFormModal"
import SuccessModal from "@/components/SuccessModal/SuccessModal"

export default function AboutContactWrapper() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleOpenContactForm = () => {
    setIsContactFormOpen(true)
    setIsSuccessModalOpen(false)
  }

  const handleCloseContactForm = () => {
    setIsContactFormOpen(false)
  }

  const handleSubmitContactFormSuccess = () => {
    setIsContactFormOpen(false)
    setIsSuccessModalOpen(true)
  }

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false)
  }

  return (
    <>
      <AboutContactSection onContactUsClick={handleOpenContactForm} />

      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={handleCloseContactForm}
        onSubmitSuccess={handleSubmitContactFormSuccess}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        title="Message Sent!"
        message="Thank you for your message! We'll get back to you soon."
      />
    </>
  )
}
