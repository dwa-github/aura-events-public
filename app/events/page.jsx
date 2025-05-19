// app/events/page.jsx
"use client"

import { useState, useEffect, useCallback } from "react"
import LoadingDots from "@/components/ui/LoadingDots/LoadingDots"
import globalLoaderStyles from "@/app/styles/GlobalLoader.module.css"
import EventCardLarge from "@/components/EventCardLarge/EventCardLarge"
import Button from "@/components/Button/Button"
import styles from "./page.module.css"

const EVENTS_PER_PAGE = 9

export default function AllEventsPage() {
  const [events, setEvents] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  const fetchEvents = useCallback(
    async (pageToFetch) => {
      if (pageToFetch > 1 && isLoading) {
        return
      }
      setError(null)

      try {
        const response = await fetch(
          `/api/events?page=${pageToFetch}&limit=${EVENTS_PER_PAGE}`
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.message || `Failed to fetch events: ${response.status}`
          )
        }
        const data = await response.json()

        setEvents((prevEvents) =>
          pageToFetch === 1 ? data.events : [...prevEvents, ...data.events]
        )
        setHasMore(data.hasMore)
        setCurrentPage(data.currentPage)
      } catch (err) {
        setError(err.message)
        if (pageToFetch === 1) {
          setEvents([])
        }
      } finally {
        setIsLoading(false)
        if (pageToFetch === 1) {
          setInitialLoadComplete(true)
        }
      }
    },
    [isLoading]
  )

  useEffect(() => {
    fetchEvents(1)
  }, [fetchEvents])

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchEvents(currentPage + 1)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Events</h1>

      {isLoading && events.length === 0 && (
        <div className={globalLoaderStyles.fullPageContainer}>
          {" "}
          <LoadingDots />
          <p>Loading events...</p>
        </div>
      )}
      {error && <p className={styles.errorMessage}>Error: {error}</p>}

      {events.length > 0 ? (
        <div className={styles.grid}>
          {events.map((event) => (
            <EventCardLarge key={event.id} event={event} />
          ))}
        </div>
      ) : (
        initialLoadComplete && !isLoading && !error && <p>No events found.</p>
      )}

      {initialLoadComplete && hasMore && !isLoading && (
        <div className={styles.loadMoreContainer}>
          <Button onClick={handleLoadMore} variant="primary">
            Load More Events
          </Button>
        </div>
      )}
      {isLoading && events.length > 0 && (
        <div
          className={globalLoaderStyles.fullPageContainer}
          style={{ minHeight: "100px", marginTop: "1rem" }}
        >
          {" "}
          <LoadingDots />
          <p>Loading more events...</p>
        </div>
      )}
    </div>
  )
}
