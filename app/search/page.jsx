// app/search/page.jsx
import EventCardLarge from "@/components/EventCardLarge/EventCardLarge"
import styles from "./page.module.css"

async function fetchSearchResults(query) {
  if (!query) {
    return []
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const response = await fetch(
      `${baseUrl}/api/search?q=${encodeURIComponent(query)}`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => "Could not parse error response.")
      return []
    }

    const responsePayload = await response.json()

    if (Array.isArray(responsePayload)) {
      return responsePayload
    } else if (responsePayload && Array.isArray(responsePayload.data)) {
      return responsePayload.data
    } else if (responsePayload && Array.isArray(responsePayload.results)) {
      return responsePayload.results
    } else {
      return []
    }
  } catch (error) {
    return []
  }
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.q || ""
  const results = await fetchSearchResults(query)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Search Results for: <span className={styles.queryText}>{query}</span>
      </h1>

      {results && results.length > 0 ? (
        <div className={styles.grid}>
          {results.map((event) => (
            <EventCardLarge key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className={styles.message}>
          {query
            ? "No events found matching your search criteria."
            : "Please enter a search term to find events."}
        </p>
      )}
    </div>
  )
}
