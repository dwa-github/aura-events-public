// components/OverviewSection/OverviewSection.jsx
import React from "react"
import styles from "./OverviewSection.module.css"
import Link from "next/link"

const limitItems = (items, limit) => items.slice(0, limit)

export default function OverviewSection({ cities = [], categories = [] }) {
  const displayLimit = 5
  const citiesToShow = limitItems(cities, displayLimit)
  const categoriesToShow = limitItems(categories, displayLimit)

  return (
    <section className={styles.overviewSection}>
      <h2 className={styles.sectionTitle}>Relevant Info</h2>
      <div className={styles.cardsContainer}>
        <div className={styles.overviewCard}>
          <h3 className={styles.cardTitle}>Cities ({cities.length})</h3>
          <ul className={styles.cardList}>
            {citiesToShow.map((city) => (
              <li key={city.id}>
                <Link href={`/events/${city.slug || city.id}`}>
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
          {cities.length > displayLimit && (
            <Link href="/dashboard/cities" className={styles.viewAllLink}>
              View All Cities →
            </Link>
          )}
        </div>

        <div className={styles.overviewCard}>
          <h3 className={styles.cardTitle}>Categories ({categories.length})</h3>
          <ul className={styles.cardList}>
            {categoriesToShow.map((category) => (
              <li key={category.id}>
                <Link href={`/events?category=${category.slug || category.id}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
          {categories.length > displayLimit && (
            <Link href="/dashboard/categories" className={styles.viewAllLink}>
              View All Categories →
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
