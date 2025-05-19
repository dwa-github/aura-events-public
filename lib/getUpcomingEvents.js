// lib/getUpcomingEvents.js
import { query } from "./db"
import { transformRows } from "./utils"

export async function getUpcomingEvents(limit = 6) {
  try {
    const eventsRes = await query(
      `SELECT
         e.*,
         cat.name AS category_name,
         cat.slug AS category_slug,
         ci.name AS city_name,
         ci.slug AS city_slug,
         u.name AS user_name,
         u.slug AS user_slug
       FROM events e
       LEFT JOIN categories cat ON e.category_id = cat.id
       LEFT JOIN cities ci ON e.city_id = ci.id
       LEFT JOIN users u ON e.organizer_user_id = u.id
       WHERE e.date >= CURRENT_TIMESTAMP
       ORDER BY e.date ASC, e.id ASC
       LIMIT $1`,
      [limit]
    )

    const upcomingEvents = transformRows(eventsRes.rows).map((event) => ({
      ...event,
      userName: event.userName || null,
      categoryName: event.categoryName || null,
      cityName: event.cityName || null,
      categorySlug: event.categorySlug || null,
      citySlug: event.citySlug || null,
      userSlug: event.userSlug || null,
    }))

    return upcomingEvents
  } catch (error) {
    console.error("Error fetching upcoming events from database:", error)
    return []
  }
}
