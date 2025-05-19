// app/events/categories/[categorySlug]/page.jsx
import { getCategoryData } from "@/lib/getCategoryData"
import EventCardLarge from "@/components/EventCardLarge/EventCardLarge"
import { notFound } from "next/navigation"
import styles from "../../page.module.css"

export default async function CategoryPage({ params }) {
  const categorySlug = params.categorySlug

  const data = await getCategoryData(categorySlug)

  if (!data) {
    notFound()
  }

  const { category, events } = data

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{category.name} Events</h1>

      {events.length > 0 ? (
        <div className={styles.grid}>
          {events.map((event) => (
            <EventCardLarge key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>No events found in this category.</p>
      )}
    </div>
  )
}

export async function generateMetadata({ params }) {
  const categorySlug = params.categorySlug
  const data = await getCategoryData(categorySlug)

  if (!data) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${data.category.name} Events`,
    description: `Browse events in the ${data.category.name} category. ${
      data.category.description || ""
    }`.trim(),
  }
}
