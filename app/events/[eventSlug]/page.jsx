// app/events/[eventSlug]/page.jsx
import { notFound } from "next/navigation"
import { getEventData } from "@/lib/getEventData"
import { getUpcomingEvents } from "@/lib/getUpcomingEvents"
import EventPageClientInteractions from "./EventPageClientInteractions"

const combineDateAndTime = (dateString, timeString) => {
  if (!dateString || !timeString) return null

  const timeMatch = timeString.match(/(\d{1,2}:\d{2})\s*(AM|PM)?/i)
  if (!timeMatch) {
    return null
  }

  const timePart = timeMatch[1]
  const ampmPart = timeMatch[2] ? ` ${timeMatch[2].toUpperCase()}` : ""

  let datePartFormatted
  if (dateString instanceof Date) {
    const year = dateString.getFullYear()
    const month = (dateString.getMonth() + 1).toString().padStart(2, "0")
    const day = dateString.getDate().toString().padStart(2, "0")
    datePartFormatted = `${year}-${month}-${day}`
  } else if (typeof dateString === "string" && dateString.includes("T")) {
    datePartFormatted = dateString.split("T")[0]
  } else if (typeof dateString === "string") {
    datePartFormatted = dateString
  } else {
    return null
  }

  const parsableDateTimeString = `${datePartFormatted} ${timePart}${ampmPart}`
  try {
    const date = new Date(parsableDateTimeString)
    if (isNaN(date.getTime())) {
      return null
    }
    return date.toISOString()
  } catch (e) {
    return null
  }
}

export async function generateMetadata(props) {
  const { params } = props
  const eventSlug = params.eventSlug
  const event = await getEventData(eventSlug)

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The event you are looking for could not be found.",
    }
  }

  return {
    title: `${event.title || "Event Details"} | Aura Events`,
    description:
      event.description || "Discover amazing events happening near you.",
    openGraph: {
      title: event.title || "Event Details",
      description: event.description || "Join us for this exciting event!",
      images: event.imageUrl
        ? [
            {
              url: event.imageUrl,
              width: 1200,
              height: 630,
              alt: event.title || "Event Image",
            },
          ]
        : [],
    },
  }
}

export default async function EventPage(props) {
  const { params } = props
  const eventSlug = params.eventSlug
  const event = await getEventData(eventSlug)

  if (!event) {
    notFound()
  }

  const detailsSectionId = "event-details-anchor"

  const eventForActions = {
    ...event,
    startDateTime: combineDateAndTime(event.date, event.timeDetails),
    endDateTime: event.endTime
      ? combineDateAndTime(event.date, event.endTime)
      : null,
  }

  if (eventForActions.startDateTime && !eventForActions.endDateTime) {
    const startDate = new Date(eventForActions.startDateTime)
    eventForActions.endDateTime = new Date(
      startDate.getTime() + 2 * 60 * 60 * 1000
    ).toISOString()
  }

  const allUpcomingEvents = await getUpcomingEvents(5)
  const relatedEvents = allUpcomingEvents
    .filter((e) => e.id !== event.id && e.categoryId === event.categoryId)
    .slice(0, 3)

  return (
    <>
      <EventPageClientInteractions
        event={event}
        eventForActions={eventForActions}
        detailsSectionId={detailsSectionId}
        relatedEvents={relatedEvents}
      />
    </>
  )
}
