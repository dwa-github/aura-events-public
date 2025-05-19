// components/CtaBanner/CtaBanner.jsx
import React from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./CtaBanner.module.css"
import Button from "@/components/Button/Button"
const CtaBanner = ({
  title = "Don't Miss Out!",
  subtitle = "Explore thousands of live events and find your next great experience.",
  buttonText = "Find Events Near You",
  buttonLink = "/events",
  imageUrl = "/images/banners/event-crowd-16-9.jpg",
  imageAlt = "Excited crowd at a live event",
}) => {
  return (
    <section className={styles.ctaBannerContainer}>
      <div className={styles.bannerWrapper}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, 1200px"
          style={{ objectFit: "cover" }}
          priority={false}
        />
        <div className={styles.gradientOverlay}></div>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {buttonText && buttonLink && (
            <div className={styles.ctaButtons}>
              <Link href={buttonLink}>
                <Button variant="primary">{buttonText}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CtaBanner
