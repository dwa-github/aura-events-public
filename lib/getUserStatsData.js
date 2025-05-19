// lib/getUserStatsData.js
export async function getUserStatsData(
  userId,
  userSpecificEvents,
  allCategories,
  allCities
) {
  if (!userId) {
    return {
      eventCount: 0,
      categoryCount: 0,
      cityCount: 0,
      error: "User ID not provided.",
    }
  }
  if (!Array.isArray(userSpecificEvents)) {
    return {
      eventCount: 0,
      categoryCount: 0,
      cityCount: 0,
      error: "User events data is invalid.",
    }
  }
  try {
    const eventCount = userSpecificEvents.length

    const uniqueCategoryIds = new Set(
      userSpecificEvents.map((event) => event.categoryId)
    )
    const categoryCount = uniqueCategoryIds.size

    const uniqueCityIds = new Set(
      userSpecificEvents.map((event) => event.cityId)
    )
    const cityCount = uniqueCityIds.size

    return { eventCount, categoryCount, cityCount, error: null }
  } catch (error) {
    return {
      eventCount: 0,
      categoryCount: 0,
      cityCount: 0,
      error: error.message,
    }
  }
}
