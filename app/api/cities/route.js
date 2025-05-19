// /app/api/cities/route.js
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
const transformRows = (rows) => rows.map(transformRow)

export async function GET(request) {
  try {
    const result = await query(
      `SELECT * FROM cities
       ORDER BY name ASC`
    )

    const cities = transformRows(result.rows)

    return NextResponse.json(cities)
  } catch (error) {
    console.error("API Error fetching cities:", error)
    return NextResponse.json(
      { message: "Failed to fetch cities", error: error.message },
      { status: 500 }
    )
  }
}
