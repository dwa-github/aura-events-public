// app/events/countries/[countrySlug]/page.jsx
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCountryDetailData } from "@/lib/getCountryDetailData"
import EventCardLarge from "@/components/EventCardLarge/EventCardLarge"
import styles from "./page.module.css"

export async function generateMetadata({ params }) {
  const { countrySlug } = params
  const { country } = await getCountryDetailData(countrySlug)

  if (!country) {
    return {
      title: "Country Not Found | Aura Events",
    }
  }

  return {
    title: `Events in ${country.name} | Aura Events`,
    description: `Explore events happening in ${country.name}. ${
      country.description || ""
    }`,
    openGraph: {
      title: `Events in ${country.name}`,
      description: country.description || `Discover events in ${country.name}.`,
      images: country.imageUrl
        ? [{ url: country.imageUrl, alt: country.name }]
        : [],
    },
  }
}

async function CountryEventsList({ countrySlug }) {
  const { country, events, error } = await getCountryDetailData(countrySlug)

  if (error && !country) {
    return <p className={styles.errorMessage}>Error loading events: {error}</p>
  }

  if (events.length === 0) {
    return (
      <p className={styles.noItemsMessage}>
        No events currently listed for {country.name}.
      </p>
    )
  }

  return (
    <div className={styles.eventsGrid}>
      {events.map((event) => (
        <EventCardLarge key={event.id} event={event} />
      ))}
    </div>
  )
}

export default async function CountryDetailPage({ params }) {
  const { countrySlug } = params
  const { country, error } = await getCountryDetailData(countrySlug)

  if (!country) {
    notFound()
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Events in {country.name}</h1>
      <section className={styles.eventsSection}>
        <Suspense
          fallback={<p className={styles.loadingMessage}>Loading events...</p>}
        >
          <CountryEventsList countrySlug={countrySlug} />
        </Suspense>
      </section>
    </div>
  )
}
