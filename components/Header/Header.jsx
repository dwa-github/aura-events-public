// components/Header/Header.jsx
"use client"

import Image from "next/image"
import styles from "./Header.module.css"
import Button from "@/components/Button/Button"
import Link from "next/link"
import { MdLocationOn, MdAccessTime, MdCalendarToday } from "react-icons/md"

const Header = ({
  event,
  primaryButtonText = "Book Ticket",
  onPrimaryButtonClick,
  primaryButtonHref,
  isPrimaryButtonDisabled = false,
}) => {
  if (!event) {
    console.error("Event data is missing in Header component")
    return null
  }

  const {
    title,
    description,
    date,
    timeDetails,
    locationName,
    locationAddress,
    imageUrl,
    slug,
    id,
  } = event

  let formattedDate = ""
  if (date) {
    const dateObj = new Date(date)
    if (!isNaN(dateObj.getTime())) {
      try {
        formattedDate = dateObj.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      } catch (e) {
        console.error("Error formatting date with toLocaleDateString:", e)
        formattedDate = date
      }
    } else {
      formattedDate = date
    }
  }

  const eventPageLink = slug || id ? `/events/${slug || id}` : null
  const fixedSecondaryCtaText = "More Info"
  const displayLocation = locationName || locationAddress
  return (
    <header className={styles.headerContainer}>
      <div className={styles.contentContainer}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {description && <p className={styles.description}>{description}</p>}

        {(formattedDate || timeDetails || displayLocation) && (
          <div className={styles.details}>
            {formattedDate && (
              <span className={styles.detailItem}>
                <MdCalendarToday className={styles.icon} aria-hidden="true" />
                {formattedDate}
              </span>
            )}
            {timeDetails && (
              <span className={styles.detailItem}>
                <MdAccessTime className={styles.icon} aria-hidden="true" />
                {timeDetails}
              </span>
            )}
            {displayLocation && (
              <span className={styles.detailItem}>
                <MdLocationOn className={styles.icon} aria-hidden="true" />
                {displayLocation}
              </span>
            )}
          </div>
        )}
        {(primaryButtonText || eventPageLink) && (
          <div className={styles.ctaButtons}>
            {primaryButtonText &&
              (onPrimaryButtonClick ? (
                <Button
                  variant="primary"
                  className={styles.ctaButton}
                  onClick={onPrimaryButtonClick}
                  disabled={isPrimaryButtonDisabled}
                >
                  {primaryButtonText}
                </Button>
              ) : primaryButtonHref ? (
                <Button
                  href={primaryButtonHref}
                  variant="primary"
                  className={styles.ctaButton}
                  disabled={isPrimaryButtonDisabled}
                >
                  {primaryButtonText}
                </Button>
              ) : null)}
            {eventPageLink && (
              <Button
                as={Link}
                href={eventPageLink}
                variant="secondary"
                className={styles.ctaButton}
              >
                {fixedSecondaryCtaText}
              </Button>
            )}
          </div>
        )}
      </div>

      {imageUrl && (
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={`${title || "Event"} banner`}
            width={1200}
            height={675}
            priority
            quality={80}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
            className={styles.eventImage}
          />
        </div>
      )}
    </header>
  )
}

export default Header
