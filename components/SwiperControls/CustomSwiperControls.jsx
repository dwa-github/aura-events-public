// components/SwiperControls/CustomSwiperControls.jsx
"use client"

import React, { useState, useEffect, useCallback } from "react"
import ChevronIcon from "@/components/Icons/ChevronIcon"
import styles from "./CustomSwiperControls.module.css"

export default function CustomSwiperControls({ swiper, totalSlides, loop }) {
  const [activeIndex, setActiveIndex] = useState(swiper?.initialSlide || 0)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const updateState = useCallback(() => {
    if (!swiper) return
    setActiveIndex(swiper.realIndex)
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }, [swiper])

  useEffect(() => {
    if (!swiper) return

    updateState()

    swiper.on("slideChange", updateState)
    swiper.on("init", updateState)
    swiper.on("resize", updateState)

    return () => {
      swiper.off("slideChange", updateState)
      swiper.off("init", updateState)
      swiper.off("resize", updateState)
    }
  }, [swiper, updateState])
  const handlePrev = () => swiper?.slidePrev()
  const handleNext = () => swiper?.slideNext()
  const handleDotClick = (index) => swiper?.slideToLoop(index)

  if (totalSlides <= 1) {
    return null
  }

  return (
    <div className={styles.controlsContainer}>
      <button
        className={`${styles.navButton} ${styles.navButtonPrev}`}
        onClick={handlePrev}
        disabled={!loop && isBeginning}
        aria-label="Previous slide"
      >
        <ChevronIcon direction="left" className={styles.navIcon} />
      </button>
      <div className={styles.dotsWrapper}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`${styles.paginationBullet} ${
              index === activeIndex ? styles.paginationBulletActive : ""
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <button
        className={`${styles.navButton} ${styles.navButtonNext}`}
        onClick={handleNext}
        disabled={!loop && isEnd}
        aria-label="Next slide"
      >
        <ChevronIcon direction="right" className={styles.navIcon} />
      </button>
    </div>
  )
}
