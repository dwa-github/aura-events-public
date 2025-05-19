// components/CitiesDropdown/CitiesDropdown.jsx
"use client"

import React from "react"
import Dropdown from "../Dropdown/Dropdown"

const CitiesDropdown = ({ cities = [] }) => {
  const dropdownItems = cities.map((city) => ({
    href: `/events/cities/${
      city.name ? city.name.toLowerCase().replace(/\s+/g, "-") : city.id
    }`,
    label: city.name,
  }))

  dropdownItems.sort((a, b) => a.label.localeCompare(b.label))

  dropdownItems.unshift({
    href: "/events/cities",
    label: "All Cities",
  })

  return <Dropdown title="Cities" items={dropdownItems} />
}

export default CitiesDropdown
