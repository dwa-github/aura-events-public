// lib/getCountryDetailData.js
import { query } from "./db"
import { transformRow, transformRows } from "./utils"

export async function getCountryDetailData(countrySlug) {
  if (!countrySlug) {
    console.error("[getCountryDetailData] Country slug is required.")
    return { country: null, events: [], error: "Country slug is required." }
  }

  try {
    const countryRes = await query("SELECT * FROM countries WHERE slug = $1", [
      countrySlug,
    ])

    if (countryRes.rows.length === 0) {
      return { country: null, events: [], error: "Country not found." }
    }
    const country = transformRow(countryRes.rows[0])

    const eventsQuery = `
      SELECT
        e.*,
        cat.name AS category_name, cat.slug AS category_slug,
        ci.name AS city_name, ci.slug AS city_slug,
        loc.name AS location_name, loc.address AS location_address,
        u.name AS user_name, u.slug AS user_slug, u.avatar_url AS user_avatar_url
      FROM events e
      LEFT JOIN categories cat ON e.category_id = cat.id
      LEFT JOIN cities ci ON e.city_id = ci.id
      LEFT JOIN locations loc ON e.location_id = loc.id
      LEFT JOIN users u ON e.organizer_user_id = u.id
      WHERE ci.country_id = $1
      ORDER BY e.date ASC, e.id ASC;
    `

    const eventsRes = await query(eventsQuery, [country.id])
    let countryEvents = transformRows(eventsRes.rows)

    for (let event of countryEvents) {
      const eventArtistsRes = await query(
        `SELECT a.* 
         FROM artists a
         JOIN event_artists ea ON a.id = ea.artist_id
         WHERE ea.event_id = $1
         ORDER BY a.name ASC`,
        [event.id]
      )
      event.artists = transformRows(eventArtistsRes.rows)

      event.countryName = country.name
      event.countrySlug = country.slug
    }

    return {
      country,
      events: countryEvents,
      error: null,
    }
  } catch (error) {
    console.error(
      `[getCountryDetailData] Error fetching data for country slug "${countrySlug}":`,
      error.message
    )
    return {
      country: null,
      events: [],
      error:
        `Failed to load data for country "${countrySlug}". ` + error.message,
    }
  }
}
