// components/CountryCard/CountryCard.jsx
"use client"
import Link from "next/link"
import Image from "next/image"
import styles from "./CountryCard.module.css"

const CountryCard = ({ country }) => {
  if (!country || !country.id) {
    return null
  }

  const {
    slug,
    name = "Country Name",
    description = "Explore events in this country.",
    imageUrl: imageUrlFromCamelCase,
    imageurl: imageUrlFromLowerCase,
  } = country

  const imageUrl =
    imageUrlFromCamelCase ||
    imageUrlFromLowerCase ||
    "/images/placeholder-card-large.jpg"

  const countryUrl = slug ? `/events/countries/${slug}` : "#"

  return (
    <Link href={countryUrl} className={styles.cardLink}>
      <div className={`${styles.card} ${styles.largerCard}`}>
        <div className={styles.imageContainer}>
          {imageUrl && imageUrl !== "/images/placeholder-card-large.jpg" ? (
            <Image
              src={imageUrl}
              alt={name || "Country image"}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 60vw, (max-width: 1024px) 45vw, 37.5vw"
              style={{ objectFit: "cover" }}
              priority={false}
              className={styles.image}
              onError={(e) => {}}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              {imageUrl === "/images/placeholder-card-large.jpg"
                ? "Image Coming Soon"
                : "No Image"}
            </div>
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.countryName}>{name}</h3>
          {description && (
            <p className={styles.countryDescription}>{description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CountryCard
