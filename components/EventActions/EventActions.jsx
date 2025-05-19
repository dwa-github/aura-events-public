// components/EventActions/EventActions.jsx
"use client"

import { useState, useEffect } from "react"
import { ShareIcon, CalendarDaysIcon } from "@heroicons/react/24/outline"
import styles from "./EventActions.module.css"
import { createEvents } from "ics"

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")

export default function EventActions({ event }) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href)
    }
  }, [])

  const handleCopyLink = async () => {
    if (!currentUrl) return
    try {
      await navigator.clipboard.writeText(currentUrl)
      alert("Link copied to clipboard!")
      setShowShareModal(false)
    } catch (err) {
      console.error("Failed to copy link:", err)
      alert("Failed to copy link.")
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share && event && currentUrl) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title} - ${
            event.shortDescription || ""
          }`,
          url: currentUrl,
        })
        setShowShareModal(false)
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing event:", err)
        }
      }
    } else {
      console.log("Web Share API not supported or event/URL data missing.")
    }
  }

  const shareToX = () => {
    if (!event || !currentUrl) return
    const text = encodeURIComponent(
      `Check out this event: ${event.title} - ${event.shortDescription || ""}`
    )
    const url = encodeURIComponent(currentUrl)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer"
    )
    setShowShareModal(false)
  }

  const shareToFacebook = () => {
    if (!currentUrl) return
    const url = encodeURIComponent(currentUrl)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer"
    )
    setShowShareModal(false)
  }

  const shareViaEmail = () => {
    if (!event || !currentUrl) return
    const subject = encodeURIComponent(`Check out this event: ${event.title}`)
    const body = encodeURIComponent(
      `Hi,\n\nI thought you might be interested in this event:\n\n${
        event.title
      }\n${event.shortDescription || ""}\n\nFind out more: ${currentUrl}\n\n`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    setShowShareModal(false)
  }

  const handleAddToCalendar = () => {
    if (!event || !event.startDateTime || !event.endDateTime) {
      alert("Event details are incomplete for calendar export.")
      return
    }

    const parseDateTime = (dateTimeString) => {
      const date = new Date(dateTimeString)
      if (isNaN(date.getTime()))
        throw new Error(`Invalid date: ${dateTimeString}`)
      return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
      ]
    }

    const stripHtml = (html) => {
      if (typeof window === "undefined" || !html) return html || ""
      try {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent || ""
      } catch (e) {
        console.warn(
          "Could not parse HTML for stripping, returning original.",
          e
        )
        return html
      }
    }

    try {
      const plainDescription = stripHtml(
        event.fullDescription ||
          event.shortDescription ||
          "No description available."
      )

      let calendarDescription = plainDescription
      if (event.isOnline && event.onlineMeetingUrl) {
        calendarDescription =
          `${plainDescription}\n\nJoin online: ${event.onlineMeetingUrl}`.trim()
      }

      const icsEvent = {
        title: event.title,
        description: calendarDescription,
        start: parseDateTime(event.startDateTime),
        end: parseDateTime(event.endDateTime),
        location:
          event.location?.name ||
          event.location?.address ||
          (event.isOnline ? "Online Event" : undefined),
        url: currentUrl || undefined,
        status: "CONFIRMED",
        busyStatus: "BUSY",
        organizer: event.organizer
          ? { name: event.organizer.name, email: event.organizer.contact }
          : undefined,
      }

      createEvents([icsEvent], (error, value) => {
        if (error) {
          console.error("Error creating ICS file:", error)
          alert("Failed to create calendar event file.")
          return
        }
        const filename = `${slugify(event.title || "event")}.ics`
        const blob = new Blob([value], { type: "text/calendar;charset=utf-8" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
      })
    } catch (e) {
      console.error("Error preparing calendar event data:", e)
      alert(`Error preparing calendar event: ${e.message}`)
    }
  }

  const canNativeShare = typeof navigator !== "undefined" && navigator.share

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className={styles.actionButton}
        aria-label="Share this event"
      >
        <ShareIcon className={styles.icon} />
        <span>Share</span>
      </button>
      <button
        onClick={handleAddToCalendar}
        className={styles.actionButton}
        aria-label="Add to Calendar"
      >
        <CalendarDaysIcon className={styles.icon} />
        <span>Calendar</span>
      </button>

      {showShareModal && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowShareModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shareModalTitle"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="shareModalTitle" className={styles.modalTitle}>
              Share Event
            </h3>
            {canNativeShare && (
              <button
                onClick={handleNativeShare}
                className={styles.shareOptionButton}
              >
                <ShareIcon className={styles.icon} /> Share via App...
              </button>
            )}
            <button
              onClick={handleCopyLink}
              className={styles.shareOptionButton}
            >
              Copy Link
            </button>
            <button onClick={shareToX} className={styles.shareOptionButton}>
              Share on X
            </button>
            <button
              onClick={shareToFacebook}
              className={styles.shareOptionButton}
            >
              Share on Facebook
            </button>
            <button
              onClick={shareViaEmail}
              className={styles.shareOptionButton}
            >
              Share via Email
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              className={`${styles.shareOptionButton} ${styles.cancelButton}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
