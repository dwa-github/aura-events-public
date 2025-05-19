// lib/getLocationDetailData.js
import { query } from "./db"
import { transformRow, transformRows } from "./utils"

export async function getLocationDetailData(locationId) {
  if (!locationId) {
    console.error("[getLocationDetailData] Location ID is required.")
    return { location: null, events: [], error: "Location ID is required." }
  }

  try {
    const locationRes = await query("SELECT * FROM locations WHERE id = $1", [
      locationId,
    ])

    if (locationRes.rows.length === 0) {
      return { location: null, events: [], error: "Location not found." }
    }
    const location = transformRow(locationRes.rows[0])

    const eventsQuery = `
      SELECT
        e.*,
        cat.name AS category_name, cat.slug AS category_slug,
        ci.name AS city_name, ci.slug AS city_slug,
        co.name AS country_name, co.slug AS country_slug,
        u.name AS user_name, u.slug AS user_slug, u.avatar_url AS user_avatar_url
      FROM events e
      LEFT JOIN categories cat ON e.category_id = cat.id
      LEFT JOIN cities ci ON e.city_id = ci.id
      LEFT JOIN countries co ON ci.country_id = co.id
      LEFT JOIN users u ON e.organizer_user_id = u.id
      WHERE e.location_id = $1
      ORDER BY e.date ASC, e.id ASC;
    `

    const eventsRes = await query(eventsQuery, [location.id])
    let locationEvents = transformRows(eventsRes.rows)

    for (let event of locationEvents) {
      const eventArtistsRes = await query(
        `SELECT a.*
         FROM artists a
         JOIN event_artists ea ON a.id = ea.artist_id
         WHERE ea.event_id = $1
         ORDER BY a.name ASC`,
        [event.id]
      )
      event.artists = transformRows(eventArtistsRes.rows)
      event.locationName = location.name
      event.locationAddress = location.address
      event.locationId = location.id
    }

    return {
      location,
      events: locationEvents,
      error: null,
    }
  } catch (error) {
    console.error(
      `[getLocationDetailData] Error fetching data for location ID "${locationId}":`,
      error.message
    )
    return {
      location: null,
      events: [],
      error:
        `Failed to load data for location "${locationId}". ` + error.message,
    }
  }
}
