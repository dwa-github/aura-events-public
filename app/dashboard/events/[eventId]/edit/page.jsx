// app/dashboard/events/[eventId]/edit/page.jsx
import { notFound } from "next/navigation"
import EditEventPageClient from "./EditEventPageClient"

async function getEventForEditing(eventId) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
    cache: "no-store",
  })
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(
      `Failed to fetch event for editing: ${response.statusText} (Status: ${response.status})`
    )
  }
  return response.json()
}
async function getDropdownData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  try {
    const [categoriesRes, artistsRes, citiesRes, countriesRes, locationsRes] =
      await Promise.all([
        fetch(`${baseUrl}/api/categories`, { cache: "no-store" }),
        fetch(`${baseUrl}/api/artists`, { cache: "no-store" }),
        fetch(`${baseUrl}/api/cities`, { cache: "no-store" }),
        fetch(`${baseUrl}/api/countries`, { cache: "no-store" }),
        fetch(`${baseUrl}/api/locations`, { cache: "no-store" }),
      ])

    if (
      !categoriesRes.ok ||
      !artistsRes.ok ||
      !citiesRes.ok ||
      !countriesRes.ok ||
      !locationsRes.ok
    ) {
    }

    return {
      categories: categoriesRes.ok ? await categoriesRes.json() : [],
      artists: artistsRes.ok ? await artistsRes.json() : [],
      cities: citiesRes.ok ? await citiesRes.json() : [],
      countries: countriesRes.ok ? await countriesRes.json() : [],
      locations: locationsRes.ok ? await locationsRes.json() : [],
    }
  } catch (error) {
    return {
      categories: [],
      artists: [],
      cities: [],
      countries: [],
      locations: [],
    }
  }
}

export async function generateMetadata(props) {
  const { params } = props
  const eventId = params.eventId
  const event = await getEventForEditing(eventId).catch(() => null)

  if (!event) {
    return {
      title: "Edit Event Not Found",
    }
  }
  return {
    title: `Edit: ${event.title || "Event"} | Dashboard`,
  }
}

export default async function EditEventDashboardPage(props) {
  const { params } = props
  const { eventId } = params
  const eventToEdit = await getEventForEditing(eventId)
  const dropdownData = await getDropdownData()

  if (!eventToEdit) {
    notFound()
  }
  return (
    <EditEventPageClient
      eventToEdit={eventToEdit}
      dropdownData={dropdownData}
    />
  )
}
