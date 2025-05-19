// lib/getCityData.js
import { query } from "./db"
import { transformRow, transformRows } from "./utils"

export async function getCityData(citySlug) {
  if (!citySlug) {
    console.warn("[getCityData] City slug is missing.")
    return null
  }

  try {
    const cityRes = await query("SELECT * FROM cities WHERE slug = $1", [
      citySlug,
    ])
    const city = transformRow(cityRes.rows[0])

    if (!city) {
      return null
    }

    const eventsRes = await query(
      `SELECT
         e.*,
         cat.name AS category_name,
         cat.slug AS category_slug,
         u.name AS user_name,
         u.slug AS user_slug
       FROM events e
       LEFT JOIN categories cat ON e.category_id = cat.id
       LEFT JOIN users u ON e.organizer_user_id = u.id
       WHERE e.city_id = $1
       ORDER BY e.date ASC`,
      [city.id]
    )
    const events = transformRows(eventsRes.rows)

    return { city, events }
  } catch (error) {
    console.error(
      `[getCityData] Error fetching data for city slug ${citySlug}:`,
      error
    )
    return null
  }
}
