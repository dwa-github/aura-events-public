// app/api/events/route.js
import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import crypto from "crypto"

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

const EVENTS_PER_PAGE = 9

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(
    searchParams.get("limit") || EVENTS_PER_PAGE.toString(),
    10
  )

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return NextResponse.json(
      { message: "Invalid page or limit parameter." },
      { status: 400 }
    )
  }

  const offset = (page - 1) * limit

  try {
    const eventsRes = await query(
      `SELECT
         e.*,
         cat.name AS category_name, cat.slug AS category_slug,
         ci.name AS city_name, ci.slug AS city_slug,
         u.name AS user_name, u.slug AS user_slug
       FROM events e
       LEFT JOIN categories cat ON e.category_id = cat.id
       LEFT JOIN cities ci ON e.city_id = ci.id
       LEFT JOIN users u ON e.organizer_user_id = u.id
       ORDER BY e.date DESC, e.id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    const totalEventsRes = await query("SELECT COUNT(*) FROM events")
    const totalEvents = parseInt(totalEventsRes.rows[0].count, 10)

    const events = transformRows(eventsRes.rows)
    const hasMore = offset + events.length < totalEvents

    return NextResponse.json({
      events,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch events", error: error.message },
      { status: 500 }
    )
  }
}

const MAX_TITLE_LENGTH = 100

function validateEventData(data) {
  const requiredFields = [
    "title",
    "date",
    "categoryId",
    "cityId",
    "organizerUserId",
    "capacity",
  ]

  if (data.title && data.title.length > MAX_TITLE_LENGTH) {
    return `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`
  }

  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      if (field === "capacity" && data[field] === 0) {
      } else {
        return `Missing required field: ${field}`
      }
    }
  }
  if (isNaN(parseInt(data.capacity, 10))) {
    return "Invalid capacity value."
  }
  return null
}

export async function POST(request) {
  try {
    const eventData = await request.json()
    const eventId = eventData.id || crypto.randomUUID()

    const validationError = validateEventData(eventData)
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 })
    }

    const titleCheckResult = await query(
      "SELECT id FROM events WHERE title = $1",
      [eventData.title]
    )
    if (titleCheckResult.rows.length > 0) {
      return NextResponse.json(
        { message: "An event with this title already exists." },
        { status: 409 }
      )
    }

    const title = eventData.title
    const slug =
      eventData.slug ||
      title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim() +
        "-" +
        Date.now()
    const description = eventData.description || ""
    const fullDescription = eventData.fullDescription || ""
    const date = new Date(eventData.date).toISOString()
    const timeDetails = eventData.timeDetails || ""
    const location = eventData.location || ""
    const imageUrl = eventData.imageUrl || "/images/events/default-event.jpg"
    const capacity = parseInt(eventData.capacity, 10)
    const categoryId = eventData.categoryId
    const cityId = eventData.cityId
    const organizerUserId = eventData.organizerUserId
    const primaryCtaText = eventData.primaryCtaText || "Details"
    const primaryCtaLink = eventData.primaryCtaLink || "#"
    const secondaryCtaText = eventData.secondaryCtaText || ""
    const secondaryCtaLink = eventData.secondaryCtaLink || "#"
    const countryId = eventData.countryId
    const bulletPoint1 = eventData.bulletPoint1 || ""
    const bulletPoint2 = eventData.bulletPoint2 || ""
    const bulletPoint3 = eventData.bulletPoint3 || ""

    const result = await query(
      `INSERT INTO events (
        id, title, slug, description, full_description, date, time_details, location_id, image_url, capacity,
        category_id, city_id, country_id, organizer_user_id, primary_cta_text, primary_cta_link,
        secondary_cta_text, secondary_cta_link, bullet_point_1, bullet_point_2, bullet_point_3, simulated_attendee_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, 0)
      RETURNING *`,
      [
        eventId,
        title,
        slug,
        description,
        fullDescription,
        date,
        timeDetails,
        location,
        imageUrl,
        capacity,
        categoryId,
        cityId,
        countryId,
        organizerUserId,
        primaryCtaText,
        primaryCtaLink,
        secondaryCtaText,
        secondaryCtaLink,
        bulletPoint1,
        bulletPoint2,
        bulletPoint3,
      ]
    )

    const newEvent = transformRow(result.rows[0])
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    if (error.code === "23503") {
      return NextResponse.json(
        {
          message: "Invalid category, city, country, or user ID provided.",
          details: error.detail,
        },
        { status: 400 }
      )
    }
    if (error.code === "23505") {
      return NextResponse.json(
        {
          message: "An event with this slug or ID already exists.",
          details: error.detail,
        },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { message: "Failed to add event", error: error.message },
      { status: 500 }
    )
  }
}
