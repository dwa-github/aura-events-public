// app/dashboard/[userSlug]/page.jsx
"use client"

import { useState, useEffect, useContext, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import UserHeroSection from "@/components/UserHeroSection/UserHeroSection"
import StatsSection from "@/components/StatsSection/StatsSection"
import EventsTableSection from "@/components/EventsTableSection/EventsTableSection"
import TeamEventsTable from "@/components/TeamEventsTable/TeamEventsTable"
import AddEventModal from "@/components/AddEventModal/AddEventModal"
import SuccessModal from "@/components/SuccessModal/SuccessModal"
import UserContext from "@/context/UserContext"
import styles from "./page.module.css"
import LoadingDots from "@/components/ui/LoadingDots/LoadingDots"
import globalLoaderStyles from "@/app/styles/GlobalLoader.module.css"

export default function UserDashboardPage() {
  const params = useParams()
  const userSlug = params.userSlug
  const router = useRouter()
  const { currentUser } = useContext(UserContext)

  const [pageData, setPageData] = useState({
    user: null,
    userEvents: [],
    teamEvents: [],
    allCategories: [],
    allArtists: [],
    allCities: [],
    allCountries: [],
    allLocations: [],
    stats: { eventCount: 0, categoryCount: 0, cityCount: 0 },
    isLoading: true,
    error: null,
  })
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [newEventSlug, setNewEventSlug] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  const fetchData = useCallback(async () => {
    if (!userSlug) {
      setPageData((prev) => ({
        ...prev,
        isLoading: false,
        error: "User slug is missing.",
      }))
      return
    }
    setPageData((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch(`/api/dashboard/${userSlug}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error || `API request failed with status ${response.status}`
        )
      }
      const dashboardDataFromAPI = await response.json()

      setPageData({
        user: dashboardDataFromAPI.user,
        userEvents: dashboardDataFromAPI.events || [],
        teamEvents: dashboardDataFromAPI.teamEvents || [],
        allCategories: dashboardDataFromAPI.categories || [],
        allArtists: dashboardDataFromAPI.allArtists || [],
        allCities: dashboardDataFromAPI.cities || [],
        allCountries: dashboardDataFromAPI.countries || [],
        allLocations: dashboardDataFromAPI.locations || [],
        stats: dashboardDataFromAPI.stats || {
          eventCount: 0,
          categoryCount: 0,
          cityCount: 0,
        },
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load dashboard data."
      setPageData({
        user: null,
        userEvents: [],
        teamEvents: [],
        allCategories: [],
        allArtists: [],
        allCities: [],
        allCountries: [],
        allLocations: [],
        stats: { eventCount: 0, categoryCount: 0, cityCount: 0 },
        isLoading: false,
        error: errorMessage,
      })
    }
  }, [userSlug])

  useEffect(() => {
    setPageData((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      user: null,
      userEvents: [],
      teamEvents: [],
    }))
    setIsAddEventModalOpen(false)
    setIsSuccessModalOpen(false)
    setNewEventSlug(null)

    if (!currentUser || currentUser.slug !== userSlug) {
      setPageData((prev) => ({
        ...prev,
        isLoading: false,
        error: "Unauthorized access. Please log in as the correct user.",
        user: null,
        userEvents: [],
        teamEvents: [],
        allCategories: [],
        allArtists: [],
        allCities: [],
        allCountries: [],
        allLocations: [],
        stats: { eventCount: 0, categoryCount: 0, cityCount: 0 },
      }))
      return
    }

    if (userSlug) {
      fetchData()
    } else {
      setPageData((prev) => ({
        ...prev,
        isLoading: false,
        error: "User identifier missing.",
      }))
    }
  }, [userSlug, currentUser, fetchData])

  const handleOpenAddEventModal = () => {
    setIsAddEventModalOpen(true)
  }

  const handleCloseAddEventModal = () => {
    setIsAddEventModalOpen(false)
  }

  const handleEventSubmit = useCallback(
    async (newEventFromForm) => {
      if (!pageData.user || !pageData.user.id) {
        alert("User information is missing. Cannot add event.")
        return
      }
      setIsSubmittingEvent(true)

      try {
        const payload = {
          ...newEventFromForm,
          organizerUserId: pageData.user.id,
        }

        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.message ||
              `Failed to add event. Status: ${response.status}`
          )
        }

        const addedEvent = await response.json()
        await fetchData()
        handleCloseAddEventModal()
        setSuccessMessage(
          `Event "${addedEvent.title}" has been successfully created!`
        )
        if (addedEvent.slug) {
          setNewEventSlug(addedEvent.slug)
        }
        setIsSuccessModalOpen(true)

        if (addedEvent.slug) {
        }
      } catch (err) {
        alert(`Error adding event: ${err.message}`)
      } finally {
        setIsSubmittingEvent(false)
      }
    },
    [pageData.user, fetchData, router]
  )

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false)
    setNewEventSlug(null)
  }

  if (pageData.isLoading) {
    return (
      <div className={globalLoaderStyles.fullPageContainer}>
        <LoadingDots />
      </div>
    )
  }

  if (pageData.error) {
    return (
      <div className={styles.dashboardContainer}>
        <p className={styles.errorMessage}>
          Error: {pageData.error}
          {pageData.error.includes("Unauthorized access") && (
            <>
              {" "}
              Please{" "}
              <a href="/dashboard" className={styles.inlineLink}>
                login
              </a>
              .
            </>
          )}
        </p>
      </div>
    )
  }

  if (!pageData.user) {
    return (
      <div className={styles.dashboardContainer}>
        <p className={styles.errorMessage}>
          User data could not be loaded or found.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.dashboardContainer}>
      <UserHeroSection user={pageData.user} />
      <StatsSection
        initialStats={pageData.stats}
        userSlug={userSlug}
        sectionTitle="Your Activity Overview"
      />

      <div id="my-events-table">
        <EventsTableSection
          allEvents={pageData.userEvents}
          title="My Events"
          columns={["title", "category", "city", "actions"]}
          showAddButton={true}
          showRowActions={true}
          onAddEventClick={handleOpenAddEventModal}
        />
      </div>

      <TeamEventsTable teamEvents={pageData.teamEvents} title="Team Activity" />

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={handleCloseAddEventModal}
        categories={pageData.allCategories}
        allArtists={pageData.allArtists}
        cities={pageData.allCities}
        countries={pageData.allCountries}
        allLocations={pageData.allLocations}
        onEventSubmit={handleEventSubmit}
        isSubmitting={isSubmittingEvent}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="Event Created!"
        message={successMessage}
        eventSlug={newEventSlug}
      />
    </div>
  )
}
