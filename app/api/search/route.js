// app/api/search/route.js
import { NextResponse } from "next/server"
import { loadEventsData } from "@/lib/loadEventsData"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    )
  }

  try {
    const allData = await loadEventsData()

    if (
      !allData ||
      !Array.isArray(allData.events) ||
      !Array.isArray(allData.cities) ||
      !Array.isArray(allData.countries) ||
      !Array.isArray(allData.categories)
    ) {
      throw new Error("Invalid data structure loaded for search.")
    }

    const cityMap = new Map(allData.cities.map((city) => [city.id, city]))
    const countryMap = new Map(
      allData.countries.map((country) => [country.id, country.name])
    )
    const categoryMap = new Map(
      allData.categories.map((cat) => [cat.id, cat.name])
    )

    const lowerCaseQuery = query.toLowerCase()

    const filteredEvents = allData.events.filter((event) => {
      const city = cityMap.get(event.cityId)
      const countryName = city ? countryMap.get(city.countryId) : null
      const categoryName = categoryMap.get(event.categoryId)

      return (
        event.title?.toLowerCase().includes(lowerCaseQuery) ||
        event.description?.toLowerCase().includes(lowerCaseQuery) ||
        event.location?.toLowerCase().includes(lowerCaseQuery) ||
        (Array.isArray(event.artists) &&
          event.artists.some((artist) =>
            artist?.name?.toLowerCase().includes(lowerCaseQuery)
          )) ||
        city?.name?.toLowerCase().includes(lowerCaseQuery) ||
        countryName?.toLowerCase().includes(lowerCaseQuery) ||
        categoryName?.toLowerCase().includes(lowerCaseQuery)
      )
    })

    const enrichedResults = filteredEvents.map((event) => ({
      ...event,
      categoryName: categoryMap.get(event.categoryId) || "Category",
      cityName: cityMap.get(event.cityId)?.name || "City",
    }))

    return NextResponse.json(enrichedResults)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    )
  }
}
