// app/api/upcoming-events/route.js
import { NextResponse } from "next/server"
import { getUpcomingEvents } from "@/lib/getUpcomingEvents"

export async function GET(request) {
  try {
    const limit = 8
    const events = await getUpcomingEvents(limit)
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch upcoming events" },
      { status: 500 }
    )
  }
}
