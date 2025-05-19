// components/Icons/ChevronIcon.jsx
import React from "react"

export default function ChevronIcon({
  direction = "right",
  className,
  size,
  ...svgProps
}) {
  const path = direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"
  const style = size ? { width: size, height: size } : {}

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      {...svgProps}
    >
      <path d={path} />
    </svg>
  )
}
