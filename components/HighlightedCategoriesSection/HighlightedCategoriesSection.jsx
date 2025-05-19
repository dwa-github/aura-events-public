// components/HighlightedCategoriesSection/HighlightedCategoriesSection.jsx
import React from "react"
import CategoryCard from "@/components/CategoryCard/CategoryCard" // Adjust path if needed
import styles from "./HighlightedCategoriesSection.module.css"

const HighlightedCategoriesSection = ({ categories = [] }) => {
  const validCategories = categories.filter((cat) => {
    const isValid =
      cat && cat.id && cat.name && cat.imageurl && cat.slug && cat.description
    return isValid
  })

  if (!validCategories || validCategories.length === 0) {
    return null
  }

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.sectionTitle}>Explore Categories</h2>
        <div className={styles.cardsContainer}>
          {validCategories.map((category) => (
            <div key={category.id} className={styles.cardWrapper}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HighlightedCategoriesSection
