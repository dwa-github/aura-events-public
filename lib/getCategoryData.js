// lib/getCategoryData.js
import { query } from "./db"
import { transformRow, transformRows } from "./utils" // Import from utils.js

export async function getCategoryData(slug) {
  if (!slug) {
    console.warn("[getCategoryData] Category slug is missing.")
    return null
  }

  try {
    const categoryRes = await query(
      "SELECT * FROM categories WHERE slug = $1",
      [slug]
    )
    const category = transformRow(categoryRes.rows[0])

    if (!category) {
      return null
    }

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
       WHERE e.category_id = $1
       ORDER BY e.date ASC`,
      [category.id]
    )
    const events = transformRows(eventsRes.rows)

    return { category, events }
  } catch (error) {
    console.error(
      `[getCategoryData] Error fetching data for category slug ${slug}:`,
      error
    )
    return null
  }
}
