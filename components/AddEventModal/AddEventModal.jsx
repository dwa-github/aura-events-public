// ./components/AddEventModal/AddEventModal.jsx
"use client"

import React from "react"
import Modal from "@/components/Modal/Modal"
import AddEventForm from "@/components/AddEventForm/AddEventForm"

const AddEventModal = ({
  isOpen,
  onClose,
  categories,
  allArtists,
  cities,
  countries,
  allLocations,
  onEventSubmit,
  isSubmitting,
}) => {
  if (!isOpen) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Event">
      <AddEventForm
        categories={categories}
        artists={allArtists}
        cities={cities}
        countries={countries}
        locations={allLocations}
        onSubmit={onEventSubmit}
        isSubmitting={isSubmitting}
        onCancel={onClose}
      />
    </Modal>
  )
}

export default AddEventModal
