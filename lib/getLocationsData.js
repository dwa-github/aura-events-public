// lib/getLocationsData.js
import { query } from "./db"
import { transformRows } from "./utils"

export async function getLocationsData() {
  try {
    const locationsRes = await query(
      `
      SELECT l.*, c.name as city_name
      FROM locations l
      LEFT JOIN cities c ON l.city_id = c.id
      ORDER BY l.name ASC
    `
    )
    const locations = transformRows(locationsRes.rows)
    return {
      locations,
      error: null,
    }
  } catch (error) {
    console.error(
      "[getLocationsData] Error fetching locations data:",
      error.message
    )
    return {
      locations: [],
      error: "Failed to load locations data. " + error.message,
    }
  }
}
