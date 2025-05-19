// components/BookingModal/BookingModal.jsx
"use client"

import styles from "./BookingModal.module.css"

export default function BookingModal({ event, isOpen, onClose }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Book Tickets for {event?.title || "this event"}</h3>
        <p>Ticket selection UI will go here.</p>
        <p>Capacity: {event?.capacity ?? "N/A"}</p>
        <p>Currently Booked: {event?.attendees?.length || 0}</p>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  )
}
