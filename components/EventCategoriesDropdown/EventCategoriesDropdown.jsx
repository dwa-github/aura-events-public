// components/EventCategoriesDropdown/EventCategoriesDropdown.jsx
"use client"

import React from "react"
import Dropdown from "../Dropdown/Dropdown"

const EventCategoriesDropdown = ({ categories = [] }) => {
  const dropdownItems = categories.map((category) => ({
    href: `/events/categories/${category.slug}`,
    label: category.name,
  }))

  dropdownItems.unshift({
    href: "/events/categories",
    label: "All Categories",
  })

  return <Dropdown title="Categories" items={dropdownItems} />
}

export default EventCategoriesDropdown
