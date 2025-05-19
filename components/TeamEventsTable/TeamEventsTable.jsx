// components/TeamEventsTable/TeamEventsTable.jsx
"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import styles from "../EventsTableSection/EventsTableSection.module.css"
import Button from "@/components/Button/Button"

const ITEMS_PER_PAGE = 10

export default function TeamEventsTable({ teamEvents = [] }) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const router = useRouter()

  const visibleTeamEvents = useMemo(() => {
    return teamEvents.slice(0, visibleCount)
  }, [teamEvents, visibleCount])

  const hasMoreEvents = visibleCount < teamEvents.length

  const handleRowClick = (event) => {
    const eventIdentifier = event.slug || event.id
    router.push(`/events/${eventIdentifier}`)
  }

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE)
  }

  return (
    <section className={styles.eventsTableContainer} id="team-events-table">
      <div className={styles.tableHeader}>
        <h2 className={styles.sectionTitle}>Team Activity</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.eventsTable}>
          <thead>
            <tr>
              <th scope="col">Event Name</th>
              <th scope="col">Category</th>
              <th scope="col">City</th>
              <th scope="col">Organizer</th>
            </tr>
          </thead>
          <tbody>
            {visibleTeamEvents.length > 0 ? (
              visibleTeamEvents.map((event) => (
                <tr
                  key={event.id}
                  className={styles.tableRow}
                  onClick={() => handleRowClick(event)}
                >
                  <td data-label="Event Name" className={styles.titleCell}>
                    {event.title}
                  </td>
                  <td data-label="Category">{event.categoryName || "N/A"}</td>
                  <td data-label="City">{event.cityName || "N/A"}</td>
                  <td data-label="Organizer">{event.userName || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.noEventsCell}>
                  No team events found.
                </td>
              </tr>
            )}
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
    </section>
  )
}
