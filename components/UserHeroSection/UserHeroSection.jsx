// components/UserHeroSection/UserHeroSection.jsx
import React from "react"
import Image from "next/image"
import Button from "@/components/Button/Button"
import styles from "./UserHeroSection.module.css"

const DEFAULT_BACKDROP_IMAGE = "/images/cities/default-city.jpg"
const DEFAULT_AVATAR = "/images/users/default-avatar.png"

export default function UserHeroSection({ user }) {
  const {
    name = "User",
    avatarUrl = DEFAULT_AVATAR,
    bio = "No bio available.",
    role = "Member",
    backdropImageUrl = DEFAULT_BACKDROP_IMAGE,
  } = user || {}

  return (
    <div className={styles.userHeroBannerContainer}>
      <div
        className={styles.userHeroBanner}
        style={{
          backgroundImage: `linear-gradient(to top, rgba(37, 48, 62, 0.85) 0%, rgba(37, 48, 62, 0.55) 40%, rgba(37, 48, 62, 0) 100%), url(${backdropImageUrl})`,
        }}
      >
        <div className={styles.heroContent}>
          <div className={styles.profileImageWrapper}>
            <Image
              src={avatarUrl}
              alt={`${name}'s profile picture`}
              fill
              sizes="max-width: 320px"
              className={styles.profileImage}
              priority
            />
          </div>
          <div className={styles.textArea}>
            <h1 className={styles.userName}>{name}</h1>
            <p className={styles.userRole}>{role}</p>
            <p className={styles.userStory}>{bio}</p>
            <Button href="#user-content" variant="primary">
              More Info ↓
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
