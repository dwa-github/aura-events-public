// app/HomePageClientInteractions.jsx
"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header/Header"
import EventBooking from "@/components/EventBooking/EventBooking"

export default function HomePageClientInteractions({ featuredEvent }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [primaryButtonText, setPrimaryButtonText] = useState("Book Ticket")
  const [isPrimaryButtonDisabled, setIsPrimaryButtonDisabled] = useState(false)

  useEffect(() => {
    if (featuredEvent) {
      if (featuredEvent.simulatedAttendeeCount >= featuredEvent.capacity) {
        setPrimaryButtonText("Sold Out")
        setIsPrimaryButtonDisabled(true)
      } else {
        const bookedInSession = localStorage.getItem(
          `event_${featuredEvent.id}_booked_session`
        )
        if (bookedInSession === "true") {
          setPrimaryButtonText("Booked!")
          setIsPrimaryButtonDisabled(true)
        } else {
          setPrimaryButtonText("Book Ticket")
          setIsPrimaryButtonDisabled(false)
        }
      }
    } else {
      setPrimaryButtonText("Event Info")
      setIsPrimaryButtonDisabled(true)
    }
  }, [featuredEvent])

  const handleOpenModal = () => {
    if (featuredEvent && !isPrimaryButtonDisabled) {
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleBookingConfirmed = (event, ticketsBooked) => {
    setPrimaryButtonText("Booked!")
    setIsPrimaryButtonDisabled(true)

    if (event) {
      localStorage.setItem(`event_${event.id}_booked_session`, "true")
    }
  }

  return (
    <>
      <Header
        event={featuredEvent}
        primaryButtonText={primaryButtonText}
        onPrimaryButtonClick={handleOpenModal}
        isPrimaryButtonDisabled={isPrimaryButtonDisabled}
      />
      {isModalOpen && featuredEvent && (
        <EventBooking
          event={featuredEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onBookingSuccess={(ticketsBooked) =>
            handleBookingConfirmed(featuredEvent, ticketsBooked)
          }
          availableTicketsForUser={
            featuredEvent.capacity - featuredEvent.simulatedAttendeeCount
          }
        />
      )}
    </>
  )
}
