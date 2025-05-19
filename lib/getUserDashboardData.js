// lib/getUserDashboardData.js
import { query } from "./db"
import { transformRow, transformRows } from "./utils"

export async function getUserDashboardData(userSlug) {
  const baseEventQueryFields = `
    e.*,
    cat.name AS category_name, cat.slug AS category_slug,
    ci.name AS city_name, ci.slug AS city_slug,
    u_org.name AS user_name, u_org.slug AS user_slug 
  `
  const baseEventQueryJoins = `
    FROM events e
    LEFT JOIN categories cat ON e.category_id = cat.id
    LEFT JOIN cities ci ON e.city_id = ci.id
    LEFT JOIN users u_org ON e.organizer_user_id = u_org.id
  `

  if (!userSlug || typeof userSlug !== "string") {
    console.error(
      "[getUserDashboardData] Invalid or missing userSlug:",
      userSlug
    )
    return {
      user: null,
      events: [],
      teamEvents: [],
      categories: [],
      cities: [],
      error: "Invalid user identifier provided.",
    }
  }

  try {
    const currentUserRes = await query("SELECT * FROM users WHERE slug = $1", [
      userSlug,
    ])
    const currentUser = transformRow(currentUserRes.rows[0])

    if (!currentUser) {
      console.warn("[getUserDashboardData] User not found for slug:", userSlug)
      return {
        user: null,
        events: [],
        teamEvents: [],
        categories: [],
        cities: [],
        error: "User not found.",
      }
    }

    const [userEventsRes, teamEventsRes, categoriesRes, citiesRes] =
      await Promise.all([
        query(
          `SELECT ${baseEventQueryFields} ${baseEventQueryJoins} WHERE e.organizer_user_id = $1 ORDER BY e.date DESC`,
          [currentUser.id]
        ),
        query(
          `SELECT ${baseEventQueryFields} ${baseEventQueryJoins} WHERE e.organizer_user_id != $1 ORDER BY e.date DESC`,
          [currentUser.id]
        ),
        query("SELECT * FROM categories ORDER BY name ASC"),
        query("SELECT * FROM cities ORDER BY name ASC"),
      ])

    const userEvents = transformRows(userEventsRes.rows)
    const teamEvents = transformRows(teamEventsRes.rows)
    const categories = transformRows(categoriesRes.rows)
    const cities = transformRows(citiesRes.rows)

    return {
      user: currentUser,
      events: userEvents,
      teamEvents: teamEvents,
      categories: categories,
      cities: cities,
      error: null,
    }
  } catch (error) {
    console.error(
      `[getUserDashboardData] Error fetching dashboard data for userSlug ${userSlug}:`,
      error
    )
    return {
      user: null,
      events: [],
      teamEvents: [],
      categories: [],
      cities: [],
      error: "Failed to load dashboard data.",
    }
  }
}
