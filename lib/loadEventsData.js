// lib/loadEventsData.js
import { query } from "./db"
import { transformRows, transformRow } from "./utils"

export async function loadEventsData() {
  try {
    const [
      countriesRes,
      categoriesRes,
      citiesRes,
      usersRes,
      locationsRes,
      artistsRes,
      allEventsInitialRes,
    ] = await Promise.all([
      query("SELECT * FROM countries ORDER BY name ASC"),
      query("SELECT * FROM categories ORDER BY name ASC"),
      query("SELECT * FROM cities ORDER BY name ASC"),
      query("SELECT * FROM users ORDER BY name ASC"),
      query("SELECT * FROM locations ORDER BY name ASC"),
      query("SELECT * FROM artists ORDER BY name ASC"),
      query(`
        SELECT
            e.*,
            cat.name AS category_name, cat.slug AS category_slug,
            ci.name AS city_name, ci.slug AS city_slug,
            u.name AS user_name, u.slug AS user_slug,
            loc.name AS location_name, loc.address AS location_address
        FROM events e
        LEFT JOIN categories cat ON e.category_id = cat.id
        LEFT JOIN cities ci ON e.city_id = ci.id
        LEFT JOIN users u ON e.organizer_user_id = u.id
        LEFT JOIN locations loc ON e.location_id = loc.id
        ORDER BY e.date DESC, e.id DESC
      `),
    ])

    const countries = transformRows(countriesRes.rows)
    const categories = transformRows(categoriesRes.rows)
    const cities = transformRows(citiesRes.rows)
    const users = transformRows(usersRes.rows)
    const locations = transformRows(locationsRes.rows)
    const allArtistsData = transformRows(artistsRes.rows)

    let allEvents = transformRows(allEventsInitialRes.rows)

    for (let event of allEvents) {
      const eventArtistsRes = await query(
        `SELECT a.* 
         FROM artists a
         JOIN event_artists ea ON a.id = ea.artist_id
         WHERE ea.event_id = $1
         ORDER BY a.name ASC`,
        [event.id]
      )
      event.artists = transformRows(eventArtistsRes.rows)

      if (event.cityId) {
        const city = cities.find((c) => c.id === event.cityId)
        if (city && city.countryId) {
          const country = countries.find((co) => co.id === city.countryId)
          if (country) {
            event.countryName = country.name
            event.countrySlug = country.slug
          }
        }
      }
    }

    const now = new Date()
    const upcomingEventsOnly = allEvents
      .filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= now
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    const pastEvents = allEvents
      .filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate < now
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    let featuredEvent = null
    if (upcomingEventsOnly.length > 0) {
      const randomIndex = Math.floor(Math.random() * upcomingEventsOnly.length)
      featuredEvent = upcomingEventsOnly[randomIndex]
    }

    return {
      countries: countries,
      categories: categories,
      cities: cities,
      users: users,
      locations: locations,
      artists: allArtistsData,
      events: allEvents,
      upcomingEvents: upcomingEventsOnly,
      pastEvents: pastEvents,
      featuredEvent: featuredEvent,
      error: null,
    }
  } catch (error) {
    console.error(
      "🚨 Error loading data from database in loadEventsData:",
      error
    )
    return {
      countries: [],
      categories: [],
      cities: [],
      users: [],
      locations: [],
      artists: [],
      events: [],
      upcomingEvents: [],
      pastEvents: [],
      featuredEvent: null,
      error: "Failed to load initial page data. " + error.message,
    }
  }
}
