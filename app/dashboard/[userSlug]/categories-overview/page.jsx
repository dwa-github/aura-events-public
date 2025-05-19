// app/dashboard/[userSlug]/categories-overview/page.jsx
import { notFound } from "next/navigation"
import { getUserDashboardData } from "@/lib/getUserDashboardData"
import { loadEventsData } from "@/lib/loadEventsData"
import CategoryCard from "@/components/CategoryCard/CategoryCard"
import styles from "@/app/events/categories/page.module.css"
import dashboardStyles from "../page.module.css"

export async function generateMetadata({ params }) {
  const { userSlug } = params
  const {
    events: allEnrichedEvents,
    users: allUsers,
    categories: allCategoriesData,
    cities: allCities,
  } = await loadEventsData()

  const { user } = await getUserDashboardData(
    userSlug,
    allEnrichedEvents,
    allUsers,
    allCategoriesData,
    allCities
  )

  if (!user) {
    return {
      title: "User Not Found",
    }
  }
  return {
    title: `Categories Featured by ${user.name}`,
    description: `Browse categories featured in events by ${user.name}.`,
  }
}

export default async function UserCategoriesOverviewPage({ params }) {
  const { userSlug } = params

  const {
    events: allEnrichedEvents,
    users: allUsers,
    categories: allCategoriesData,
    cities: allCities,
    error: loadBaseDataError,
  } = await loadEventsData()

  if (loadBaseDataError) {
    return (
      <div className={dashboardStyles.dashboardContainer}>
        <p className={dashboardStyles.errorMessage}>
          Could not load category data.
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
    allCategoriesData,
    allCities
  )

  if (userDashboardError || !user) {
    notFound()
  }

  const userCategoryIds = new Set(
    userOrganizedEvents.map((event) => event.categoryId)
  )

  const userFeaturedCategories = allCategoriesData.filter((category) =>
    userCategoryIds.has(category.id)
  )

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <h1 className={styles.title}>{`Categories Featured by ${user.name}`}</h1>
      {userFeaturedCategories && userFeaturedCategories.length > 0 ? (
        <div className={styles.grid}>
          {" "}
          {userFeaturedCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <p className={dashboardStyles.errorMessage}>
          No specific categories featured in events by {user.name}.
        </p>
      )}
    </div>
  )
}
