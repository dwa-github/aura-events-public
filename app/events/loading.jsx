// app/events/loading.jsx
import LoadingDots from "@/components/ui/LoadingDots/LoadingDots"
import styles from "@/app/styles/GlobalLoader.module.css"

export default function EventsPageLoading() {
  return (
    <div className={styles.fullPageContainer}>
      <LoadingDots />
    </div>
  )
}
