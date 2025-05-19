// /components/EventsTableSection/EventsTableSection.jsx
"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import styles from "./EventsTableSection.module.css"
import Button from "@/components/Button/Button"
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal"
import SuccessModal from "@/components/SuccessModal/SuccessModal"

const ITEMS_PER_PAGE = 10

export default function EventsTableSection({
  allEvents = [],
  title = "Events",
  showAddButton = false,
  columns = ["title", "category", "city", "organizer"],
  showRowActions = false,
  onAddEventClick,
}) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const router = useRouter()

  const [showConfirmDropModal, setShowConfirmDropModal] = useState(false)
  const [showDropSuccessModal, setShowDropSuccessModal] = useState(false)
  const [eventToDrop, setEventToDrop] = useState(null)
  const [dropSuccessMessage, setDropSuccessMessage] = useState("")
  const [isDropping, setIsDropping] = useState(false)

  const visibleEvents = useMemo(() => {
    return allEvents.slice(0, visibleCount)
  }, [allEvents, visibleCount])

  const hasMoreEvents = visibleCount < allEvents.length

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE)
  }

  const handleRowClick = (event) => {
    const eventIdentifier = event.slug || event.id
    router.push(`/events/${eventIdentifier}`)
  }

  const sectionTitle = title

  const handleOpenConfirmDropModal = (eventData) => {
    setEventToDrop(eventData)
    setShowConfirmDropModal(true)
  }

  const handleCloseConfirmDropModal = () => {
    setShowConfirmDropModal(false)
    setEventToDrop(null)
  }

  const handleProceedWithDrop = async () => {
    if (!eventToDrop || !eventToDrop.id) return

    setIsDropping(true)
    try {
      const response = await fetch(`/api/events/${eventToDrop.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to drop event")
      }

      setDropSuccessMessage(
        `Event "${eventToDrop.title}" has been successfully dropped.`
      )
      setShowDropSuccessModal(true)
    } catch (error) {
      console.error("Error dropping event:", error)
      alert(`Error dropping event: ${error.message}`)
    } finally {
      setIsDropping(false)
      handleCloseConfirmDropModal()
    }
  }

  const handleCloseDropSuccessModal = () => {
    setShowDropSuccessModal(false)
    router.refresh()
  }

  return (
    <section className={styles.eventsTableContainer} id="user-events-table">
      <div className={styles.tableHeader}>
        <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
        {showAddButton && onAddEventClick && (
          <Button onClick={onAddEventClick} variant="primary">
            Add Event +
          </Button>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.eventsTable}>
          <thead>
            <tr>
              {columns.includes("title") && <th scope="col">Event Name</th>}
              {columns.includes("category") && <th scope="col">Category</th>}
              {columns.includes("city") && <th scope="col">City</th>}
              {columns.includes("organizer") && <th scope="col">Organizer</th>}
              {showRowActions && (
                <th scope="col" className={styles.manageHeader}>
                  Manage Events
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {visibleEvents.map((event) => (
              <tr
                key={event.id}
                className={styles.tableRow}
                onClick={() => handleRowClick(event)}
              >
                {columns.includes("title") && (
                  <td data-label="Event Name" className={styles.titleText}>
                    {event.title}
                  </td>
                )}
                {columns.includes("category") && (
                  <td data-label="Category">{event.categoryName || "N/A"}</td>
                )}
                {columns.includes("city") && (
                  <td data-label="City">{event.cityName || "N/A"}</td>
                )}
                {columns.includes("organizer") && (
                  <td data-label="Organizer">{event.userName || "N/A"}</td>
                )}
                {showRowActions && (
                  <td data-label="Manage Events" className={styles.actionsCell}>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/dashboard/events/${event.id}/edit`)
                      }}
                    >
                      Manage
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenConfirmDropModal(event)
                      }}
                    >
                      Drop
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMoreEvents && (
        <div className={styles.loadMoreContainer}>
          <Button onClick={handleLoadMore} variant="secondary">
            Load More Events ↓
          </Button>
        </div>
      )}

      {/* Modals for Drop Action */}
      {eventToDrop && (
        <ConfirmModal
          isOpen={showConfirmDropModal}
          onClose={handleCloseConfirmDropModal}
          onConfirm={handleProceedWithDrop}
          title="Confirm Drop Event"
          message={`Are you sure you want to drop the event "${
            eventToDrop?.title || "this event"
          }"? This action cannot be undone.`}
          confirmButtonText="Drop Event"
          isLoading={isDropping}
        />
      )}
      <SuccessModal
        isOpen={showDropSuccessModal}
        onClose={handleCloseDropSuccessModal}
        title="Event Dropped!"
        message={dropSuccessMessage}
      />
    </section>
  )
}
