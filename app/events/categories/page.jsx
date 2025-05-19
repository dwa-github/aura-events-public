// app/events/categories/page.jsx
import { loadEventsData } from "@/lib/loadEventsData"
import CategoryCard from "@/components/CategoryCard/CategoryCard"
import styles from "./page.module.css"

export default async function AllCategoriesPage() {
  const allData = await loadEventsData()
  const categories = allData?.categories || []

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Event Categories</h1>

      {categories.length > 0 ? (
        <div className={styles.grid}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  )
}

export const metadata = {
  title: "All Event Categories",
  description: "Browse all categories of events.",
}
