// /components/CategoryCard/CategoryCard.jsx
import React from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./CategoryCard.module.css"

const CategoryCard = ({ category }) => {
  if (!category) {
    return null
  }

  const {
    slug,
    name = "Category Name",
    description = "Explore events in this category.",
    imageurl: categoryImageUrl = "/images/categories/placeholder-card.jpg",
  } = category

  const categoryUrl = slug ? `/events/categories/${slug}` : "#"

  return (
    <Link href={categoryUrl} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          {categoryImageUrl && (
            <>
              <div className={styles.overlay}></div>
              <Image
                src={categoryImageUrl}
                alt={name || "Category image"}
                fill
                sizes="(max-width: 640px) 60vw, (max-width: 768px) 40vw, (max-width: 992px) 30vw, 25vw"
                style={{ objectFit: "cover" }}
                priority={false}
              />
            </>
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.categoryName}>{name}</h3>
          <p className={styles.categoryDescription}>{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
