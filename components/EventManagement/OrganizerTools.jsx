// components/EventManagement/OrganizerTools.jsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useContext } from "react"
import styles from "./OrganizerTools.module.css"
import UserContext from "@/context/UserContext"
import SuccessModal from "@/components/SuccessModal/SuccessModal"
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal"
import Button from "@/components/Button/Button"
import {
  Edit3,
  Trash2,
  Info,
  CalendarDays,
  RefreshCcw,
  DollarSign,
  Users,
} from "lucide-react"

export default function OrganizerTools({ event, currentUser }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [showDropSuccessModal, setShowDropSuccessModal] = useState(false)
  const [dropSuccessMessage, setDropSuccessMessage] = useState("")
  const [showConfirmDropModal, setShowConfirmDropModal] = useState(false)
  const [eventToDropId, setEventToDropId] = useState(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const openConfirmDropModal = (eventId) => {
    setEventToDropId(eventId)
    setShowConfirmDropModal(true)
  }

  const closeConfirmDropModal = () => {
    setShowConfirmDropModal(false)
    setEventToDropId(null)
  }

  const proceedWithDrop = async () => {
    if (!eventToDropId) return

    try {
      const response = await fetch(`/api/events/${eventToDropId}`, {
        method: "DELETE",
      })

      closeConfirmDropModal()

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to drop event")
      }

      setDropSuccessMessage(
        `Event "${event.title}" has been successfully dropped.`
      )
      setShowDropSuccessModal(true)
    } catch (error) {
      console.error("Error dropping event:", error)
      alert(`Error dropping event: ${error.message}`)
    }
  }

  const handleCloseDropSuccessModal = () => {
    setShowDropSuccessModal(false)
    router.push(
      currentUser?.slug ? `/dashboard/${currentUser.slug}` : "/dashboard"
    )
    router.refresh()
  }

  if (!currentUser || !event || currentUser.id !== event.organizerUserId) {
    return null
  }

  return (
    <section
      className={styles.organizerToolsWrapper}
      aria-labelledby="organizer-tools-heading"
    >
      <div className={styles.organizerToolsCard}>
        {" "}
        <h2 id="organizer-tools-heading" className={styles.cardTitle}>
          Organizer Tools
        </h2>
        <div className={styles.contentLayoutGrid}>
          {" "}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionSubtitle}>Event Information</h3>
            <div className={styles.detailsItemsGrid}>
              <div className={styles.detailItem}>
                <Info size={16} className={styles.detailIcon} />
                <strong>Event ID:</strong> <span>{event.id}</span>
              </div>
              <div className={styles.detailItem}>
                <CalendarDays size={16} className={styles.detailIcon} />
                <strong>Created:</strong>{" "}
                <span>{new Date(event.createdAt).toLocaleString()}</span>
              </div>
              {event.updatedAt &&
                new Date(event.updatedAt).getTime() !==
                  new Date(event.createdAt).getTime() && (
                  <div className={styles.detailItem}>
                    <RefreshCcw size={16} className={styles.detailIcon} />
                    <strong>Last Updated:</strong>{" "}
                    <span>{new Date(event.updatedAt).toLocaleString()}</span>
                  </div>
                )}
              <div className={styles.detailItem}>
                <Users size={16} className={styles.detailIcon} />
                <strong>Capacity:</strong> <span>{event.capacity}</span>
              </div>
              <div className={styles.detailItem}>
                <Users size={16} className={styles.detailIcon} />
                <strong>Attendees:</strong>{" "}
                <span>{event.simulatedAttendeeCount || 0}</span>
              </div>
            </div>
          </div>
          <div className={styles.actionsSection}>
            <h3 className={styles.sectionSubtitle}>Manage Event</h3>
            <p className={styles.sectionDescription}>
              Here you can modify the details of your event, or remove it if
              it's no longer scheduled. Please be careful, as dropping an event
              is a permanent action.
            </p>
            <div className={styles.actionButtonsGrid}>
              <Link
                href={`/dashboard/events/${event.id}/edit`}
                passHref
                className={styles.actionLinkWrapper}
              >
                <Button variant="secondary" icon={<Edit3 size={16} />}>
                  Edit Event
                </Button>
              </Link>
              <Button
                variant="danger"
                onClick={() => openConfirmDropModal(event.id)}
                icon={<Trash2 size={16} />}
              >
                Drop Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showDropSuccessModal}
        onClose={handleCloseDropSuccessModal}
        title="Event Dropped!"
        message={dropSuccessMessage}
      />
      <ConfirmModal
        isOpen={showConfirmDropModal}
        onClose={closeConfirmDropModal}
        onConfirm={proceedWithDrop}
        title="Confirm Drop Event"
        message={`Are you sure you want to drop the event "${
          event?.title || "this event"
        }"? This action cannot be undone.`}
        confirmButtonText="Drop Event"
      />
    </section>
  )
}
