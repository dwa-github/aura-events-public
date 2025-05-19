// lib/getCitiesData.js
import { query } from "./db"
import { transformRows } from "./utils"

export async function getCitiesData() {
  try {
    const citiesRes = await query(
      "SELECT id, name, slug, image_url FROM cities ORDER BY name ASC"
    )
    const cities = transformRows(citiesRes.rows)
    return {
      cities,
      error: null,
    }
  } catch (error) {
    console.error("[getCitiesData] Error fetching cities data:", error.message)
    return {
      cities: [],
      error: "Failed to load cities data. " + error.message,
    }
  }
}
