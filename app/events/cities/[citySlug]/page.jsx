// app/events/cities/[citySlug]/page.jsx
import { getCityData } from "@/lib/getCityData"
import EventCardLarge from "@/components/EventCardLarge/EventCardLarge"
import { notFound } from "next/navigation"
import styles from "../../page.module.css"

export default async function CityPage({ params }) {
  const citySlug = params.citySlug
  const data = await getCityData(citySlug)

  if (!data) {
    notFound()
  }

  const { city, events } = data

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Events in {city.name || citySlug}</h1>

      {events.length > 0 ? (
        <div className={styles.grid}>
          {events.map((event) => (
            <EventCardLarge key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>No events found in this city.</p>
      )}
    </div>
  )
}

export async function generateMetadata({ params }) {
  const { citySlug } = params
  const data = await getCityData(citySlug)

  if (!data) {
    return { title: "City Not Found" }
  }

  return {
    title: `Events in ${data.city.name || citySlug}`,
    description: `Browse events happening in ${data.city.name || citySlug}.`,
  }
}
