// app/page.jsx
export const revalidate = 86400

import { loadEventsData } from "@/lib/loadEventsData"
import UpcomingEventsSlider from "@/components/UpcomingEventsSlider/UpcomingEventsSlider"
import CtaBanner from "@/components/CtaBanner/CtaBanner"
import PopularCitiesSection from "@/components/PopularCitiesSection/PopularCitiesSection"
import HighlightedCategoriesSection from "@/components/HighlightedCategoriesSection/HighlightedCategoriesSection"
import HomePageClientInteractions from "./HomePageClientInteractions"
import AboutContactWrapper from "./AboutContactWrapper"

export default async function HomePage() {
  const eventData = await loadEventsData()

  const featuredEvent = eventData.featuredEvent

  const upcomingEventsForSlider = eventData.upcomingEvents || []

  const citiesData = eventData.cities || []

  const categoriesData = eventData.categories || []

  return (
    <>
      <HomePageClientInteractions featuredEvent={featuredEvent} />

      <HighlightedCategoriesSection categories={categoriesData} />

      <UpcomingEventsSlider events={upcomingEventsForSlider} />
      <CtaBanner />

      <PopularCitiesSection cities={citiesData} />
      <AboutContactWrapper />
    </>
  )
}
