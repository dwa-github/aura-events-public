// app/not-found.jsx
import ErrorDisplay from "@/components/ui/ErrorDisplay/ErrorDisplay"
import styles from "@/app/styles/GlobalError.module.css"

export default function NotFound() {
  return (
    <div className={styles.contentBox}>
      <ErrorDisplay
        icon="🔍"
        title="404 - Page Not Found"
        message="Oops! The page you're looking for  seem to exist. It might have been moved, deleted, or you might have mistyped the URL."
        linkButtonText="Go to Homepage"
        linkButtonHref="/"
      />
    </div>
  )
}
