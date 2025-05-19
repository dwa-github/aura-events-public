// app/dashboard/events/[eventId]/edit/EditEventPageClient.jsx
"use client"

import AddEventForm from "@/components/AddEventForm/AddEventForm"
import { useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import UserContext from "@/context/UserContext"
import SuccessModal from "@/components/SuccessModal/SuccessModal"

export default function EditEventPageClient({ eventToEdit, dropdownData }) {
  const { currentUser } = useContext(UserContext)
  const [isClientHydrated, setIsClientHydrated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    setIsClientHydrated(true)
  }, [])

  if (!isClientHydrated) {
    return null
  }

  if (
    !currentUser ||
    !eventToEdit ||
    currentUser.id !== eventToEdit.organizerUserId
  ) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>You are not authorized to edit this event.</p>
      </div>
    )
  }

  const handleUpdateEvent = async (updatedEventData, isEdit, eventId) => {
    if (!isEdit || !eventId) {
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEventData),
      })

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}))
        throw new Error(
          errorResult.message ||
            `Failed to update event. Status: ${response.status}`
        )
      }

      setSuccessMessage(
        `Event "${updatedEventData.title}" updated successfully!`
      )
      setShowSuccessModal(true)
    } catch (error) {
      alert(`Error updating event: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessModalAndRedirect = () => {
    setShowSuccessModal(false)
    router.push(`/events/${eventToEdit.slug || eventToEdit.id}`)
    router.refresh()
  }

  const handleCancelEdit = () => {
    router.push(`/events/${eventToEdit.slug || eventToEdit.id}`)
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Edit Event: {eventToEdit.title}</h1>
      <AddEventForm
        isEditMode={true}
        eventToEdit={eventToEdit}
        categories={dropdownData.categories}
        artists={dropdownData.artists}
        cities={dropdownData.cities}
        countries={dropdownData.countries}
        locations={dropdownData.locations}
        onSubmit={handleUpdateEvent}
        onCancel={handleCancelEdit}
        isSubmitting={isSubmitting}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModalAndRedirect}
        title="Event Updated!"
        message={successMessage}
      />
    </div>
  )
}
