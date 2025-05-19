// lib/getEnrichedEventsForTable.js
import { loadEventsData } from "./loadEventsData"

export async function getEnrichedEventsForTable() {
  try {
    const allData = await loadEventsData()

    if (
      !allData ||
      !Array.isArray(allData.events) ||
      allData.events.length === 0
    ) {
      console.error(
        "[getEnrichedEventsForTable] Failed to load data or no events found."
      )
      return []
    }
    return allData.events
  } catch (error) {
    console.error(
      "[getEnrichedEventsForTable] Error fetching or processing events:",
      error
    )
    return []
  }
}
