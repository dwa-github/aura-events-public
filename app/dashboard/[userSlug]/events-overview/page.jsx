// app/dashboard/[userSlug]/events-overview/page.jsx
import { notFound } from "next/navigation"
import { getUserDashboardData } from "@/lib/getUserDashboardData"
import { loadEventsData } from "@/lib/loadEventsData"
import EventCardLarge from "@/components/EventCardLarge/EventCardLarge"
import styles from "@/app/events/page.module.css"
import dashboardStyles from "../page.module.css"

export async function generateMetadata({ params }) {
  const { userSlug } = params
  const {
    events: allEnrichedEvents,
    users: allUsers,
    categories: allCategories,
    cities: allCities,
  } = await loadEventsData()

  const { user } = await getUserDashboardData(
    userSlug,
    allEnrichedEvents,
    allUsers,
    allCategories,
    allCities
  )

  if (!user) {
    return {
      title: "User Not Found",
    }
  }
  return {
    title: `Events by ${user.name}`,
    description: `Browse all events organized by ${user.name}.`,
  }
}

export default async function UserEventsOverviewPage({ params }) {
  const { userSlug } = params

  const {
    events: allEnrichedEvents,
    users: allUsers,
    categories: allCategories,
    cities: allCities,
    error: loadBaseDataError,
  } = await loadEventsData()

  if (loadBaseDataError) {
    return (
      <div className={dashboardStyles.dashboardContainer}>
        <p className={dashboardStyles.errorMessage}>
          Could not load event data.
        </p>
      </div>
    )
  }

  const {
    user,
    events: userOrganizedEvents,
    error: userDashboardError,
  } = await getUserDashboardData(
    userSlug,
    allEnrichedEvents,
    allUsers,
    allCategories,
    allCities
  )

  if (userDashboardError || !user) {
    notFound()
  }

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <h1 className={styles.title}>{`Events by ${user.name}`}</h1>{" "}
      {userOrganizedEvents && userOrganizedEvents.length > 0 ? (
        <div className={styles.grid}>
          {" "}
          {userOrganizedEvents.map((event) => (
            <EventCardLarge key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className={dashboardStyles.errorMessage}>
          No events found for {user.name}.
        </p>
      )}
    </div>
  )
}
