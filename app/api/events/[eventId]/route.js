// app/api/events/[eventId]/route.js
import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { del as deleteFromBlob } from "@vercel/blob"
import crypto from "crypto"

const snakeToCamel = (str) =>
  str
    .toLowerCase()
    .replace(/([_][a-z])/g, (group) => group.toUpperCase().replace("_", ""))

const transformRow = (row) => {
  if (!row) return null
  const newRow = {}
  let databaseIdValue = undefined

  for (const key in row) {
    if (key.toLowerCase() === "id") {
      databaseIdValue = row[key]
    }
    newRow[snakeToCamel(key)] = row[key]
  }
  if (databaseIdValue !== undefined) {
    newRow.id = databaseIdValue
  }
  return newRow
}

export async function GET(request, context) {
  const { params } = context
  const { eventId } = params
  try {
    const UUID_REGEX =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    const isUuid = UUID_REGEX.test(eventId)

    let eventQuery
    let queryParams

    if (isUuid) {
      eventQuery = `
        SELECT e.*,
               cat.name AS category_name, cat.slug AS category_slug,
               ci.name AS city_name, ci.slug AS city_slug,
               l.name AS location_name, l.address AS location_address,
               co.name AS country_name, co.id AS country_iso_code,
               u.name AS user_name, u.slug AS user_slug
        FROM events e
        LEFT JOIN categories cat ON e.category_id = cat.id
        LEFT JOIN cities ci ON e.city_id = ci.id
        LEFT JOIN locations l ON e.location_id = l.id
        LEFT JOIN countries co ON e.country_id = co.id
        LEFT JOIN users u ON e.organizer_user_id = u.id
        WHERE e.id = $1
      `
      queryParams = [eventId]
    } else {
      eventQuery = `
        SELECT e.*,
               cat.name AS category_name, cat.slug AS category_slug,
               ci.name AS city_name, ci.slug AS city_slug,
               l.name AS location_name, l.address AS location_address,
               co.name AS country_name, co.id AS country_iso_code,
               u.name AS user_name, u.slug AS user_slug
        FROM events e
        LEFT JOIN categories cat ON e.category_id = cat.id
        LEFT JOIN cities ci ON e.city_id = ci.id
        LEFT JOIN locations l ON e.location_id = l.id
        LEFT JOIN countries co ON e.country_id = co.id
        LEFT JOIN users u ON e.organizer_user_id = u.id
        WHERE e.slug = $1
      `
      queryParams = [eventId]
    }

    const result = await query(eventQuery, queryParams)

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    const event = transformRow(result.rows[0])
    const response = NextResponse.json(event)
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    )
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    return response
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch event", error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request, context) {
  const { params } = context
  const { eventId } = params

  try {
    const eventResult = await query(
      "SELECT id, image_url, organizer_user_id FROM events WHERE id = $1",
      [eventId]
    )
    if (eventResult.rows.length === 0) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }
    const eventToDelete = eventResult.rows[0]

    await query("DELETE FROM event_artists WHERE event_id = $1", [eventId])

    const deleteResult = await query("DELETE FROM events WHERE id = $1", [
      eventId,
    ])

    if (deleteResult.rowCount === 0) {
      return NextResponse.json(
        { message: "Event not found during deletion attempt" },
        { status: 404 }
      )
    }

    if (
      eventToDelete.image_url &&
      eventToDelete.image_url.includes("blob.vercel-storage.com")
    ) {
      try {
        await deleteFromBlob(eventToDelete.image_url)
      } catch (blobError) {}
    }

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete event", error: error.message },
      { status: 500 }
    )
  }
}

const MAX_TITLE_LENGTH = 100

function validateEventUpdateData(data, existingEvent) {
  if (data.title && data.title.length > MAX_TITLE_LENGTH) {
    return `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`
  }
  if (data.capacity && isNaN(parseInt(data.capacity, 10))) {
    return "Invalid capacity value."
  }
  return null
}

export async function PUT(request, context) {
  const { params } = context
  const { eventId } = params

  try {
    const eventData = await request.json()

    const existingEventResult = await query(
      "SELECT * FROM events WHERE id = $1",
      [eventId]
    )
    if (existingEventResult.rows.length === 0) {
      return NextResponse.json(
        { message: "Event not found to update" },
        { status: 404 }
      )
    }
    const existingEvent = existingEventResult.rows[0]

    const validationError = validateEventUpdateData(eventData, existingEvent)
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 })
    }

    const updates = {}
    let newSlug = existingEvent.slug
    let titleChanged = false

    if (eventData.title && eventData.title !== existingEvent.title) {
      updates.title = eventData.title
      const titleCheckResult = await query(
        "SELECT id FROM events WHERE title = $1 AND id != $2",
        [updates.title, eventId]
      )
      if (titleCheckResult.rows.length > 0) {
        return NextResponse.json(
          { message: "An event with this title already exists." },
          { status: 409 }
        )
      }
      titleChanged = true
      newSlug =
        updates.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/--+/g, "-")
          .trim() +
        "-" +
        Date.now().toString().slice(-5)
      updates.slug = newSlug
    } else if (eventData.slug && eventData.slug !== existingEvent.slug) {
      const slugCheckResult = await query(
        "SELECT id FROM events WHERE slug = $1 AND id != $2",
        [eventData.slug, eventId]
      )
      if (slugCheckResult.rows.length > 0) {
        return NextResponse.json(
          { message: "An event with this slug already exists." },
          { status: 409 }
        )
      }
      updates.slug = eventData.slug
    }

    const fieldMappings = {
      description: "description",
      fullDescription: "full_description",
      date: "date",
      timeDetails: "time_details",
      locationId: "location_id",
      imageUrl: "image_url",
      capacity: "capacity",
      categoryId: "category_id",
      cityId: "city_id",
      countryId: "country_id",
      primaryCtaText: "primary_cta_text",
      primaryCtaLink: "primary_cta_link",
      secondaryCtaText: "secondary_cta_text",
      secondaryCtaLink: "secondary_cta_link",
      bulletPoint1: "bullet_point_1",
      bulletPoint2: "bullet_point_2",
      bulletPoint3: "bullet_point_3",
    }

    for (const clientKey in fieldMappings) {
      if (eventData[clientKey] !== undefined) {
        const dbKey = fieldMappings[clientKey]
        let value = eventData[clientKey]

        if (clientKey === "date" && value) {
          value = new Date(value).toISOString()
        } else if (clientKey === "capacity" && value !== undefined) {
          const intVal = parseInt(value, 10)
          value = isNaN(intVal) ? null : intVal
        } else if (
          ["categoryId", "cityId", "countryId", "locationId"].includes(
            clientKey
          ) &&
          value === ""
        ) {
          value = null
        }
        updates[dbKey] = value
      }
    }
    if (
      Object.keys(updates).length === 0 &&
      !titleChanged &&
      (!eventData.slug || eventData.slug === existingEvent.slug)
    ) {
      return NextResponse.json(
        { message: "No valid fields provided for update." },
        { status: 400 }
      )
    }

    const setClauses = []
    const values = []
    let paramIndex = 1
    for (const key in updates) {
      setClauses.push(`${key} = $${paramIndex++}`)
      if (
        updates[key] === null &&
        ["category_id", "city_id", "country_id", "location_id"].includes(key)
      ) {
        values.push(null)
      } else {
        values.push(updates[key])
      }
    }
    values.push(eventId)

    const updateQuery = `
      UPDATE events
      SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await query(updateQuery, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Event not found after update attempt" },
        { status: 404 }
      )
    }
    const updatedEvent = transformRow(result.rows[0])
    return NextResponse.json(updatedEvent)
  } catch (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        {
          message:
            "Update failed due to a unique constraint. Check title or slug.",
          details: error.detail,
        },
        { status: 409 }
      )
    }
    if (error.code === "23503") {
      return NextResponse.json(
        {
          message: "Invalid category, city, country, or user ID provided.",
          details: error.detail,
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: "Failed to update event", error: error.message },
      { status: 500 }
    )
  }
}
