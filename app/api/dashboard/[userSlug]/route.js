// app/api/dashboard/[userSlug]/route.js
import { NextResponse } from "next/server"
import { getUserDashboardData } from "@/lib/getUserDashboardData"
import { getUserStatsData } from "@/lib/getUserStatsData"
import { loadEventsData } from "@/lib/loadEventsData"

export async function GET(request, { params }) {
  const resolvedParams = await params
  const { userSlug } = resolvedParams
  if (!userSlug) {
    return NextResponse.json(
      { error: "User slug is required" },
      { status: 400 }
    )
  }

  try {
    const {
      events: rawAllEnrichedEvents,
      users: rawAllUsers,
      categories: rawAllCategories,
      cities: rawAllCities,
      countries: rawAllCountries,
      locations: rawAllLocations,
      artists: rawAllArtists,
      error: loadError,
    } = await loadEventsData()

    if (loadError) {
      return NextResponse.json({ error: loadError }, { status: 500 })
    }
    const allEnrichedEvents = Array.isArray(rawAllEnrichedEvents)
      ? rawAllEnrichedEvents
      : []
    const allUsers = Array.isArray(rawAllUsers) ? rawAllUsers : []
    const allCategories = Array.isArray(rawAllCategories)
      ? rawAllCategories
      : []
    const allCities = Array.isArray(rawAllCities) ? rawAllCities : []
    const allCountries = Array.isArray(rawAllCountries) ? rawAllCountries : []
    const allLocations = Array.isArray(rawAllLocations) ? rawAllLocations : []
    const allArtists = Array.isArray(rawAllArtists) ? rawAllArtists : []
    const dashboardData = await getUserDashboardData(
      userSlug,
      allEnrichedEvents,
      allUsers,
      allCategories,
      allCities
    )

    if (dashboardData.error || !dashboardData.user) {
      return NextResponse.json(
        { error: dashboardData.error || "User not found" },
        { status: 404 }
      )
    }

    const userSpecificEvents = Array.isArray(dashboardData.events)
      ? dashboardData.events
      : []
    const teamSpecificEvents = Array.isArray(dashboardData.teamEvents)
      ? dashboardData.teamEvents
      : []
    const stats = await getUserStatsData(
      dashboardData.user.id,
      userSpecificEvents,
      allCategories,
      allCities
    )
    const responseData = {
      user: dashboardData.user,
      events: userSpecificEvents,
      teamEvents: teamSpecificEvents,
      stats,
      categories: allCategories,
      cities: allCities,
      countries: allCountries,
      locations: allLocations,
      allArtists: allArtists,
    }
    return NextResponse.json(responseData)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
