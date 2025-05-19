// app/events/locations/page.jsx
import { Suspense } from "react"
import { getLocationsData } from "@/lib/getLocationsData"
import LocationCard from "@/components/LocationCard/LocationCard"
import styles from "./page.module.css"

export const metadata = {
  title: "All Event Locations | Aura Events",
  description: "Browse all event locations and venues.",
}

async function LocationsList() {
  const { locations, error } = await getLocationsData()

  if (error) {
    return (
      <p className={styles.errorMessage}>Error loading locations: {error}</p>
    )
  }

  if (!locations || locations.length === 0) {
    return <p className={styles.noItemsMessage}>No locations found.</p>
  }

  return (
    <div className={styles.grid}>
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  )
}

export default function LocationsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Event Locations</h1>
      <section>
        {" "}
        <Suspense
          fallback={
            <p className={styles.loadingMessage}>Loading locations...</p>
          }
        >
          <LocationsList />
        </Suspense>
      </section>
    </div>
  )
}
