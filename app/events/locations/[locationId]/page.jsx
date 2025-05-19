// app/events/locations/[locationId]/page.jsx
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getLocationDetailData } from "@/lib/getLocationDetailData"
import EventCardLarge from "@/components/EventCardLarge/EventCardLarge"
import styles from "./page.module.css"

export async function generateMetadata({ params }) {
  const { locationId } = params
  const { location } = await getLocationDetailData(locationId)

  if (!location) {
    return {
      title: "Location Not Found | Aura Events",
    }
  }

  return {
    title: `Events at ${location.name} | Aura Events`,
    description: `Explore events happening at ${location.name}${
      location.address ? `, ${location.address}` : ""
    }.`,
    openGraph: {
      title: `Events at ${location.name}`,
      description: `Discover events at ${location.name}${
        location.address ? `, ${location.address}` : ""
      }.`,
    },
  }
}

async function LocationEventsList({ locationId }) {
  const { location, events, error } = await getLocationDetailData(locationId)

  if (error && !location) {
    return <p className={styles.errorMessage}>Error loading events: {error}</p>
  }

  if (events.length === 0) {
    return (
      <p className={styles.noItemsMessage}>
        No events currently listed for {location.name}.
      </p>
    )
  }

  return (
    <div className={styles.grid}>
      {" "}
      {events.map((event) => (
        <EventCardLarge key={event.id} event={event} />
      ))}
    </div>
  )
}

export default async function LocationDetailPage({ params }) {
  const { locationId } = params
  const { location } = await getLocationDetailData(locationId)

  if (!location) {
    notFound()
  }

  return (
    <div className={styles.container}>
      {" "}
      <h1 className={styles.title}>Events at {location.name}</h1>
      {location.address && (
        <p className={styles.subTitle}>{location.address}</p>
      )}
      <section className={styles.eventsSection}>
        <Suspense
          fallback={<p className={styles.loadingMessage}>Loading events...</p>}
        >
          <LocationEventsList locationId={locationId} />
        </Suspense>
      </section>
    </div>
  )
}
