// components/UsersSection/UsersSection.jsx
import { loadEventsData } from "@/lib/loadEventsData"
import UserCard from "@/components/UserCard/UserCard"
import styles from "./UsersSection.module.css"

const UsersSection = async () => {
  let users = []
  let error = null

  try {
    const data = await loadEventsData()
    users = data.users || []
  } catch (err) {
    error = "Could not load user information at this time."
  }

  return (
    <section className={styles.usersSection}>
      <h2 className={styles.sectionTitle}>Select User to Simulate Login</h2>
      <p className={styles.sectionDescription}>
        Choose a user profile below to simulate logging in and access their
        dashboard to manage events.
      </p>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!error && users.length === 0 && <p>No users found.</p>}
      {!error && users.length > 0 && (
        <div className={styles.usersGrid}>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </section>
  )
}

export default UsersSection
