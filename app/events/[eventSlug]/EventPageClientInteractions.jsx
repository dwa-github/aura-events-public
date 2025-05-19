// app/events/[eventSlug]/EventPageClientInteractions.jsx
"use client"
import { useState, useContext } from "react"
import Link from "next/link"
import styles from "./page.module.css"
import HeroBanner from "@/components/HeroBanner/HeroBanner"
import {
  Share2,
  CalendarPlus,
  Navigation,
  MapPin,
  Tag,
  UserCircle,
  Clock,
  Users,
} from "lucide-react"
import EventActions from "@/components/EventActions/EventActions"
import EventBooking from "@/components/EventBooking/EventBooking"
import OrganizerTools from "@/components/EventManagement/OrganizerTools"
import UserContext from "@/context/UserContext"

export default function EventPageClientInteractions({
  event,
  eventForActions,
  detailsSectionId,
}) {
  const { currentUser } = useContext(UserContext)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [userBookedTicketsThisSession, setUserBookedTicketsThisSession] =
    useState(0)

  const handleOpenBookingModal = () => {
    if (userBookedTicketsThisSession > 0) return
    setIsBookingModalOpen(true)
  }
  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false)
  }

  const handleSuccessfulBooking = (quantityBooked) => {
    setUserBookedTicketsThisSession((prev) => prev + quantityBooked)
  }

  const {
    description,
    fullDescription,
    imageUrl,
    date,
    bulletPoint_1,
    bulletPoint_2,
    bulletPoint_3,
    timeDetails,
    locationName,
    locationAddress,
    cityName,
    countrySlug,
    citySlug,
    countryName,
    categorySlug,
    organizerName,
    capacity,
    attendees,
    cityId,
    categoryId,
    primaryCtaText,
    primaryCtaLink,
    isOnline,
  } = event
  const categoryNameForSidebar = event.categoryName

  if (!event) {
    return <div>Error: Event data not provided.</div>
  }

  const initialAttendeesCount = attendees?.length || 0
  const currentTotalBooked =
    initialAttendeesCount + userBookedTicketsThisSession
  const availableTicketsForUserToBook = capacity - currentTotalBooked

  let heroCtaProps = {
    text: "Book Tickets",
    onClick: handleOpenBookingModal,
    url: undefined,
    disabled: false,
  }

  if (userBookedTicketsThisSession > 0) {
    heroCtaProps.text = "Booked!"
    heroCtaProps.onClick = undefined
    heroCtaProps.disabled = true
  } else if (availableTicketsForUserToBook <= 0 && capacity > 0) {
    heroCtaProps.text = "Sold Out"
    heroCtaProps.onClick = undefined
    heroCtaProps.disabled = true
  } else {
  }
  const displayLocationForBanner =
    locationName || locationAddress || "Location TBC"

  return (
    <>
      <HeroBanner
        event={{
          ...event,
          name: event.name || event.title,
          shortDescription: description,

          date: event.date
            ? new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Date TBC",
          time: event.timeDetails || "Time TBC",
          secondaryCtaText: "View Program",
          secondaryCtaLink: `#${detailsSectionId}`,
        }}
        ctaButton={heroCtaProps}
      />

      <section id={detailsSectionId} className={styles.detailsSection}>
        <div className={styles.detailsContentWrapper}>
          <div className={`${styles.mainContent} ${styles.mainContentCard}`}>
            <h2 className={styles.sectionTitle}>About this Event</h2>
            <div
              className={styles.fullDescription}
              dangerouslySetInnerHTML={{ __html: fullDescription || "" }}
            />
            {(bulletPoint_1 || bulletPoint_2 || bulletPoint_3) && (
              <div className={styles.bulletPointsSection}>
                <h3 className={styles.subSectionTitle}>Highlights</h3>
                <ul className={styles.bulletList}>
                  {bulletPoint_1 && <li>{bulletPoint_1}</li>}
                  {bulletPoint_2 && <li>{bulletPoint_2}</li>}
                  {bulletPoint_3 && <li>{bulletPoint_3}</li>}
                </ul>
              </div>
            )}
          </div>
          <aside className={`${styles.sidebarContent} ${styles.sidebarCard}`}>
            <h3 className={styles.sidebarTitle}>Event Details</h3>
            <div className={styles.eventMeta}>
              {countryName && (
                <p>
                  <strong>Country:</strong>{" "}
                  {countrySlug ? (
                    <Link href={`/events/countries/${countrySlug}`}>
                      {countryName}
                    </Link>
                  ) : (
                    countryName
                  )}
                </p>
              )}
              {cityName && (
                <p>
                  <strong>City:</strong>{" "}
                  <Link href={`/events/cities/${citySlug || cityId}`}>
                    {cityName}
                  </Link>
                </p>
              )}
              {displayLocationForBanner &&
                displayLocationForBanner !== "Location TBC" && (
                  <p>
                    <strong>Venue:</strong>{" "}
                    {event.locationId ? (
                      <Link href={`/events/locations/${event.locationId}`}>
                        {displayLocationForBanner}
                      </Link>
                    ) : (
                      displayLocationForBanner
                    )}
                  </p>
                )}
              {categoryNameForSidebar && (
                <p>
                  <strong>Category:</strong>{" "}
                  <Link
                    href={`/events/categories/${categorySlug || categoryId}`}
                  >
                    {categoryNameForSidebar}
                  </Link>
                </p>
              )}
              {event.userName && (
                <p>
                  <strong>Organizer:</strong> {event.userName}
                </p>
              )}
              <p>
                <strong>Date:</strong>{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </p>
              <p>
                <strong>Time:</strong> {timeDetails || "Not specified"}
              </p>
              {typeof capacity === "number" && (
                <>
                  <p>
                    <strong>Capacity:</strong> {capacity}
                  </p>
                  <p>
                    <strong>Booked:</strong> {currentTotalBooked}
                  </p>
                </>
              )}
            </div>
            <div className={styles.interactiveElementsContainer}>
              <EventActions event={eventForActions} />
              {displayLocationForBanner &&
                displayLocationForBanner !== "Location TBC" &&
                cityName &&
                !isOnline && (
                  <Link
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      (locationAddress || locationName) + ", " + cityName
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.iconButton} ${styles.routeButton}`}
                    title="Get Directions"
                  >
                    <Navigation size={20} aria-hidden="true" />
                    <span>Route</span>
                  </Link>
                )}
            </div>
          </aside>
        </div>
      </section>
      <EventBooking
        event={event}
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onBookingSuccess={handleSuccessfulBooking}
        availableTicketsForUser={availableTicketsForUserToBook}
      />
      <OrganizerTools event={event} currentUser={currentUser} />
    </>
  )
}
