// components/EventCardLarge/EventCardLarge.jsx
import React from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./EventCardLarge.module.css"

const EventCardLarge = ({ event }) => {
  const {
    id = "",
    title = "Event Title",
    description = "Event description goes here.",
    date = "",
    timeDetails = "",
    locationName = "",
    locationAddress = "",
    imageUrl = "/images/events/placeholder-16-9.jpg",
    categoryName = "Category",
    cityName = "City",
    primaryCtaText = "Details",
    primaryCtaLink = "#",
    secondaryCtaText = "",
    secondaryCtaLink = "#",
    slug = "",
  } = event || {}

  const eventSlug =
    slug ||
    (title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
      : id)

  const eventLink = `/events/${eventSlug}`

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Date TBC"

  const displayLocation = locationName || locationAddress || "Location TBC"

  return (
    <Link href={eventLink} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className={styles.cardImage}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.metaTop}>
            <span className={styles.category}>{categoryName}</span>
            <span className={styles.date}>{formattedDate}</span>

            <p className={styles.location}>
              {displayLocation}
              {cityName && displayLocation !== "Location TBC"
                ? `, ${cityName}`
                : cityName || ""}
            </p>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default EventCardLarge
