// /components/HeroBanner/HeroBanner.jsx
import React from "react"
import Image from "next/image"
import Button from "@/components/Button/Button"
import styles from "./HeroBanner.module.css"
import { CalendarDays, MapPin, Clock } from "lucide-react"

const HeroBanner = ({ event, ctaButton }) => {
  if (!event || !event.name || !event.imageUrl) {
    return null
  }

  const {
    name,
    shortDescription,
    imageUrl,
    imageAltText = `${event.name} banner image` || "Event banner image",
    tags,
    date: eventDate,
    time: eventTime,
    locationName: eventLocationName,
    locationAddress: eventLocationAddress,
    cityName: eventCityName,
    secondaryCtaLink,
    secondaryCtaText,
  } = event

  const primaryActionText = ctaButton?.text || "Book Tickets"
  const primaryActionUrl = ctaButton?.url
  const primaryActionOnClick = ctaButton?.onClick
  const isPrimaryActionDisabled = ctaButton?.disabled || false

  const displayLocation = eventLocationName || eventLocationAddress
  const displayDate =
    eventDate instanceof Date
      ? eventDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : typeof eventDate === "string"
      ? eventDate
      : "Date TBC"

  const displayTime = typeof eventTime === "string" ? eventTime : "Time TBC"

  return (
    <section className={styles.heroBannerContainerNewLayout}>
      <div className={styles.textContentBlock}>
        {tags && tags.length > 0 && (
          <div className={styles.heroEventTags}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tagItem}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className={styles.heroTitle}>{name}</h1>
        {shortDescription && (
          <p className={styles.heroDescription}>{shortDescription}</p>
        )}
        <div className={styles.heroEventMetaInline}>
          {displayDate && displayDate !== "Date TBC" && (
            <div className={styles.heroEventMetaItem}>
              <CalendarDays
                className={styles.heroEventMetaIcon}
                aria-hidden="true"
              />
              <span>{displayDate}</span>
            </div>
          )}
          {displayTime && displayTime !== "Time TBC" && (
            <div className={styles.heroEventMetaItem}>
              <Clock className={styles.heroEventMetaIcon} aria-hidden="true" />
              <span>{displayTime}</span>
            </div>
          )}
          {displayLocation && (
            <div className={styles.heroEventMetaItem}>
              <MapPin className={styles.heroEventMetaIcon} aria-hidden="true" />
              <span>
                {displayLocation}
                {eventCityName &&
                  displayLocation !== eventCityName &&
                  `, ${eventCityName}`}{" "}
              </span>
            </div>
          )}
        </div>
        <div className={styles.heroButtonContainer}>
          {primaryActionText && (
            <Button
              href={primaryActionUrl}
              onClick={primaryActionOnClick}
              variant="primary"
              target={primaryActionUrl ? "_blank" : undefined}
              rel={primaryActionUrl ? "noopener noreferrer" : undefined}
              disabled={isPrimaryActionDisabled}
            >
              {primaryActionText}
            </Button>
          )}
          {secondaryCtaLink && (
            <Button href={secondaryCtaLink} variant="secondary">
              {secondaryCtaText || "More Info"}
            </Button>
          )}
        </div>
      </div>
      <div className={styles.imageBlock}>
        <Image
          src={imageUrl}
          alt={imageAltText}
          fill
          priority
          sizes="(max-width: 768pary100vw, (max-width: 1200px) 80vw, 1200px"
          className={styles.heroImage}
        />
      </div>
    </section>
  )
}

export default HeroBanner
