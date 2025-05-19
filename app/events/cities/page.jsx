// app/events/cities/page.jsx
"use client"

import { useState, useEffect, useCallback } from "react"
import CityCard from "@/components/CityCard/CityCard"
import Button from "@/components/Button/Button"
import LoadingDots from "@/components/ui/LoadingDots/LoadingDots"
import globalLoaderStyles from "@/app/styles/GlobalLoader.module.css"
import styles from "./page.module.css"

const CITIES_PER_PAGE = 8

export default function AllCitiesPage() {
  const [cities, setCities] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  const fetchCities = useCallback(async (pageToFetch) => {
    if (pageToFetch > 1) {
      setIsLoading(true)
    }
    setError(null)

    try {
      const response = await fetch(
        `/api/cities?page=${pageToFetch}&limit=${CITIES_PER_PAGE}`
      )

      if (!response.ok) {
        let errorData = { message: `API error: ${response.status}` }
        try {
          errorData = await response.json()
        } catch (e) {
          errorData.message = response.statusText || errorData.message
        }

        throw new Error(
          errorData.message || `Failed to fetch cities: ${response.status}`
        )
      }

      const data = await response.json()

      const newCitiesData = Array.isArray(data) ? data : []
      const newHasMore = newCitiesData.length === CITIES_PER_PAGE
      const newCurrentPage = pageToFetch

      setCities((prevCities) =>
        pageToFetch === 1 ? newCitiesData : [...prevCities, ...newCitiesData]
      )
      setHasMore(newHasMore)
      setCurrentPage(newCurrentPage)
    } catch (err) {
      setError(err.message)
      if (pageToFetch === 1) {
        setCities([])
      }
    } finally {
      setIsLoading(false)
      if (pageToFetch === 1) {
        setInitialLoadComplete(true)
      }
    }
  }, [])

  useEffect(() => {
    fetchCities(1)
  }, [fetchCities])
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchCities(currentPage + 1)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Cities</h1>

      {isLoading && cities.length === 0 && (
        <div className={globalLoaderStyles.fullPageContainer}>
          <LoadingDots />
          <p>Loading cities...</p>
        </div>
      )}
      {error && <p className={styles.errorMessage}>Error: {error}</p>}

      {cities.length > 0 ? (
        <div className={styles.grid}>
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      ) : (
        initialLoadComplete && !isLoading && !error && <p>No cities found.</p>
      )}

      {initialLoadComplete && hasMore && !isLoading && (
        <div className={styles.loadMoreContainer}>
          <Button onClick={handleLoadMore} variant="primary">
            Load More Cities
          </Button>
        </div>
      )}
      {isLoading && cities.length > 0 && (
        <div
          className={globalLoaderStyles.fullPageContainer}
          style={{ minHeight: "100px", marginTop: "1rem" }}
        >
          <LoadingDots />
          <p>Loading more cities...</p>
        </div>
      )}
    </div>
  )
}
