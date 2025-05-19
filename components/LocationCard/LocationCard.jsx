// components/LocationCard/LocationCard.jsx
"use client"
import Link from "next/link"
import styles from "./LocationCard.module.css"

const LocationCard = ({ location }) => {
  if (!location || !location.id) {
    return null
  }

  const {
    id,
    name = "Location Name",
    address = "Address not available",
    cityName = "City not available",
  } = location

  const locationUrl = `/events/locations/${id}`

  return (
    <Link href={locationUrl} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.content}>
          <h3 className={styles.locationName}>{name}</h3>
          {address && address !== "Address not available" && (
            <p className={styles.locationAddress}>{address}</p>
          )}
          {cityName && cityName !== "City not available" && (
            <p className={styles.locationCity}>City: {cityName}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default LocationCard
