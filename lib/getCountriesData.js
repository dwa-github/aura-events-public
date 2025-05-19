// lib/getCountriesData.js
import { query } from "./db"
import { transformRows } from "./utils"

export async function getCountriesData() {
  try {
    const countriesRes = await query(
      "SELECT * FROM countries ORDER BY name ASC"
    )
    const countries = transformRows(countriesRes.rows)
    return {
      countries,
      error: null,
    }
  } catch (error) {
    console.error(
      "[getCountriesData] Error fetching countries data:",
      error.message
    )
    return {
      countries: [],
      error: "Failed to load countries data. " + error.message,
    }
  }
}
