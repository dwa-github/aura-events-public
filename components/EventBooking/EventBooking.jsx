// components/EventBooking/EventBooking.jsx
"use client"

import { useState, useEffect } from "react"
import styles from "./EventBooking.module.css"
import { MinusIcon, PlusIcon } from "lucide-react"

export default function EventBooking({
  event,
  isOpen,
  onClose,
  onBookingSuccess,
  availableTicketsForUser,
}) {
  const title = event?.title || "this event"

  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setTicketQuantity(1)
      setMessage({ text: "", type: "" })
      setIsBookingConfirmed(false)
      setIsLoading(false)
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleInternalClose = () => {
    setMessage({ text: "", type: "" })
    setIsBookingConfirmed(false)
    if (onClose) {
      onClose()
    }
  }

  const handleQuantityChange = (amount) => {
    setTicketQuantity((prev) => {
      const newQuantity = prev + amount
      if (newQuantity < 1) return 1
      const maxSelectable = Math.min(
        availableTicketsForUser > 0 ? availableTicketsForUser : 0,
        4
      )
      if (newQuantity > maxSelectable && maxSelectable > 0) return maxSelectable
      if (maxSelectable === 0 && newQuantity > 0) return 1
      if (newQuantity > maxSelectable) return maxSelectable
      return newQuantity
    })
  }

  const handleConfirmBooking = async () => {
    setIsLoading(true)
    setMessage({ text: "", type: "" })
    if (ticketQuantity <= 0) {
      setMessage({ text: "Please select at least one ticket.", type: "error" })
      return
    }
    if (ticketQuantity > availableTicketsForUser) {
      setMessage({
        text: `Sorry, only ${
          availableTicketsForUser > 0 ? availableTicketsForUser : 0
        } ticket(s) remaining.`,
        type: "error",
      })
      return
    }

    try {
      const response = await fetch("/api/book-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          ticketQuantity: ticketQuantity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({
          text: data.message || "Booking failed. Please try again.",
          type: "error",
        })
        setIsLoading(false)
        return
      }

      setMessage({
        text: `Success! You've booked ${ticketQuantity} ticket(s) for ${title}.`,
        type: "success",
      })
      setIsBookingConfirmed(true)
      if (onBookingSuccess) {
        onBookingSuccess(ticketQuantity)
      }
    } catch (error) {
      console.error("Error during booking API call:", error)
      setMessage({
        text: "An unexpected error occurred. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={styles.modalBackdrop}
      onClick={handleInternalClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookingModalTitle"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {!isBookingConfirmed ? (
          <>
            <h4 id="bookingModalTitle" className={styles.modalTitle}>
              Select Tickets for {title}
            </h4>
            {availableTicketsForUser > 0 ? (
              <>
                <div className={styles.quantitySelector}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    aria-label="Decrease ticket quantity"
                    disabled={ticketQuantity <= 1}
                    className={styles.quantityButton}
                  >
                    <MinusIcon size={16} />
                  </button>
                  <span className={styles.quantityDisplay}>
                    {ticketQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    aria-label="Increase ticket quantity"
                    disabled={
                      ticketQuantity >=
                        Math.min(
                          availableTicketsForUser > 0
                            ? availableTicketsForUser
                            : 0,
                          4
                        ) || availableTicketsForUser === 0
                    }
                    className={styles.quantityButton}
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
                <p className={styles.availabilityInfo}>
                  {availableTicketsForUser - ticketQuantity >= 0
                    ? `${
                        availableTicketsForUser - ticketQuantity
                      } ticket(s) will remain.`
                    : `Not enough tickets.`}
                  (Max{" "}
                  {Math.min(
                    availableTicketsForUser > 0 ? availableTicketsForUser : 0,
                    4
                  )}{" "}
                  per booking)
                </p>
                <button
                  onClick={handleConfirmBooking}
                  className={styles.confirmButton}
                  disabled={
                    ticketQuantity <= 0 ||
                    ticketQuantity > availableTicketsForUser ||
                    isLoading
                  }
                >
                  Confirm {ticketQuantity} Ticket(s)
                </button>
              </>
            ) : (
              <p className={styles.soldOutMessage}>
                This event is currently sold out.
              </p>
            )}
            {message.text && !isBookingConfirmed && (
              <p
                className={`${styles.message} ${
                  message.type === "error" ? styles.errorMessage : ""
                }`}
              >
                {message.text}
              </p>
            )}
            <button
              onClick={handleInternalClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h4 id="bookingModalTitleConfirmed" className={styles.modalTitle}>
              Booking Confirmed!
            </h4>
            {message.text && message.type === "success" && (
              <p className={`${styles.message} ${styles.successMessage}`}>
                {message.text}
              </p>
            )}
            <button
              onClick={handleInternalClose}
              className={styles.closeButtonAfterConfirm}
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  )
}
