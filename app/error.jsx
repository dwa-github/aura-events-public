// /app/error.jsx
"use client"

import ErrorDisplay from "@/components/ui/ErrorDisplay/ErrorDisplay"
import styles from "@/app/styles/GlobalError.module.css"

export default function GlobalError({ error, reset }) {
  console.error(error)

  return (
    <section className={styles.fullPageContainer}>
      <ErrorDisplay
        title="Oops! Something Went Wrong"
        message={
          process.env.NODE_ENV === "development"
            ? error?.message || "An unexpected error occurred."
            : "An unexpected error occurred. Please try again later."
        }
        actionButtonText="Try Again"
        onActionButtonClick={() => reset()}
        linkButtonText="Go to Homepage"
        linkButtonHref="/"
      />
    </section>
  )
}
