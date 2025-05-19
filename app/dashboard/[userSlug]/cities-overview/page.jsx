// app/dashboard/[userSlug]/cities-overview/page.jsx
import { notFound } from "next/navigation"
import { getUserDashboardData } from "@/lib/getUserDashboardData"
import { loadEventsData } from "@/lib/loadEventsData"
import CityCard from "@/components/CityCard/CityCard"
import styles from "@/app/events/cities/page.module.css"
import dashboardStyles from "../page.module.css"

export async function generateMetadata({ params }) {
  const { userSlug } = params
  const {
    events: allEnrichedEvents,
    users: allUsers,
    categories: allCategories,
    cities: allCitiesData,
  } = await loadEventsData()

  const { user } = await getUserDashboardData(
    userSlug,
    allEnrichedEvents,
    allUsers,
    allCategories,
    allCitiesData
  )

  if (!user) {
    return {
      title: "User Not Found",
    }
  }
  return {
    title: `Cities Featured by ${user.name}`,
    description: `Browse cities where events by ${user.name} are hosted.`,
  }
}

export default async function UserCitiesOverviewPage({ params }) {
  const { userSlug } = params

  const {
    events: allEnrichedEvents,
    users: allUsers,
    categories: allCategories,
    cities: allCitiesData,
    error: loadBaseDataError,
  } = await loadEventsData()

  if (loadBaseDataError) {
    return (
      <div className={dashboardStyles.dashboardContainer}>
        <p className={dashboardStyles.errorMessage}>
          Could not load city data.
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
    allCitiesData
  )

  if (userDashboardError || !user) {
    notFound()
  }

  const userCityIds = new Set(userOrganizedEvents.map((event) => event.cityId))

  const userFeaturedCities = allCitiesData.filter((city) =>
    userCityIds.has(city.id)
  )

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <h1 className={styles.title}>{`Cities Featured by ${user.name}`}</h1>{" "}
      {userFeaturedCities && userFeaturedCities.length > 0 ? (
        <div className={styles.grid}>
          {" "}
          {userFeaturedCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      ) : (
        <p className={dashboardStyles.errorMessage}>
          No specific cities featured in events by {user.name}.
        </p>
      )}
    </div>
  )
}
