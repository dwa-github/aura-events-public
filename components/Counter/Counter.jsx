// components/Counter/Counter.jsx
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import styles from "./Counter.module.css"

const Counter = ({
  targetValue,
  duration = 1500,
  title,
  description,
  link,
}) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entries[0].target)
        }
      },
      {
        threshold: 0.5,
      }
    )

    const currentRef = counterRef.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible || targetValue === undefined || targetValue === null) {
      if (targetValue === 0) setCount(0)
      return
    }

    let startTimestamp = null
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const currentDisplayValue = Math.floor(progress * targetValue)
      setCount(currentDisplayValue)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCount(targetValue)
      }
    }
    if (targetValue > 0) {
      setCount(0)
    } else {
      setCount(targetValue)
    }
    requestAnimationFrame(step)
  }, [isVisible, targetValue, duration])

  return (
    <Link href={link || "#"} className={styles.cardLink}>
      {" "}
      <div className={styles.counterCard} ref={counterRef}>
        <div className={styles.valueSide}>
          <div className={styles.counterValue}>{count.toLocaleString()}</div>
        </div>
        <div className={styles.contentSide}>
          <h3 className={styles.counterTitle}>{title}</h3>
          <p className={styles.counterDescription}>{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default Counter
