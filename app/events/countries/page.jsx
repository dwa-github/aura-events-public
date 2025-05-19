// app/events/countries/page.jsx
import { Suspense } from "react"
import { getCountriesData } from "@/lib/getCountriesData"
import CountryCard from "@/components/CountryCard/CountryCard"
import styles from "./page.module.css"

export const metadata = {
  title: "Explore Event Countries | Aura Events",
  description:
    "Discover events happening in various countries around the world.",
}

async function CountriesList() {
  const { countries, error } = await getCountriesData()

  if (error) {
    return (
      <p className={styles.errorMessage}>Error loading countries: {error}</p>
    )
  }

  if (!countries || countries.length === 0) {
    return <p className={styles.noItemsMessage}>No countries found.</p>
  }

  return (
    <div className={styles.grid}>
      {" "}
      {countries.map((country) => (
        <CountryCard key={country.id} country={country} />
      ))}
    </div>
  )
}

export default function CountriesPage() {
  return (
    <div className={styles.container}>
      {" "}
      <h1 className={styles.title}>Explore Countries</h1>{" "}
      <Suspense
        fallback={<p className={styles.loadingMessage}>Loading countries...</p>}
      >
        <CountriesList />
      </Suspense>
    </div>
  )
}
