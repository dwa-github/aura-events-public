// components/UpcomingEventsSlider/UpcomingEventsSlider.jsx
"use client"

import React, { useRef, useState, useEffect } from "react"
import EventCardLarge from "@/components/EventCardLarge/EventCardLarge"
import styles from "./UpcomingEventsSlider.module.css"

import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { Navigation, Pagination } from "swiper/modules"

import ChevronIcon from "@/components/Icons/ChevronIcon"

export default function UpcomingEventsSlider({ events }) {
  const swiperRef = useRef(null)
  const [horizontalPadding, setHorizontalPadding] = useState(0)
  const sectionRef = useRef(null)

  const prevRef = useRef(null)
  const nextRef = useRef(null)

  useEffect(() => {
    const calculatePadding = () => {
      if (sectionRef.current) {
        const style = window.getComputedStyle(sectionRef.current)
        const paddingLeft = parseFloat(style.paddingLeft)
        setHorizontalPadding(paddingLeft)
      }
    }
    calculatePadding()
    window.addEventListener("resize", calculatePadding)
    return () => window.removeEventListener("resize", calculatePadding)
  }, [])

  const displayedEvents = React.useMemo(() => {
    if (!events) return []
    return events
      .filter((event) => {
        try {
          if (!event?.date) return false
          const eventDate = new Date(event.date)
          return !isNaN(eventDate.getTime()) && eventDate >= new Date()
        } catch (e) {
          return false
        }
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 6)
  }, [events])

  if (!events) {
    return (
      <section className={styles.sectionContainer}>
        <div className={styles.container}>
          {" "}
          <h2 className={styles.title}>Upcoming Events</h2>
          <p className={styles.loadingMessage}>Loading events...</p>{" "}
        </div>
      </section>
    )
  }

  if (displayedEvents.length === 0) {
    return (
      <section className={styles.sectionContainer} ref={sectionRef}>
        <div className={styles.container}>
          {" "}
          <h2 className={styles.title}>Upcoming Events</h2>
          <p className={styles.noEventsMessage}>No upcoming events found.</p>
        </div>
      </section>
    )
  }

  useEffect(() => {
    if (
      swiperRef.current?.swiper &&
      prevRef.current &&
      nextRef.current &&
      swiperRef.current.swiper.navigation &&
      displayedEvents.length > 0
    ) {
      const swiper = swiperRef.current.swiper
      swiper.params.navigation.prevEl = prevRef.current
      swiper.params.navigation.nextEl = nextRef.current
      swiper.navigation.destroy()
      swiper.navigation.init()
      swiper.navigation.update()
    }
  }, [horizontalPadding, displayedEvents])

  return (
    <section className={styles.sectionContainer} ref={sectionRef}>
      {" "}
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Upcoming Events</h2>
      </div>
      <div className={styles.sliderWrapper}>
        {horizontalPadding > 0 && (
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={"auto"}
            centeredSlides={true}
            loop={displayedEvents.length > 3}
            pagination={{
              el: ".swiper-pagination-custom",
              clickable: true,
              renderBullet: function (index, className) {
                return `<span class="${className} ${styles.paginationBullet}"></span>`
              },
            }}
            padding={[8, horizontalPadding, 8, horizontalPadding]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            className={styles.swiperContainer}
          >
            {displayedEvents.map((event) => (
              <SwiperSlide key={event.id} className={styles.swiperSlide}>
                <EventCardLarge event={event} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>{" "}
      {displayedEvents.length > 1 && (
        <div className={styles.controlsWrapper}>
          <button
            ref={prevRef}
            className={styles.navButton}
            aria-label="Previous slide"
          >
            <ChevronIcon direction="left" className={styles.navIcon} />
          </button>
          <div
            className={`${styles.paginationContainer} swiper-pagination-custom`}
          ></div>
          <button
            ref={nextRef}
            className={styles.navButton}
            aria-label="Next slide"
          >
            <ChevronIcon direction="right" className={styles.navIcon} />
          </button>
        </div>
      )}
    </section>
  )
}
