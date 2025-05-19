// app/dashboard/[userSlug]/loading.jsx
import LoadingDots from "@/components/ui/LoadingDots/LoadingDots"
import styles from "@/app/styles/GlobalLoader.module.css"

export default function UserDashboardLoading() {
  return (
    <div className={styles.fullPageContainer}>
      <LoadingDots />
    </div>
  )
}
