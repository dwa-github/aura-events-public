// components/CityCard/CityCard.jsx
import React from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./CityCard.module.css"

const CityCard = ({ city }) => {
  const {
    id = "",
    name = "City Name",
    description = "Explore this amazing city.",
    imageurl: imageUrl = "/images/cities/placeholder-9-16.jpg",
  } = city || {}

  const citySlug = name ? name.toLowerCase().replace(/\s+/g, "-") : id
  const cityLink = `/events/cities/${citySlug}`

  return (
    <Link href={cityLink} className={styles.cardLink}>
      <div className={styles.card}>
        <Image
          src={imageUrl}
          alt={`Image of ${name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ objectFit: "cover" }}
          className={styles.cardImage}
        />
        <div className={styles.gradientOverlay}></div>
        <div className={styles.content}>
          <h3 className={styles.cityName}>{name}</h3>
          <p className={styles.cityDescription}>{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default CityCard
