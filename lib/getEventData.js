// lib/getEventData.js
import { query } from "./db"
import { transformRow, transformRows } from "./utils"

export async function getEventData(eventIdentifier) {
  if (!eventIdentifier) {
    console.warn("[getEventData] eventIdentifier is missing.")
    return null
  }

  try {
    const eventQuery = `
      SELECT
          e.*,
          cat.name AS category_name,
          cat.slug AS category_slug,
          ci.name AS city_name,
          ci.slug AS city_slug,
          co.name AS country_name, co.slug AS country_slug,
          loc.name AS location_name,
          loc.address AS location_address,
          u.name AS user_name,
          u.slug AS user_slug
      FROM
          events e
      LEFT JOIN categories cat ON e.category_id = cat.id
      LEFT JOIN cities ci ON e.city_id = ci.id
      LEFT JOIN locations loc ON e.location_id = loc.id -- Join with locations table
      LEFT JOIN users u ON e.organizer_user_id = u.id
      LEFT JOIN countries co ON ci.country_id = co.id 
      WHERE e.slug = $1 OR e.id = $1;
    `

    const { rows } = await query(eventQuery, [eventIdentifier])
    const event = transformRow(rows[0])

    if (!event) {
      return null
    }

    const eventArtistsRes = await query(
      `SELECT a.* 
       FROM artists a
       JOIN event_artists ea ON a.id = ea.artist_id
       WHERE ea.event_id = $1
       ORDER BY a.name ASC`,
      [event.id]
    )
    event.artists = transformRows(eventArtistsRes.rows)

    return event
  } catch (error) {
    console.error(
      `[getEventData] Error fetching event for identifier ${eventIdentifier}:`,
      error
    )
    return null
  }
}
