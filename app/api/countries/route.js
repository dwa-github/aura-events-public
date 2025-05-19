// app/api/countries/route.js
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
    const result = await query("SELECT * FROM countries ORDER BY name ASC")
    const countries = result.rows.map(transformRow)

    return NextResponse.json(countries)
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch countries", error: error.message },
      { status: 500 }
    )
  }
}
