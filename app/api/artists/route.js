// /app/api/artists/route.js
import { NextResponse } from "next/server"
import { query } from "@/lib/db"

const snakeToCamel = (str) =>
  str
    .toLowerCase()
    .replace(/([_][a-z])/g, (group) => group.toUpperCase().replace("_", ""))

const transformRow = (row) => {
  if (!row) return null
  const newRow = {}
  for (const key in row) {
    newRow[snakeToCamel(key)] = row[key]
  }
  return newRow
}

export async function GET(request) {
  try {
    const result = await query("SELECT * FROM artists ORDER BY name ASC")
    const artists = result.rows.map(transformRow)
    return NextResponse.json(artists)
  } catch (error) {
    console.error("API Error fetching artists:", error)
    return NextResponse.json(
      { message: "Failed to fetch artists", error: error.message },
      { status: 500 }
    )
  }
}
