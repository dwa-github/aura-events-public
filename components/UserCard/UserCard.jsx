// components/UserCard/UserCard.jsx
"use client"

import { useContext } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import styles from "./UserCard.module.css"
import { LuUserCircle2 } from "react-icons/lu"
import UserContext from "@/context/UserContext"

const UserCard = ({ user }) => {
  const { loginUser } = useContext(UserContext)
  const router = useRouter()

  const handleUserSelect = (e) => {
    e.preventDefault()
    loginUser(user)
    router.push(`/dashboard/${user.slug}`)
  }

  if (!user) {
    return null
  }

  return (
    <a
      href={`/dashboard/${user.slug}`}
      className={styles.cardLink}
      aria-label={`Select user ${user.name}`}
      onClick={handleUserSelect}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.userCard}>
        <div className={styles.imageWrapper}>
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={`Profile picture of ${user.name}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              style={{ objectFit: "cover" }}
              priority={false}
              className={styles.userImage}
            />
          ) : (
            <LuUserCircle2
              size={parseInt(styles.placeholderIconSize) || 80}
              className={styles.placeholderIcon}
            />
          )}
        </div>
        <span className={styles.userName}>{user.name}</span>
      </div>
    </a>
  )
}

export default UserCard
