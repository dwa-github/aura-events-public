// /app/api/categories/route.js
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
    const result = await query("SELECT * FROM categories ORDER BY name ASC")
    const categories = result.rows.map(transformRow)

    return NextResponse.json(categories)
  } catch (error) {
    console.error("API Error fetching categories:", error)
    return NextResponse.json(
      { message: "Failed to fetch categories", error: error.message },
      { status: 500 }
    )
  }
}
