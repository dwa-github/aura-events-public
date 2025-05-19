// components/PopularCitiesSection/PopularCitiesSection.jsx
import React from "react"
import CityCard from "@/components/CityCard/CityCard"
import styles from "./PopularCitiesSection.module.css"

const PopularCitiesSection = ({ cities = [] }) => {
  const validCities = cities.filter((city) => {
    const isValid = city && city.id && city.name && city.imageurl
    return isValid
  })

  if (!validCities || validCities.length === 0) {
    return null
  }

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.sectionTitle}>Popular Cities</h2>
        <div className={styles.cardsContainer}>
          {validCities.map((city) => (
            <div key={city.id} className={styles.cardWrapper}>
              <CityCard city={city} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularCitiesSection
