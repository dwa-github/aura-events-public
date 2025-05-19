// components/AboutContactSection/AboutContactSection.jsx
import React from "react"
import Image from "next/image"
import styles from "./AboutContactSection.module.css"
import Button from "@/components/Button/Button"

const AboutContactSection = ({ onContactUsClick }) => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/about/about-us-image.jpg"
            alt="About Aura Events"
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            className={styles.aboutImage}
          />
        </div>

        <div className={styles.textContainer}>
          <h2 className={styles.sectionTitle}>About Aura Events</h2>
          <p className={styles.paragraph}>
            Your premier destination for discovering exciting events. We connect
            people with experiences that inspire, entertain, and enrich lives.
            Find your next adventure!
          </p>
          <div className={styles.buttonWrapper}>
            <Button variant="secondary" onClick={onContactUsClick}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutContactSection
