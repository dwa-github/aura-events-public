// components/StatsSection/StatsSection.jsx
import Counter from "@/components/Counter/Counter"
import styles from "./StatsSection.module.css"

export default function StatsSection({ initialStats, sectionTitle, userSlug }) {
  const {
    eventCount = 0,
    categoryCount = 0,
    cityCount = 0,
  } = initialStats || {}

  const title = sectionTitle || "Platform Statistics"

  const eventDesc = sectionTitle?.toLowerCase().includes("your")
    ? "Total number of events you have created or organized."
    : "Total number of events currently listed on the site."
  const categoryDesc = sectionTitle?.toLowerCase().includes("your")
    ? "Unique categories featured in your events."
    : "Different types of events available for browsing."
  const cityDesc = sectionTitle?.toLowerCase().includes("your")
    ? "Unique cities where your events are hosted."
    : "Locations featured with active event listings."

  const eventsLink = userSlug
    ? `/dashboard/${userSlug}/events-overview`
    : "/events"

  const categoriesLink = userSlug
    ? `/dashboard/${userSlug}/categories-overview`
    : "/events/categories"

  const citiesLink = userSlug
    ? `/dashboard/${userSlug}/cities-overview`
    : "/events/cities"

  return (
    <div className={styles.statsContainer}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.statsGrid}>
        <Counter
          link={eventsLink}
          targetValue={eventCount}
          title="Events"
          description={eventDesc}
        />
        <Counter
          link={categoriesLink}
          targetValue={categoryCount}
          title="Categories"
          description={categoryDesc}
        />
        <Counter
          link={citiesLink}
          targetValue={cityCount}
          title="Cities"
          description={cityDesc}
        />
      </div>
    </div>
  )
}
