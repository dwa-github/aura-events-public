// /app/api/book-event/route.js
import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request) {
  try {
    const { eventId, ticketQuantity } = await request.json()

    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing eventId." },
        { status: 400 }
      )
    }
    if (
      !ticketQuantity ||
      typeof ticketQuantity !== "number" ||
      ticketQuantity <= 0 ||
      !Number.isInteger(ticketQuantity)
    ) {
      return NextResponse.json(
        { message: "Invalid or missing ticketQuantity." },
        { status: 400 }
      )
    }

    const eventRes = await query(
      "SELECT capacity, simulated_attendee_count FROM events WHERE id = $1",
      [eventId]
    )

    if (eventRes.rows.length === 0) {
      return NextResponse.json({ message: "Event not found." }, { status: 404 })
    }

    const event = eventRes.rows[0]
    const currentAttendees = parseInt(event.simulated_attendee_count, 10)
    const capacity = parseInt(event.capacity, 10)

    if (currentAttendees + ticketQuantity > capacity) {
      return NextResponse.json(
        {
          message: "Not enough tickets available.",
          available: capacity - currentAttendees,
        },
        { status: 409 }
      )
    }

    const updateRes = await query(
      `UPDATE events 
       SET simulated_attendee_count = simulated_attendee_count + $1 
       WHERE id = $2
       RETURNING id, title, simulated_attendee_count, capacity`,
      [ticketQuantity, eventId]
    )

    if (updateRes.rows.length === 0) {
      return NextResponse.json(
        { message: "Failed to update event booking." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Booking successful!",
      event: updateRes.rows[0],
    })
  } catch (error) {
    console.error("API Booking Error:", error)
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    )
  }
}
